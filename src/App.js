import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'

class App extends Component {
  state = {
    todos: []
  }
  componentDidMount() {
    console.log('fetch items')
    fetch('/.netlify/functions/todos-read-all')
      .then((response) => {
        console.log(response)
        return response.json()
      })
      .then((myJson) => {
        console.log(myJson)
        this.setState({
          todos: myJson.data
        })
      })
  }
  renderTodos() {
    const { todos } = this.state
    return todos.map((todo, i) => {
      return (
        <div key={i}>
          {todo['@ref']}
        </div>
      )
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
        {this.renderTodos()}
      </div>
    )
  }
}

export default App
