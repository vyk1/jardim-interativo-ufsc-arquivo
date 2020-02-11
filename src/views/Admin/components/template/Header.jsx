import './Header.css'
import React from 'react'

export default props =>
    <header className="header d-none d-sm-flex flex-column">
        <h1 className="mt-2">
            <i className={`fa fa-${props.icon}`}></i> {props.title}
        </h1>
        <span className="lead text-muted">{props.subtitle}</span>
    </header>