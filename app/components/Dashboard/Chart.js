import React, {Component} from 'react';
import {Doughnut,Line} from 'react-chartjs-2';
import styles from './Chart.css'

class Chart extends Component{
  constructor(props){
    super(props);
    this.state = {
      chartData:props.chartData
    }
  }

  render(){
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    
    return (
      <div className={styles.chart}>
        <br/>
        <br/><br/><br/><br/><br/><br/><br/>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Doughnut
          data={this.state.chartData}
          options={{
            title:{
              display:true,
              text: "Top Service Representatives:",
              fontSize:36
            },
            legend:{
              display:false,
              position:this.props.legendPosition
            }
          }}
        />
      </div>
    )
}
}

export default Chart;