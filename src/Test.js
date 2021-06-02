import React from "react";
import axios from "axios";
import TextField from '@material-ui/core/TextField';

const CHART_URL = "https://widget.finnhub.io/widgets/stocks/chart?watermarkColor=%231db954&amp;backgroundColor=%23222222&amp;textColor=white";

class Test extends React.Component {
    constructor(props){
        super()
        this.state = {
          ticker: [],
          tickerDailyQuote: [],
          data: [],
          chartUrl: ""
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    getTicker = () => {
        axios.get(`https://finnhub.io/api/v1/search?q=draftkings&token=c1lmcqq37fkqle0e1u80`)
        .then(({ data }) => {
            this.setState({ticker: data.result[0].displaySymbol});
            this.setState({chartUrl: CHART_URL + "&symbol=" + data.result[0].displaySymbol});
        })
    }

    getTickerDailyQuote = () => {
        axios.get(`https://finnhub.io/api/v1/quote?symbol=DKNG&token=c1lmcqq37fkqle0e1u80`)
        .then(({ data }) => {
            let dailyQuoteArray = Object.values(data)
            console.log(dailyQuoteArray[0]);
            this.setState({tickerDailyQuote: dailyQuoteArray[0]});
        })
    }

    getTickerCandles = () => {
        axios.get(`https://finnhub.io/api/v1/stock/candle?symbol=AAPL&resolution=D&from=1615298999&to=1622682167&token=c1lmcqq37fkqle0e1u80`)
        .then(({ data }) => {
            let test = Object.values(data)
            this.setState({data: test[0]});
        })
    }

    handleSubmit (event) {
        alert(this.inputRef.value);
    }

    componentDidMount() {
          this.getTicker();
          this.getTickerDailyQuote();
          this.getTickerCandles();
    }

    render (){
        return (
            <div>
                <form class="search" noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                    <TextField inputRef={ref => { this.inputRef = ref; }} id="outlined-basic" label="Search" variant="outlined" />
                </form>
                <p>{this.state.ticker}</p>
                <p>{this.state.tickerDailyQuote}</p>
                <iframe title="chart" width="50%" frameborder="0" height="500" src={this.state.chartUrl}></iframe>
            </div>
        )
    }
}

export default Test