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
  logState = () => {
    console.log(this.state)
  }
  saveTodo = (e) => {
    e.preventDefault();
    const { todos } = this.state
    const todoValue = this.inputElement.value

    if (!todoValue) {
      alert('Please add todo text')
      return false
    }

    // Optimistically add todo to UI
    const temporaryValue = {
      data: {
        title: todoValue
      }
    }
    const optimisticTodoState = todos.concat(temporaryValue)
    this.setState({
      todos: optimisticTodoState
    })

    // Make API request to create new todo
    fetch('/.netlify/functions/todos-create', {
      body: JSON.stringify({
        title: todoValue
      }),
      method: 'POST',
      // mode: 'cors', // no-cors, cors, *same-origin
    })
    .then(response => response.json())
    .then((json) => {
      console.log(json)
      // remove temporaryValue from state and persist API response
      const persistedState = removeOptimisticTodo(todos).concat(json)
      // Set persisted value to state
      this.setState({
        todos: persistedState
      })
      // fin
    }).catch((e) => {
      console.log('An API error occurred', e)
      const revertedState = removeOptimisticTodo(todos)
      // Reset to original state
      this.setState({
        todos: revertedState
      })
    })
  }
  deleteTodo = (e) => {
    const { todos } = this.state
    const todoId = e.target.dataset.id
    console.log(`Delete todo ${todoId}`)
    // Optimistically remove todo from UI
    const filteredTodos = todos.reduce((acc, current) => {
      const currentId = getTodoId(current)
      if (currentId === todoId) {
        // save item being removed for rollback
        acc.rollbackTodo = current
        return acc
      }
      // filter deleted todo out of the todos list
      acc.optimisticState = acc.optimisticState.concat(current)
      return acc
    }, {
      rollbackTodo: {},
      optimisticState: []
    })

    this.setState({
      todos: filteredTodos.optimisticState
    })
    // Make API request to delete todo
    fetch(`/.netlify/functions/todos-delete/${todoId}`, {
      method: 'POST',
    })
    .then(response => response.json())
    .then((json) => {
      console.log(json)
    }).catch((e) => {
      console.log(`There was an error removing ${todoId}`, e)
      // Add item removed back to list
      this.setState({
        todos: filteredTodos.optimisticState.concat(filteredTodos.rollbackTodo)
      })
    })
  }
  renderTodos() {
    const { todos } = this.state
    return todos.map((todo, i) => {
      const { data, ref } = todo
      const id = getTodoId(todo)
      console.log('id', id)
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
          <button onClick={this.logState}>log state</button>
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

function removeOptimisticTodo(todos) {
  // return all 'real' todos
  return todos.filter((todo) => {
    return todo.ref
  })
}

function getTodoId(todo) {
  if (!todo.ref) {
    return null
  }
  return todo.ref['@ref'].split('/').pop()
}

export default App
