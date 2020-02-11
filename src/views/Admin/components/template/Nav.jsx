import './Nav.css'
import React from 'react'
import { Link } from 'react-router-dom'
export default props =>
    <aside className="menu-area">
        <nav className="menu">

            <Link to="/admin/plantas">
                <i className="fa fa-leaf"></i><br /> Todos as Plantas
            </Link>
            <Link to="/admin/nova-planta">
                <i className="fa fa-plus-circle"></i><br /> Nova Planta
            </Link>
            <Link to="/admin/editar-planta">
                <i className="fa fa-edit"></i><br /> Editar Planta
            </Link>
            <Link to="/admin/logout">
                <i className="fas fa-sign-out-alt"></i><br /> Logout
            </Link>
        </nav>
    </aside>
