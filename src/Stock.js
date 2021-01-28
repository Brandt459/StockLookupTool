import React, { Component } from 'react'
import Plotly from 'plotly.js'
import createPlotlyComponent from 'react-plotly.js/factory'
const Plot = createPlotlyComponent(Plotly);

export default class Stock extends Component {
    constructor(props) {
        super(props)
        this.state = {
            symbol: [],
            stockCharXValues: [],
            stockCharYValues: [],
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    fetchStock(symbol, interval) {
        const API_KEY = '29BHBFJTX8QHR49J'
        let API_CALL = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&apikey=${API_KEY}`
        let stockCharXValuesFunction = []
        let stockCharyValuesFunction = []

        fetch(API_CALL)
            .then(response => response.json())
            .then(data => {
                for (let key in data[`Time Series (${interval})`]) {
                    stockCharXValuesFunction.push(key)
                    stockCharyValuesFunction.push(data[`Time Series (${interval})`][key]['1. open'])
                }
                this.setState({
                    symbol: symbol,
                    stockCharXValues: stockCharXValuesFunction,
                    stockCharYValues: stockCharyValuesFunction,
                })
            })
    }

    handleSubmit(e) {
        e.preventDefault()
        const symbol = e.target.querySelector('#stock-form-ticker-symbol').value
        const interval = e.target.querySelector('#stock-form-interval').value
        this.fetchStock(symbol, interval)
    }

    render() {
        const symbol = this.state.symbol
        return (
            <div className="stock-component">
                <h1 className="title">Stock Lookup Tool</h1>
                <form className="stock-form" onSubmit={this.handleSubmit}>
                    <input type="text" id="stock-form-ticker-symbol" placeholder="Input ticker symbol..." />
                    <select id="intervals" id="stock-form-interval">
                        <option value="" disabled selected>Select Interval...</option>
                        <option value="1min">1 minute</option>
                        <option value="5min">5 minutes</option>
                        <option value="15min">15 minutes</option>
                        <option value="30min">30 minutes</option>
                        <option value="60min">60 minutes</option>
                    </select>
                    <input type="submit" id="stock-form-submit" placeholder="Submit" />
                </form>
                {
                    symbol &&
                    <Plot className="plot"
                        data={[
                            {
                                x: this.state.stockCharXValues,
                                y: this.state.stockCharYValues,
                                type: 'scatter',
                                name: 'AMZN',
                                showlegend: false,
                                mode: 'lines+markers',
                                marker: { color: 'red' },
                            }
                        ]}
                        layout={{ title: this.state.symbol, xaxis: { title: 'Time' }, yaxis: { title: 'Price ($)' } }}
                    />
                }
            </div>
        )
    }
}
