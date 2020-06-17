import './Nav.css'
import React from 'react'
import { Link } from 'react-router-dom'
export default props =>

    <aside className="menu-area">
        <nav className="menu">

            <Link to="/admin/plantas">
                <i className="fa fa-leaf"></i><br />Plantas
            </Link>
            <Link to="/admin/categorias">
                <i className="fa fa-tags"></i><br />Categorias
            </Link>
            <Link to="/admin/tipos">
                <i className="fa fa-receipt"></i><br />Tipos
            </Link>
            <Link to="/admin/logout">
                <i className="fas fa-sign-out-alt"></i><br />Logout
            </Link>
        </nav>
    </aside>
