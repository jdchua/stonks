import React from "react";
import axios from "axios";
import TextField from '@material-ui/core/TextField';

const CHART_URL = "https://widget.finnhub.io/widgets/stocks/chart?watermarkColor=%231db954&amp;backgroundColor=%23222222&amp;textColor=white";
const TICKER_URL = "https://finnhub.io/api/v1/search?token=c1lmcqq37fkqle0e1u80";
const DAILYQUOTE_URL = "https://finnhub.io/api/v1/quote?token=c1lmcqq37fkqle0e1u80";

class Test extends React.Component {
    constructor(props){
        super()
        this.state = {
          ticker: [],
          tickerDailyQuote: [],
          data: [],
          chartUrl: "",
          query: ""
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit (event) {
        event.preventDefault();
    }
    
    
    handleInputChange = () => {
        this.setState({query: this.inputRef.value},  () => {
            this.getTicker();
        });
    }

    getTicker = () => {
        let query = this.state.query;
        axios.get(`${TICKER_URL}&q=${query.replace(/\s/g, "")}`)
        .then(({ data }) => {
            this.setState({ticker: data.result[0].displaySymbol}, () => {
                axios.get(`${DAILYQUOTE_URL}&symbol=${this.state.ticker}`)
                .then(({ data }) => {
                    let dailyQuoteArray = Object.values(data);
                    this.setState({tickerDailyQuote: dailyQuoteArray[0]});
                })
            });
            this.setState({chartUrl: CHART_URL + "&symbol=" + data.result[0].displaySymbol});
        })
    }

    // getTickerDailyQuote = () => {
    //     // let ticker = this.state.ticker;
    //     // console.log("TEST" + this.state.ticker);
    //     axios.get(`${DAILYQUOTE_URL}&symbol=${this.state.ticker}`)
    //     .then(({ data }) => {
    //         let dailyQuoteArray = Object.values(data);
    //         this.setState({tickerDailyQuote: dailyQuoteArray[0]});
    //     })
    // }

    // getTickerCandles = () => {
    //     axios.get(`https://finnhub.io/api/v1/stock/candle?symbol=AAPL&resolution=D&from=1615298999&to=1622682167&token=c1lmcqq37fkqle0e1u80`)
    //     .then(({ data }) => {
    //         let test = Object.values(data)
    //         this.setState({data: test[0]});
    //     })
    // }

    componentDidMount() {
        //   this.getTickerDailyQuote();
        //   this.getTickerCandles();
    }

    render (){
        return (
            <div>
                <form class="search" noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                    <TextField onChange={this.handleInputChange} inputRef={ref => { this.inputRef = ref; }} id="outlined-basic" label="Search" variant="outlined" />
                </form>
                <p>{this.state.ticker}</p>
                <p>{this.state.tickerDailyQuote}</p>
                <iframe title="chart" width="50%" frameborder="0" height="500" src={this.state.chartUrl}></iframe>
            </div>
        )
    }
}

export default Test