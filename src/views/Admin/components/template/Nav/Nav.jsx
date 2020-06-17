import './Nav.css'
import React from 'react'
import { Link } from 'react-router-dom'
import OptionsArray from '../Main/Options/OptionsArray'

export default props => {

    return (

        <aside className="menu-area">
            <nav className="menu">
                {
                    OptionsArray.map((el, i) => (
                        <Link to={el.main} key={i}>
                            <i className={el.icon}></i><br />{el.name}
                        </Link>
                    ))
                }
                <Link to="/admin/logout">
                    <i className="fas fa-sign-out-alt"></i><br />Logout
                </Link>
            </nav>
        </aside>
    )
}
