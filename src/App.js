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
          todos: myJson
        })
      })
  }
  saveTodo = (e) => {
    e.preventDefault();

    if (!this.inputElement.value) {
      alert('Please add todo text')
      return false
    }
    fetch('/.netlify/functions/todos-create', {
      body: JSON.stringify({
        title: this.inputElement.value
      }),
      method: 'POST',
      // mode: 'cors', // no-cors, cors, *same-origin
    })
    .then(response => response.json())
    .then((json) => {
      console.log(json)
    }).catch((e) => {
      console.log('errrrr', e)
    })
  }
  deleteTodo = (e) => {
    const todoId = e.target.dataset.id
    console.log(`Delete todo ${todoId}`)
    fetch(`/.netlify/functions/todos-delete/${todoId}`, {
      method: 'POST',
    })
    .then(response => response.json())
    .then((json) => {
      console.log(json)
    }).catch((e) => {
      console.log('errrrr', e)
    })
  }
  renderTodos() {
    const { todos } = this.state
    return todos.map((todo, i) => {
      const { data } = todo
      const id = todo.ref['@ref'].split('/').pop()
      return (
        <div key={i} style={{borderBottom: '1px solid black', padding: 20}}>
          {data.title} <button data-id={id} onClick={this.deleteTodo}>delete</button>
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
        <div>
          <h2>Create todo</h2>
          <form className='feature-add' onSubmit={this.saveTodo}>
            <input placeholder='Todo Info' name='name' ref={el => this.inputElement = el} />
            <button>
              Create todo
            </button>
          </form>
        </div>

        {this.renderTodos()}
      </div>
    )
  }
}

export default App
