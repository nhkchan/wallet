import React, {Component} from "react";
import {NavLink, withRouter} from "react-router-dom";
import {Button, Dropdown} from "semantic-ui-react";

import {connect} from "react-redux";
import Header from "../ContentPrimaryHeader";
import Wallet from "./Wallet";

import ReactMarkdown from 'react-markdown';

import {MoreIcon, SendIcon} from "../Icons";
import styles from "./WalletList.css";
import buttonStyles from "../Button.css";
import LogoIco from '../Tokens/Logo-icon.ico';

const TOS_KEY = 'USER_ACCEPTED_TOS';
const ACCEPTED = 'ACCEPTED';

//const tos = fs.readFileSync(path.join(__dirname, 'components/Wallet/tos.md'), 'utf8');
//console.log(tos.split('\n').join('\\n'));
const tos = "# Wallet Terms of Use\n\n_Our Terms of Use have been updated as of November 6, 2018_\n\nThis is a binding Agreement between TronATM. (\"\" or \"We\") and the person, persons, or entity (\"You\" or \"Your\") using the service, Software, or application (\"Software\").\n\n**Rights and Obligations**\n\n provides the Software solely on the terms and conditions set forth in this Agreement and on the condition that You accept and comply with them. By using the Software You (a) accept this Agreement and agree that You are legally bound by its terms; and (b) represent and warrant that: (i) You are of legal age to enter into a binding agreement; and (ii) if You are a corporation, governmental organization or other legal entity, You have the right, power and authority to enter into this Agreement on behalf of the corporation, governmental organization or other legal entity and bind them to these terms.\n\nThis Software functions as a free, open source. The Software does not constitute an account where We or other third parties serve as financial intermediaries or custodians of Your cryptocurrencies(s).\n\nWhile the Software has undergone beta testing and continues to be improved by feedback from the open-source user and developer community, We cannot guarantee there will not be bugs in the Software. You acknowledge that Your use of this Software is at Your own discretion and in compliance with all applicable laws. You are responsible for safekeeping Your passwords, private key, twenty-four-Seed Words, and any other codes You use to access the Software.\n\nIF YOU LOSE ACCESS TO YOUR WALLET OR YOUR ENCRYPTED PRIVATE KEYS AND YOU HAVE NOT SEPARATELY STORED A BACKUP OF YOUR WALLET AND CORRESPONDING PASSWORD, YOU ACKNOWLEDGE AND AGREE THAT ANY CRYPTOCURRENCY YOU HAVE ASSOCIATED WITH THAT WALLET WILL BECOME INACCESSIBLE. All transaction requests are irreversible. The authors of the Software, employees of ,  cannot retrieve Your private keys or passwords if You lose or forget them and cannot guarantee transaction confirmation as they do not have control over the network.\n\n\n**Disclaimer**\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OF THE SOFTWARE, EMPLOYEES AND AFFILIATES OF TRONATM. BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\nIN NO EVENT WILL TRONATM OR ITS AFFILIATES, OR ANY OF ITS OR THEIR RESPECTIVE SERVICE PROVIDERS, BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY USE, INTERRUPTION, DELAY OR INABILITY TO USE THE SOFTWARE, LOST REVENUES OR PROFITS, DELAYS, INTERRUPTION OR LOSS OF SERVICES, BUSINESS OR GOODWILL, LOSS OR CORRUPTION OF DATA, LOSS RESULTING FROM SYSTEM OR SYSTEM SERVICE FAILURE, MALFUNCTION OR SHUTDOWN, FAILURE TO ACCURATELY TRANSFER, READ OR TRANSMIT INFORMATION, FAILURE TO UPDATE OR PROVIDE CORRECT INFORMATION, SYSTEM INCOMPATIBILITY OR PROVISION OF INCORRECT COMPATIBILITY INFORMATION OR BREACHES IN SYSTEM SECURITY, OR FOR ANY CONSEQUENTIAL, INCIDENTAL, INDIRECT, EXEMPLARY, SPECIAL OR PUNITIVE DAMAGES, WHETHER ARISING OUT OF OR IN CONNECTION WITH THIS AGREEMENT, BREACH OF CONTRACT, TORT (INCLUDING NEGLIGENCE) OR OTHERWISE, REGARDLESS OF WHETHER SUCH DAMAGES WERE FORESEEABLE AND WHETHER OR NOT WE WERE ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.\n\n**overning Law and Jurisdiction**\n\nThese Conditions are deemed to have been executed in the province of Quebec (Canada). These\nConditions are governed by the laws of the province of Quebec (Canada) and the laws of Canada\napplicable therein (without regard to conflicts of law principles). The Parties irrevocably submit all\ndisputes arising out of or relating to these Conditions to Quebec courts, judicial district of Quebec.\nThis last sentence does not apply to consumers of the province of Quebec (Canada) to whom\nQuebec's Consumer Protection Act ( chapter p-40.1) applies.\n\n\n**Communications**\n\nAny notice or communication which is required or permitted to be given under these Conditions\nmust be made in writing and will be deemed to have been effectively transmitted if sent by email to\nthe following address:\n\na) in the case of the Business:  legal@tron.watch ; and\n\nSuch notice or communication will be deemed to have been given and received on the day it is\nactually delivered or sent (or if that day is not a business day, on the following business day), unless\nit is delivered or sent after 4:30 p.m., in which case it will be deemed to have been given and\nreceived on the next business day.\n";

class WalletList extends Component {

  constructor(props){
    super(props);
    const tosAccepted = (window.localStorage.getItem(TOS_KEY) === ACCEPTED);
    this.state = {
      tosAccepted,
      isChecked: false
    }
  }

  handleChange() {
    this.setState({ isChecked: !this.state.isChecked })
  }

  clickAccept(){
    if(this.state.isChecked){
      window.localStorage.setItem(TOS_KEY, ACCEPTED);
      this.setState({
        tosAccepted: true
      });
    }
  }

  renderTos() {
    if(this.state.tosAccepted)
      return '';

    return (
      <div className={styles.tosContainer}>
        <div className={styles.tosHeader}>
          The TronATM Desktop Wallet is currently in <span>BETA</span>.<br/><br/>
          <div className={styles.tosSubText}>Even though it is running on the TRON Mainnet, it is still BETA software which changes often and can contain bugs. Use at
          your own risk.<br/><br/>
          Always make sure you have backups of your private key and recovery phrases.</div>
        </div>
        <div className={styles.tosBox}>
          <div className={styles.tos}>
              <ReactMarkdown source={tos}/>
          </div>

          <div className={styles.tosCheckboxContainer}>
            <label><input onChange={this.handleChange.bind(this)} value={this.state.tosAccepted} type="checkbox"/>I read and accept the Terms of Service</label>
          </div>

          <div className={styles.tosBtn} onClick={this.clickAccept.bind(this)}>Accept</div>
        </div>
      </div>
    )
  }

  render() {
    let accounts = this.props.wallet.persistent.accounts;
    let accountKeys = Object.keys(accounts);
    return (
      <div className={styles.container}>
        {this.renderTos()}
        <br/>
        <div align="center"><img align="center" src={LogoIco}  width="36" height="36"/></div>
        <br/>
        <Header className={styles.header} text="My Wallets :">
          <Dropdown icon={<MoreIcon/>}>
            <Dropdown.Menu>
              <NavLink to="/wallets/broadcast">
                <Dropdown.Item
                  text="Broadcast Signed Transaction"
                  icon={<SendIcon/>}
                />
              </NavLink>

              <NavLink to="/wallets/createtransfer">
                <Dropdown.Item text="Create Raw Transfer" icon={<SendIcon/>}/>
              </NavLink>
              <NavLink to="/wallets/createassettransfer">
                <Dropdown.Item
                  text="Create Raw Asset Transfer"
                  icon={<SendIcon/>}
                />
              </NavLink>
              <NavLink to="/wallets/createfreeze">
                <Dropdown.Item
                  text="Create Raw Freeze Transaction"
                  icon={<SendIcon/>}
                />
              </NavLink>
            </Dropdown.Menu>
          </Dropdown>
        </Header>
        <div className={styles.buttonContainer}>
          <NavLink to="/wallets/create">
            <Button className={`${buttonStyles.button} ${buttonStyles.gradient}`}
            >
              Access Wallet
            </Button>
          </NavLink>
        </div>
        <div className={styles.walletContainer}>
          {accountKeys.map((key, i) => (
            // NavLink in Wallet Component
            <Wallet
              key={key}
              pub={accounts[key].publicKey}
              trx={accounts[key].trx}
              name={accounts[key].name}
              tokens={accounts[key].tokens}
              index={accounts[key].publicKey}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default withRouter(
  connect(
    state => ({wallet: state.wallet}),
    dispatch => ({})
  )(WalletList)
);
