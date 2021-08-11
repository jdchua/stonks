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
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

import Grow from '@material-ui/core/Grow';


import RingLoader from "react-spinners/RingLoader";

const CHART_URL = "https://widget.finnhub.io/widgets/stocks/chart?watermarkColor=%231db954&amp;backgroundColor=%23222222&amp;textColor=white";
const TICKER_URL = "https://finnhub.io/api/v1/search?token=c1lmcqq37fkqle0e1u80";
const DAILYQUOTE_URL = "https://finnhub.io/api/v1/quote?token=c1lmcqq37fkqle0e1u80";
const TICKERDATA_URL = "https://finnhub.io/api/v1/stock/candle?resolution=D&token=c1lmcqq37fkqle0e1u80";
const NEWS_URL = "https://finnhub.io/api/v1/company-news?token=c1lmcqq37fkqle0e1u80";
const COMPANY_PROFILE_URL = "https://finnhub.io/api/v1/stock/profile2?token=c1lmcqq37fkqle0e1u80";
const FINANCIALS_URL = "https://finnhub.io/api/v1/stock/metric?metric=all&token=c1lmcqq37fkqle0e1u80"

const today = new Date()
const yesterday = new Date(today)
yesterday.setDate(yesterday.getDate() - 28);

class Test extends React.Component {
    constructor(props) {
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
          news:[],
          exchange:[],
          yearLow:[],
          yearHigh:[],
          dailyVolume: [],
          loading: false,
          query: ""
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

// Back End
    // Test back end to see if it works
    // https://www.bezkoder.com/node-js-mongodb-auth-jwt/#Configure_MongoDB_database
// Extras
    // Loading Spinner
    // Cascade load components
// Data Table
    // - sort data the opposite 
// Stonk Info
// Navbar
// Layout Exmaples
    // - Google Finance

    handleSubmit (event) {
        this.setState({loading: true});

        event.preventDefault();

        let query = this.state.query;
        axios.get(`${TICKER_URL}&q=${query.replace(/\s/g, "")}`)
        .then(({ data }) => {
            this.setState({ticker: []});
            this.setState({ticker: this.state.ticker.concat([data.result[0].displaySymbol])}, () => {
                axios.get(`${DAILYQUOTE_URL}&symbol=${this.state.ticker[this.state.ticker.length - 1]}`)
                .then(({ data }) => {
                    let dailyQuoteArray = Object.values(data);
                    this.setState({tickerDailyQuote: []});
                    this.setState({tickerDailyQuote: this.state.tickerDailyQuote.concat(dailyQuoteArray[0].toPrecision(4))});
                });
                axios.get(`${TICKERDATA_URL}&symbol=${this.state.ticker[this.state.ticker.length - 1]}&from=${Math.round(Date.now() / 1000) - 864000}&to=${Date.now()}`)
                .then(({data}) => {
                    let tickerData = Object.entries(data);
                    this.setState({closingData: []});
                    this.setState({highData: []});
                    this.setState({lowData: []});
                    this.setState({openData: []});
                    this.setState({dateData: []});
                    this.setState({dailyVolume: []});
                    this.setState({closingData: [...this.state.closingData, [...tickerData[0][1]]]});
                    this.setState({highData: [...this.state.highData, [...tickerData[1][1]]]});
                    this.setState({lowData: [...this.state.lowData, [...tickerData[2][1]]]});
                    this.setState({openData: [...this.state.openData, [...tickerData[3][1]]]});
                    this.setState({dateData: [...this.state.dateData, [...tickerData[5][1]]]});

                    var SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];
                    var tier = Math.log10(Math.abs(tickerData[6][1][tickerData[6][1].length - 1])) / 3 | 0;
                    var suffix = SI_SYMBOL[tier];
                    var scale = Math.pow(10, tier * 3);
                    var scaled = [tickerData[6][1][tickerData[6][1].length - 1]]  / scale;
                    this.setState({dailyVolume: tier === 0 ? [tickerData[6][1][tickerData[6][1].length - 1]] :  scaled.toFixed(2) + suffix})
                });
                axios.get(`${NEWS_URL}&symbol=${this.state.ticker[this.state.ticker.length - 1]}&from=${yesterday.toISOString().split('T')[0]}&to=${today.toISOString().split('T')[0]}`)
                .then(({ data }) => {
                    this.setState({news: data});
                });
                axios.get(`${COMPANY_PROFILE_URL}&symbol=${this.state.ticker[this.state.ticker.length - 1]}`)
                .then(({ data }) => {
                    this.setState({tickerDescription: []});
                    this.setState({exchange: []});
                    this.setState({tickerDescription: this.state.tickerDescription.concat(data.name)});
                    this.setState({exchange: this.state.exchange.concat(data.exchange)})
                });
                axios.get(`${FINANCIALS_URL}&symbol=${this.state.ticker[this.state.ticker.length - 1]}`)
                .then(({ data }) => {
                    this.setState({yearLow: []});
                    this.setState({yearHigh: []});
                    this.setState({yearLow: this.state.yearLow.concat(data.metric["52WeekLow"])});
                    this.setState({yearHigh: this.state.yearHigh.concat(data.metric["52WeekHigh"])});
                });
            });
            this.setState({chartUrl: []});
            this.setState({chartUrl: this.state.chartUrl.concat(CHART_URL + "&symbol=" + data.result[0].displaySymbol)});


            this.setState({loading: false});
            this.state.loading ? document.getElementsByClassName("main")[0].style.display = "none" : document.getElementsByClassName("main")[0].style.display = "block";
            setTimeout(() => {
                this.setState({loading: false});
            }, 2000);
        })
    }

    handleInputChange = () => {
        this.setState({query: this.inputRef.value}); 
    }

    render () {
        return (
            <div>
                <div>
                    <RingLoader size={50} loading={this.state.loading} />
                    <form class="search" noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                        <TextField className="searchInput" onChange={this.handleInputChange} inputRef={ref => { this.inputRef = ref; }} id="outlined-basic" label="Search" variant="outlined"/>
                    </form>
                    {this.state.ticker.map((x, index) => (
                        <div className="main container">
                            <div className="row">
                                <div className="col-md-1"></div>
                                <Grow in={true}>
                                    <div className="col-md-4">
                                        <button className="addToPortfolio">Add To Portfolio [+]</button>
                                        <p>{this.state.tickerDescription[index]}</p>
                                        <p>${this.state.closingData[index] && this.state.closingData[index][this.state.closingData[index].length - 1].toPrecision(4)}</p>
                                        {this.state.closingData[index] && (this.state.closingData[index][this.state.closingData[index].length - 1].toPrecision(4) - this.state.closingData[index][this.state.closingData[index].length - 2]).toPrecision(4) > 0 && <p className="positive">+{(this.state.closingData[index][this.state.closingData[index].length - 1].toPrecision(4) - this.state.closingData[index][this.state.closingData[index].length - 2]).toPrecision(4)} Today</p>} 
                                        {this.state.closingData[index] && (this.state.closingData[index][this.state.closingData[index].length - 1].toPrecision(4) - this.state.closingData[index][this.state.closingData[index].length - 2]).toPrecision(4) < 0 && <p className="negative">{(this.state.closingData[index][this.state.closingData[index].length - 1].toPrecision(4) - this.state.closingData[index][this.state.closingData[index].length - 2]).toPrecision(4)} Today</p>} 
                                        <p>Key Data</p>
                                        <p>Exchange: {this.state.exchange}</p>
                                        <p>Day Range: ${this.state.lowData[index] && this.state.lowData[index][this.state.lowData[index].length - 1]} - ${this.state.highData[index] && this.state.highData[index][this.state.highData[index].length - 1]}</p>
                                        <p>Year Range: ${this.state.yearLow} - ${this.state.yearHigh} </p>
                                        <p>Volume: {this.state.dailyVolume}</p>
                                    </div>
                                </Grow>
                                <Grow in={true} style={{ transformOrigin: '0 0 0' }} {...(this.state.loading ? { timeout: 500 } : {})}>
                                    <div className="col-md-6">
                                        <iframe className="chart" title="Candle chart" width="100%" frameborder="0" height="500" src={this.state.chartUrl[index]}></iframe>
                                    </div>
                                </Grow>
                                <div className="col-md-1"></div>
                            </div>
                            <div className="row">
                                <div className="col-md-1"></div>
                                <Grow in={true} style={{ transformOrigin: '0 0 0' }} {...(this.state.loading ? { timeout: 1500 } : {})}>
                                    <div className="col-md-4">
                                            <p> Recent News</p>
                                            {this.state.news.slice(0, 4).map((x, index) => (
                                                <div className="col-md-12">
                                                    <a rel="noreferrer" target="_blank" href={x.url}>
                                                        <p>{x.headline}</p>
                                                    </a>
                                                </div>
                                            ))}
                                    </div>
                                </Grow>
                                <Grow in={true} style={{ transformOrigin: '0 0 0' }} {...(this.state.loading ? { timeout: 1000 } : {})}>
                                    <div className="col-md-6">
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
                                                        {this.state.closingData[index] && this.state.closingData[index].map((x, index, arr) => {
                                                            const prevItem = arr[index - 1];
                                                            return (
                                                                <p className="tableClosingData">
                                                                    {x > prevItem ? <span className="positive"><ArrowDropUpIcon/> {x}</span> : <span className="negative"><ArrowDropDownIcon/> {x.toPrecision(4)}</span>}
                                                                </p>
                                                            )
                                                        })}
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    </div>
                                </Grow>
                                <div className="col-md-1"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

export default Test