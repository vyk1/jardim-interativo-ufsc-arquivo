import './Logo.css'
import React from 'react'
import { Link } from 'react-router-dom'

export default props =>
    <aside className="logo">
        <Link to="/" className="logo" id="logo">
            <p className="text-success">
                Jardim Universitário
              </p>
        </Link>
    </aside>