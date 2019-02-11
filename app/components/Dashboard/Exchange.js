import React, {Component} from 'react';
const TronHttpClient = require("tron-http-client");
const client = new TronHttpClient();
import styles from "./Exchange.css";
import Secondary from "../Content/Secondary";
import axios from "axios";

class Exchange extends Component {

  constructor(){
    super();
    this.generateChartData = this.generateChartData.bind(this);
    this.addDataPoint = this.addDataPoint.bind(this);
    this.setThresholds = this.setThresholds.bind(this);
    this.state = {
      chartData:this.generateChartData(),
    }
  }

  generateChartData() {
    var chartData = [];
    axios.get('https://graphs2.coinmarketcap.com/currencies/tron/')
        .then(res => window.localStorage.setItem("VOLUME",JSON.stringify(res.data)))
        .catch(err => console.log(err))

    var data = JSON.parse(window.localStorage.getItem("VOLUME"));
    var length = data.price_usd.length;

    for (var i = 0; i < length; i++) {

      var priceItem = data.price_usd[i].toString();
      var price = priceItem.split(",");
      var priceInUsd = Number(Math.round(price[1]+'e'+3)+'e-'+3);
      var volumeItem = data.volume_usd[i].toString();
      var volume = volumeItem.split(",");
      var volumeInUsd = Number(Math.round(volume[1]+'e'+3)+'e-'+3);
      var newDate = new Date(Number(volume[0]));
      newDate.setHours(0, i, 0, 0);

      var a = priceInUsd;
      var b = volumeInUsd;

      chartData.push({
        date: newDate,
        value: a,
        volume: b
      });
    }
    return chartData;
  }

  addDataPoint() {

  }

  setThresholds() {

  }

  componentDidMount(){

    var chart = AmCharts.makeChart("chartdiv", {

      type: "stock",
      "theme": "none",
      pathToImages: "https://www.amcharts.com/lib/3/images/",
      glueToTheEnd: true,

      categoryAxesSettings: {
        minPeriod: "mm"
      },

      dataSets: [{
        color: "#0A578E",
        fieldMappings: [{
          fromField: "value",
          toField: "value"
        }, {
          fromField: "volume",
          toField: "volume"
        }],

        dataProvider: this.state.chartData,
        categoryField: "date"
      }],

      panels: [{
        showCategoryAxis: false,
        title: "Value",
        percentHeight: 70,

        stockGraphs: [{
          id: "g1",
          valueField: "value",
          type: "smoothedLine",
          lineThickness: 2,
          bullet: "round"
        }],

        stockLegend: {
          valueTextRegular: " ",
          markerType: "none"
        },

        valueAxes: [{
          guides: []
        }]
      },

        {
          title: "Volume",
          percentHeight: 30,
          stockGraphs: [{
            valueField: "volume",
            type: "column",
            cornerRadiusTop: 2,
            fillAlphas: 1
          }],

          stockLegend: {
            valueTextRegular: " ",
            markerType: "none"
          }
        }
      ],

      chartScrollbarSettings: {
        graph: "g1",
        usePeriod: "10mm",
        position: "top"
      },

      chartCursorSettings: {
        valueBalloonsEnabled: true
      },

      periodSelector: {
        position: "top",
        dateFormat: "YYYY-MM-DD JJ:NN",
        inputFieldWidth: 150,
        periods: [{
          period: "hh",
          count: 1,
          label: "1 hour",
          selected: true

        }, {
          period: "hh",
          count: 2,
          label: "2 hours"
        }, {
          period: "hh",
          count: 5,
          label: "5 hour"
        }, {
          period: "hh",
          count: 12,
          label: "12 hours"
        }, {
          period: "MAX",
          label: "MAX"
        }]
      },

      panelsSettings: {
        usePrefixes: true
      }
    });

    setInterval(function() {
      // add data point
      var dataProvider = chart.dataSets[0].dataProvider;
      var newDate = new Date(dataProvider[dataProvider.length - 1].date.getTime());
      newDate.setHours(newDate.getHours(), newDate.getMinutes() + 1, newDate.getSeconds());

      axios.get('https://graphs2.coinmarketcap.com/currencies/tron/')
          .then(res => window.localStorage.setItem("VOLUME",JSON.stringify(res.data)))
          .catch(err => console.log(err))

      var data = JSON.parse(window.localStorage.getItem("VOLUME"));
      var length = data.price_usd.length;

        var priceItem = data.price_usd[length - 1].toString();
        var price = priceItem.split(",");
        var priceInUsd = Number(Math.round(price[1]+'e'+3)+'e-'+3);
        var volumeItem = data.volume_usd[length - 1].toString();
        var volume = volumeItem.split(",");
        var volumeInUsd = Number(Math.round(volume[1]+'e'+3)+'e-'+3);

      dataProvider.push({
        date: newDate,
        value: priceInUsd,
        volume: volumeInUsd
      });
      dataProvider.shift();

      // update indictors
      //chart.panels[0].valueAxes[0].guides[0].value = Math.round(Math.random() * 500) + 1000;
      //chart.panels[0].valueAxes[0].guides[1].value = chart.panels[0].valueAxes[0].guides[0].value + Math.round(Math.random() * 400) + 200;

      chart.validateData();
    }, 60000);
  }

  render() {
    document.getElementById("contentSecondary").style.background = 'none';

    return (
      <Secondary>
        <div id="chartdiv" className={styles.chartdiv}></div>
      </Secondary>
    );
  }
}
export default Exchange;
