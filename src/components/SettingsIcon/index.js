import React from 'react'
import styles from './SettingIcon.css' // eslint-disable-line

const SettingIcon = (props) => {
  const className = props.className || ''
  return (
    <span onClick={props.onClick} className={`setting-toggle-wrapper ${className}`}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 125" className="settings-toggle">
        <use xlinkHref="#settings" className="settings-gear"></use>
      </svg>
    </span>
  )
}

export default SettingIcon
