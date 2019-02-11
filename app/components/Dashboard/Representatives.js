import React, {Component} from 'react';
import Chart from './Chart';
const TronHttpClient = require("tron-http-client");
const client = new TronHttpClient();
import Secondary from "../Content/Secondary";

class Representatives extends Component {

  constructor(){
    super();
    this.state = {
      chartData:{},
      status : false
    }
    this.getRandomColor = this.getRandomColor.bind(this);
  }

  componentWillMount(){
    this.populateRepresentativesScreen();
  }

  populateRepresentativesScreen(){
    let loaded = null;
    try {
      loaded = JSON.parse(window.localStorage.getItem("REPRESENTATIVES_LIST"));
    } catch (e) {
      console.log(e);
    }
    var labelArray = new Array();
    var dataArray = new Array();
    var colorArray = new Array();
    if(loaded!=null){
      for(var i=0; i< loaded.length; i++){
        var element = loaded[i];
        labelArray[i] = ""+element.url;
        dataArray[i] = +element.votecount;
        colorArray[i] = ""+this.getRandomColor();
      }
    }
    
    this.setState({
      chartData:{
        labels: labelArray,
        datasets:[
          {
            label:'Representatives',
            data:dataArray,
            backgroundColor:colorArray
          }
        ]
      }
    });
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#00';
    for (var i = 0; i < 4; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  render() {
    document.getElementById("contentSecondary").style.background = 'none';

    return (
      <Secondary>
  <Chart chartData={this.state.chartData} location="Representatives" legendPosition="bottom" id="charts"/>
   </Secondary>
    );
  }
}
export default Representatives;
