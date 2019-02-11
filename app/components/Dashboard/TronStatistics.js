import React, {Component} from 'react';
import {Doughnut} from 'react-chartjs-2';
import styles from './TronStatistics.css';

class TronStatistics extends Component{
  constructor(props){
    super(props);
  }

  componentDidMount() {
      var xAngle = 0, yAngle = 0;
      document.addEventListener('keydown', function(e) {
          switch(e.keyCode) {

              case 37: // left
                  yAngle -= 90;
                  break;

              case 38: // up
                  xAngle += 90;
                  break;

              case 39: // right
                  yAngle += 90;
                  break;

              case 40: // down
                  xAngle -= 90;
                  break;
          };

          if(document.getElementById("cube") != null){
              document.getElementById("cube").style.webkitTransform = "rotateX("+xAngle+"deg) rotateY("+yAngle+"deg)";
            }

      }, false);



  }

    goToSite = () => require("electron").shell.openExternal("https://tronscan.org");

    render(){

    var statistics = JSON.parse(window.localStorage.getItem("TRON_STATISTICS"));
    var statistic = statistics[statistics.length - 1];

    var volume = JSON.parse(window.localStorage.getItem("VOLUME"));
    var length = volume.price_usd.length;

    var priceItem = volume.price_usd[length -1].toString();
    var price = priceItem.split(",");
    var priceInUsd = Number(Math.round(price[1]+'e'+3)+'e-'+3);

    var marketCapItem = volume.market_cap_by_available_supply[length -1].toString();
    var marketCap = marketCapItem.split(",");
    var marketCapInUsd = marketCap[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return (
        <div>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>

            <div id="experiment" className={styles.experiment}>
            <div id="cube" className={styles.cube}>
                <div className={styles.face1}>
                    <strong>Blockchain Size:</strong> {statistic.blockchainSize}
                </div>
                <div className={styles.face2}>
                    <strong>Current Price:</strong> {priceInUsd} USD
                </div>
                <div className={styles.face3}>
                    <strong>Total Addresses:</strong> {statistic.totalAddress}
                </div>
                <div className={styles.face4}>
                    <strong>Total Transactions:</strong> {statistic.totalTransaction}
                </div>
                <div className={styles.face5}>
                    <strong>Market Cap:</strong> {marketCapInUsd} USD
                </div>
                <div className={styles.face6} onClick={this.goToSite}>
                    More content
                </div>
            </div>
        </div>
        </div>
    )
}
}

export default TronStatistics;