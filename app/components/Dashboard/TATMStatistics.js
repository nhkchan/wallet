import React, {Component} from 'react';
import {Doughnut} from 'react-chartjs-2';
import styles from './TATMStatistics.css';

class TATMStatistics extends Component{
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

    goToSite = () => require("electron").shell.openExternal("https://www.tronmachines.com");

    render(){

    var statistics = JSON.parse(window.localStorage.getItem("TATM_STATISTICS"));
    var statistic = statistics[statistics.length - 1];

    return (
        <div>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>

            <div id="experiment" className={styles.experiment}>
            <div id="cube" className={styles.cube}>
                <div className={styles.face1}>
                    <strong>Total Hodlers:</strong> {statistic.nrOfTokenHolders}
                </div>
                <div className={styles.face2}>
                    <strong>Total Issued:</strong> {statistic.issued}
                </div>
                <div className={styles.face3}>
                    <strong>Issued Percentage:</strong> {statistic.issuedPercentage} %
                </div>
                <div className={styles.face4}>
                    <strong>Remaining Tokens:</strong> {statistic.remaining}
                </div>
                <div className={styles.face5}>
                    <strong>Total Transactions:</strong> {statistic.totalTransactions}
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

export default TATMStatistics;