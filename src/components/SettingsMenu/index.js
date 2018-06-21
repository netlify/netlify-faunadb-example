import React, { Component } from 'react'
import styles from './SettingsMenu.css' // eslint-disable-line

export default class Menu extends Component {
  componentDidMount() {
    // attach event listeners
    document.body.addEventListener('keydown', this.handleEscKey)
  }
  componentWillUnmount() {
    // remove event listeners
    document.body.removeEventListener('keydown', this.handleEscKey)
  }
  handleEscKey = (e) => {
    if (this.props.showMenu && e.which === 27) {
      this.props.handleModalClose()
    }
  }
  handleDelete = (e) => {
    e.preventDefault()
    const deleteConfirm = window.confirm("Are you sure you want to clear all completed todos?");
    if (deleteConfirm) {
      console.log('delete')
      this.props.handleClearCompleted()
    }
  }
  render() {
    const { showMenu } = this.props
    const showOrHide = (showMenu) ? 'flex' : 'none'
    return (
      <div className='settings-wrapper' style={{display: showOrHide}}>
        <div className='settings-content'>
          <span className='settings-close' onClick={this.props.handleModalClose} role="img" aria-label='close'>
            ❌
          </span>
          <h2>Settings</h2>
          <div className='settings-section' onClick={this.handleDelete}>
            <button className='btn-danger'>
              Clear All Completed Todos
            </button>
          </div>
          <div className='settings-section' style={{display: 'none'}}>
            <div className='settings-header'>Sort Todos:</div>
            <div className='settings-options-wrapper' data-setting='sortOrder'>
              <div
                className='settings-option'
                onClick={this.changeSetting}
                data-value='desc'>
                Oldest First ▼
              </div>
              <div
                className='settings-option'
                onClick={this.changeSetting}
                data-value='asc'>
                Most Recent First ▲
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
