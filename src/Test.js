import React from "react";
import axios from "axios";
import TextField from '@material-ui/core/TextField';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const CHART_URL = "https://widget.finnhub.io/widgets/stocks/chart?watermarkColor=%231db954&amp;backgroundColor=%23222222&amp;textColor=white";
const TICKER_URL = "https://finnhub.io/api/v1/search?token=c1lmcqq37fkqle0e1u80";
const DAILYQUOTE_URL = "https://finnhub.io/api/v1/quote?token=c1lmcqq37fkqle0e1u80";
const TICKERDATA_URL = "https://finnhub.io/api/v1/stock/candle?resolution=D&token=c1lmcqq37fkqle0e1u80";

class Test extends React.Component {
    constructor(props){
        super()
        this.state = {
          ticker: [],
          tickerDailyQuote: [],
          closingData: [],
          highData: [],
          lowData: [],
          openData: [],
          dateData: [],
          chartUrl: [],
          tickerDescription: [],
          query: ""
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

// Data Table
    // - Show only 10 rows
    // - Border bottom for rows?
    // - Closing data
        // - green arrow = close > open
        // - red arrow = close < open
// Stonk Info
    // - 52 week high
    // - 52 week low
    // - Closing quote for today
// Layout Exmaples
    // - Google Finance
// Difference today
    // - Add a "+" to positive difference

    handleSubmit (event) {
        event.preventDefault();
        let query = this.state.query;
        axios.get(`${TICKER_URL}&q=${query.replace(/\s/g, "")}`)
        .then(({ data }) => {
            this.setState({ticker: this.state.ticker.concat([data.result[0].displaySymbol])}, () => {
                axios.get(`${DAILYQUOTE_URL}&symbol=${this.state.ticker[this.state.ticker.length - 1]}`)
                .then(({ data }) => {
                    let dailyQuoteArray = Object.values(data);
                    this.setState({tickerDailyQuote: this.state.tickerDailyQuote.concat(dailyQuoteArray[0].toPrecision(4))});
                });
                axios.get(`${TICKERDATA_URL}&symbol=${this.state.ticker[this.state.ticker.length - 1]}&from=${Math.round(Date.now() / 1000) - 864000}&to=${Date.now()}`)
                .then(({data}) => {
                    let tickerData = Object.entries(data);
                    this.setState({closingData: [...this.state.closingData, [...tickerData[0][1]]]});
                    this.setState({highData: [...this.state.highData, [...tickerData[1][1]]]});
                    this.setState({lowData: [...this.state.lowData, [...tickerData[2][1]]]});
                    this.setState({openData: [...this.state.openData, [...tickerData[3][1]]]});
                    this.setState({dateData: [...this.state.dateData, [...tickerData[5][1]]]});
                }) 
            });
            this.setState({tickerDescription: this.state.tickerDescription.concat(data.result[0].description.split("-", 1))});
            this.setState({chartUrl: this.state.chartUrl.concat(CHART_URL + "&symbol=" + data.result[0].displaySymbol)});
        })
    }

    handleInputChange = () => {
        this.setState({query: this.inputRef.value}); 
    }

    render () {
        return (
            <div>
                <form class="search" noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                    <TextField className="searchInput" onChange={this.handleInputChange} inputRef={ref => { this.inputRef = ref; }} id="outlined-basic" label="Search" variant="outlined"/>
                </form>
                {this.state.ticker.map((x, index) => (
                    <div className="main">
                        <p>{this.state.tickerDescription[index]}</p>
                        <p>${this.state.tickerDailyQuote[index]}</p>
                        <p>
                            {this.state.closingData[index] && (this.state.tickerDailyQuote[index] - this.state.closingData[index][this.state.closingData[index].length - 2]).toPrecision(4)} 
                            <span class="today">Today</span>
                        </p>
                        <iframe className="chart" title="Candle chart" width="50%" frameborder="0" height="500" src={this.state.chartUrl[index]}></iframe>
                        <TableContainer className="dataTable" component={Paper}>
                            <Table size="small" aria-label="a dense table">
                                <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>High</TableCell>
                                    <TableCell>Low</TableCell>
                                    <TableCell>Open</TableCell>
                                    <TableCell>Close</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            {this.state.dateData[index] && this.state.dateData[index].map((x, index) => (
                                                <p>{(new Date(x * 1000).toLocaleString("en-US", {month: "numeric", day: "numeric", year: "numeric"}))}</p>
                                            ))}
                                        </TableCell>
                                        <TableCell>
                                            {this.state.highData[index] && this.state.highData[index].map((x, index) => (
                                                <p>{x}</p>
                                            ))}
                                        </TableCell>
                                        <TableCell>
                                            {this.state.lowData[index] && this.state.lowData[index].map((x, index) => (
                                                <p>{x}</p>
                                            ))}
                                        </TableCell>
                                        <TableCell>
                                            {this.state.openData[index] && this.state.openData[index].map((x, index) => (
                                                <p>{x}</p>
                                            ))}
                                        </TableCell>
                                        <TableCell>
                                            {this.state.closingData[index] && this.state.closingData[index].map((x, index) => (
                                                <p>{x}</p>
                                            ))}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                ))}
            </div>
        )
    }
}

export default Test