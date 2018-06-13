import React, { Component } from 'react'
import api from './utils/api'
import ContentEditable from './components/ContentEditable'
import deployButton from './deploy-to-netlify.svg'
import logo from './logo.svg'
import github from './github.svg'
import './App.css'

class App extends Component {
  state = {
    todos: []
  }
  componentDidMount() {
    // Fetch all todos
    api.readAll().then((response) => {
      console.log('all todos', response)
      this.setState({
        todos: response
      })
    })
  }
  saveTodo = (e) => {
    e.preventDefault()
    const { todos } = this.state
    const todoValue = this.inputElement.value

    if (!todoValue) {
      alert('Please add todo text')
      return false
    }

    // reset input to empty
    this.inputElement.value = ''

    const todoInfo = {
      title: todoValue,
      completed: false
    }
    // Optimistically add todo to UI
    const optimisticTodoState = todos.concat({
      data: todoInfo
    })
    this.setState({
      todos: optimisticTodoState
    })
    // Make API request to create new todo
    api.create(todoInfo).then((response) => {
      console.log(response)
      // remove temporaryValue from state and persist API response
      const persistedState = removeOptimisticTodo(todos).concat(response)
      // Set persisted value to state
      this.setState({
        todos: persistedState
      })
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
    api.delete(todoId).then(() => {
      console.log(`deleted todo id ${todoId}`)
    }).catch((e) => {
      console.log(`There was an error removing ${todoId}`, e)
      // Add item removed back to list
      this.setState({
        todos: filteredTodos.optimisticState.concat(filteredTodos.rollbackTodo)
      })
    })
  }
  handleTodoCheckbox = (event) => {
    const { target } = event
    const todoCompleted = target.checked
    const todoId = target.dataset.id

    const updatedTodos = this.state.todos.map((todo, i) => {
      const { data } = todo
      const id = getTodoId(todo)
      if (id === todoId && data.completed !== todoCompleted) {
        data.completed = todoCompleted
      }
      return todo
    })

    // only set state if input different
    this.setState({
      todos: updatedTodos
    }, () => {
      api.update(todoId, {
        completed: todoCompleted
      }).then(() => {
        console.log(`update todo ${todoId}`, todoCompleted)
      }).catch((e) => {
        console.log('An API error occurred', e)
      })
    })
  }
  handleDataChange = (event, currentValue) => {
    // save on change debounced?
  }
  handleBlur = (event, currentValue) => {
    console.log('blur')
    let isDifferent = false
    const todoId = event.target.dataset.key

    const updatedTodos = this.state.todos.map((todo, i) => {
      const id = getTodoId(todo)
      if (id === todoId && todo.data.title !== currentValue) {
        todo.data.title = currentValue
        isDifferent = true
      }
      return todo
    })

    // only set state if input different
    if (isDifferent) {
      this.setState({
        todos: updatedTodos
      }, () => {
        api.update(todoId, {
          title: currentValue
        }).then(() => {
          console.log(`update todo ${todoId}`, currentValue)
        }).catch((e) => {
          console.log('An API error occurred', e)
        })
      })
    }
  }
  renderTodos() {
    const { todos } = this.state
    return todos.map((todo, i) => {
      const { data, ref } = todo
      const id = getTodoId(todo)
      // only show delete button after create API response returns
      let deleteButton
      if (ref) {
        deleteButton = (
          <button data-id={id} onClick={this.deleteTodo}>
            delete
          </button>
        )
      }
      const completedClass = (data.completed) ? 'todo-completed' : ''
      return (
        <div key={i} className={`todo-item ${completedClass}`}>
          <label className="todo">
            <input
              data-id={id}
              className="todo__state"
              type="checkbox"
              onChange={this.handleTodoCheckbox}
              checked={data.completed}
            />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 25" className="todo__icon">
              <use xlinkHref="#todo__box" className="todo__box"></use>
              <use xlinkHref="#todo__check" className="todo__check"></use>
              <use xlinkHref="#todo__circle" className="todo__circle"></use>
            </svg>
            <div className='todo-list-title'>

                <ContentEditable
                  tagName='span'
                  editKey={id}
                  onChange={this.handleDataChange} // handle innerHTML change
                  onBlur={this.handleBlur} // handle innerHTML change
                  html={data.title}
                >
                </ContentEditable>

            </div>
          </label>

          {deleteButton}
        </div>
      )
    })
  }
  render() {
    return (
      <div className='app'>
        <header className='app-header'>
          <div className='app-title-wrapper'>
            <div className='app-title-wrapper'>
              <div className='app-left-nav'>
                <img src={logo} className='app-logo' alt='logo' />
                <div className='app-title-text'>
                  <h1 className='app-title'>Netlify + Fauna DB</h1>
                  <p className='app-intro'>
                    Using FaunaDB & Netlify functions
                  </p>
                </div>
              </div>
            </div>
            <div className='deploy-button-wrapper'>
              <a
                target='_blank'
                rel='noopener noreferrer'
                href='https://app.netlify.com/start/deploy?repository=https://github.com/netlify/netlify-faunadb-example'>
                <img src={deployButton} className='deploy-button' alt='deploy to netlify' />
              </a>
              <div className='view-src'>
                <a
                  target='_blank'
                  rel='noopener noreferrer'
                  href='https://github.com/netlify/netlify-faunadb-example'>
                  <img className='github-icon' src={github} alt='view repo on github' /> View the source Luke
                </a>
              </div>
            </div>
          </div>
        </header>

        <div className='todo-list'>
          <h2>Create todo</h2>
          <form className='todo-create-wrapper' onSubmit={this.saveTodo}>
            <input
              className='todo-create-input'
              placeholder='Add a todo item'
              name='name'
              ref={el => this.inputElement = el}
              autoComplete='off'
              style={{marginRight: 20}}
            />
            <button className='todo-create-button'>
              Create todo
            </button>
          </form>
          {this.renderTodos()}
        </div>
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
