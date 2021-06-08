import React from "react";
import axios from "axios";
import TextField from '@material-ui/core/TextField';

const CHART_URL = "https://widget.finnhub.io/widgets/stocks/chart?watermarkColor=%231db954&amp;backgroundColor=%23222222&amp;textColor=white";
const TICKER_URL = "https://finnhub.io/api/v1/search?token=c1lmcqq37fkqle0e1u80";
const DAILYQUOTE_URL = "https://finnhub.io/api/v1/quote?token=c1lmcqq37fkqle0e1u80";
const TICKERDATA_URL = "https://finnhub.io/api/v1/stock/candle?resolution=1&from=1615298999&to=1615302599&token=c1lmcqq37fkqle0e1u80"

class Test extends React.Component {
    constructor(props){
        super()
        this.state = {
          ticker: [],
          tickerDailyQuote: [],
          closingData: [],
          chartUrl: [],
          query: ""
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit (event) {
        event.preventDefault();
        let query = this.state.query;
        axios.get(`${TICKER_URL}&q=${query.replace(/\s/g, "")}`)
        .then(({ data }) => {
            this.setState({ticker: this.state.ticker.concat([data.result[0].displaySymbol])}, () => {
                console.log(this.state.ticker);
                axios.get(`${DAILYQUOTE_URL}&symbol=${this.state.ticker[this.state.ticker.length - 1]}`)
                .then(({ data }) => {
                    let dailyQuoteArray = Object.values(data);
                    this.setState({tickerDailyQuote: this.state.tickerDailyQuote.concat(dailyQuoteArray[0])});
                });
                axios.get(`${TICKERDATA_URL}&symbol=${this.state.ticker[this.state.ticker.length - 1]}`)
                .then(({data}) => {
                    let test = Object.entries(data);
                    this.setState({closingData: this.state.closingData.concat(test[0])});
                }) 
            });
            this.setState({chartUrl: this.state.chartUrl.concat(CHART_URL + "&symbol=" + data.result[0].displaySymbol)});
        })
    }

    handleInputChange = () => {
        this.setState({query: this.inputRef.value}, () => {
        }); 
    }

    render () {
        return (
            <div>
                <form class="search" noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                    <TextField onChange={this.handleInputChange} inputRef={ref => { this.inputRef = ref; }} id="outlined-basic" label="Search" variant="outlined" />
                </form>
                {this.state.ticker.map((x, index) => (
                    <p key={index}> {x}</p>
                ))}
                {this.state.tickerDailyQuote.map((x, index) => (
                    <p key={index}> {x}</p>
                ))}
                {this.state.closingData.map((x, index) => (
                    <p key={index}> {index % 2 === 1 && x}</p>
                ))}
                {this.state.chartUrl.map((x, index) => (
                    <iframe title="chart" width="50%" frameborder="0" height="500" src={x}></iframe>
                ))}
            </div>
        )
    }
}

export default Test