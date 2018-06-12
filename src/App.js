import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'

class App extends Component {
  componentDidMount() {
    console.log('fetch items')
    fetch('https://adoring-clarke-f30908.netlify.com/.netlify/functions/todos-read-all')
      .then((response) => {
        return response.json()
      })
      .then((myJson) => {
        console.log(myJson)
      })
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Netlify + Fauna DB</h1>
        </header>
        <p className="App-intro">
          Using FaunaDB & netlify functions
        </p>
      </div>
    )
  }
}

export default App
