import React from "react";
import axios from "axios";
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

class Test extends React.Component {
    constructor(props){
        super()
        this.state = {
          ticker: [],
          tickerDailyQuote: [],
          chartOptions: {
              series: [{
                  data: [1, 2, 3]
              }]
          }
        }
    }

   options = {
        title: {
          text: 'My chart'
        },
        series: [
          {
            data: [1, 2, 1, 4, 3, 6, 7, 3, 8, 6, 9]
          }
        ]
      };

    getTicker = () => {
        axios.get(`https://finnhub.io/api/v1/search?q=apple&token=c1lmcqq37fkqle0e1u80`)
        .then(({ data }) => {
            // console.log("Test");
            // console.log(data.result[0].displaySymbol);
            this.setState({ticker: data.result[0].displaySymbol});
        })
    }

    getTickerDailyQuote = () => {
        axios.get(`https://finnhub.io/api/v1/quote?symbol=AAPL&token=c1lmcqq37fkqle0e1u80`)
        .then(({ data }) => {
            let dailyQuoteArray = Object.values(data)
            console.log(dailyQuoteArray[0]);
            this.setState({tickerDailyQuote: dailyQuoteArray[0]});
        })
    }

    getTickerCandles = () => {
        axios.get(`https://finnhub.io/api/v1/stock/candle?symbol=AAPL&resolution=1&from=1615298999&to=1615302599&token=c1lmcqq37fkqle0e1u80`)
        .then(({ data }) => {
            let test = Object.values(data)
            let allArrs = [];
            console.log(test[0].length);
            console.log(test[0]);
            console.log(allArrs);
            // this.setState({tickerDailyQuote: dailyQuoteArray[0]});
        })
    }

    componentDidMount() {
          this.getTicker();
          this.getTickerDailyQuote();
          this.getTickerCandles();
    }

    render (){
        return (
            <div>
                <h1>TEST123</h1>
                <p>{this.state.ticker}</p>
                <p>{this.state.tickerDailyQuote}</p>
                <HighchartsReact 
                    highcharts={Highcharts} 
                    constructorType={'stockChart'} 
                    options={this.options} 
                />

            </div>

        )
    }
}

export default Test
