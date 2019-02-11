
import type Transport from "@ledgerhq/hw-transport";
import BIPPath from "bip32-path";

const { foreach } = require("./utils");

/**
 * TRON API
 *
 * @example
 * import AppTron from "@ledgerhq/hw-app-tron";
 * const tron = new AppTron(transport);
 */
const PATH_SIZE = 4;
const PATHS_LENGTH_SIZE = 1;
const CHUNK_SIZE = 233;
const CLA = 0xe0;
const ADDRESS = 0x02
const SIGN = 0x04
const VERSION = 0x06

export default class Tron {
  transport: Transport<*>;

  constructor(transport: Transport<*>, scrambleKey: string = "TRX") {
    this.transport = transport;
    transport.decorateAppAPIMethods(
      this,
      ["getAddress", "signTransaction", "getAppConfiguration"],
      scrambleKey
    );
  }

  /**
   * get Tron address for a given BIP 32 path.
   *
   * @param path a path in BIP 32 format
   * @param display optionally enable or not the display
   * @return an object with a publicKey, address and (optionally) chainCode
   * @example
   * const result = await tron.getAddress("44'/195'/0'/0/0");
   * const { publicKey, address } = result;
   */
  async getAddress(
    path: string,
    display?: boolean,
  ): Promise<{
    publicKey: string,
    address: string,
  }> {
    const bipPath = BIPPath.fromString(path).toPathArray();

    const p1 = display ? 0x01 : 0x00;
    const p2 = 0x00;
    const data = Buffer.alloc(1 + bipPath.length * 4);

    data.writeInt8(bipPath.length, 0);
    bipPath.forEach((segment, index) => {
      data.writeUInt32BE(segment, 1 + index * 4);
    });

    const response = await this.transport.send(CLA, ADDRESS, p1, p2, data);

    const result = {};
    const publicKeyLength = response[0];
    const addressLength = response[1 + publicKeyLength];

    result.publicKey = response.slice(1, 1 + publicKeyLength).toString("hex");

    result.address = response
      .slice(1 + publicKeyLength + 1, 1 + publicKeyLength + 1 + addressLength)
      .toString("ascii");

    return result;
  }


  /**
   * sign a Tron transaction with a given BIP 32 path
   *
   * @param path a path in BIP 32 format
   * @param rawTxHex a raw transaction hex string
   * @return a signature as hex string
   * @example
   * const signature = await tron.signTransaction("44'/195'/0'/0/0", "12000022800000002400000002614000000001315D3468400000000000000C73210324E5F600B52BB3D9246D49C4AB1722BA7F32B7A3E4F9F2B8A1A28B9118CC36C48114F31B152151B6F42C1D61FE4139D34B424C8647D183142ECFC1831F6E979C6DA907E88B1CAD602DB59E2F");
   */
  async signTransaction(
    path: string,
    rawTxHex: string,
  ): Promise<string> {
    console.log("*************");
    console.log(path);
    const bipPath = BIPPath.fromString(path).toPathArray();
    console.log(bipPath);
    const rawTx = new Buffer(rawTxHex, "hex");
    console.log(rawTx);

    let buffers = [];
    let offset = 0;

    while (offset !== rawTx.length) {
        let maxChunkSize = offset === 0 ?
          CHUNK_SIZE - PATHS_LENGTH_SIZE - (bipPath.length * PATH_SIZE)
          : CHUNK_SIZE;
  
        let chunkSize = offset + maxChunkSize > rawTx.length
            ? rawTx.length - offset
            : maxChunkSize;
  
        let buffer = new Buffer(
          offset === 0 ? 1 + bipPath.length * PATH_SIZE + chunkSize : chunkSize
        );
  
        if (offset === 0) {
          buffer[0] = bipPath.length;
          bipPath.forEach((element, index) => {
            buffer.writeUInt32BE(element, 1 + 4 * index);
          });
          rawTx.copy(buffer, PATHS_LENGTH_SIZE + PATH_SIZE * bipPath.length, offset, offset + chunkSize);
        } else {
          rawTx.copy(buffer, 0, offset, offset + chunkSize);
        }
  
        buffers.push(buffer);
        offset += chunkSize;
      }
  
    if (buffers.length === 1) {
        buffers = [
          [0x10, buffers[0]]
        ];
    } else if (buffers.length > 1) {
        buffers = buffers.map((p, i) => {
          let startByte;
          if (i === 0) {
            startByte = 0x00;
          } else if (buffers.length > 1 && i === buffers.length - 1) {
            startByte = 0x90;
          } else {
            startByte = 0x80;
          }
  
          return [startByte, p];
        });
    }

    let response;
    return foreach(buffers, ([startByte, data]) => {
      //console.log("SENDING", startByte, data.length, data.toString("hex"));
      return this.transport
        .send(CLA, SIGN, startByte, 0x00, data)
        .then(apduResponse => {
          response = apduResponse;
        });
    }).then(() => response.slice(0,65));

  }

  /**
   * get the version of the Tron app installed on the hardware device
   *
   * @return an object with a version
   * @example
   * const result = await tron.getAppConfiguration();
   *
   * {
   *   "version": "1.0.3"
   * }
   */
  async getAppConfiguration(): Promise<{
    version: string
  }> {
    const response = await this.transport.send(CLA, VERSION, 0x00, 0x00);
    const result = {};
    result.version = "" + response[1] + "." + response[2] + "." + response[3];
    return result;
  }
}