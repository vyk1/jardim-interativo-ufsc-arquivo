import './Logo.css'
import React from 'react'
import { Link } from 'react-router-dom'

import image from '../../../../../assets/img/plantIcon.svg'

const LogoImg = () => (
    <img src={image} alt="Jardim Interativo" style={{ width: '80px' }} />
)

export default props =>
    <aside className="logo">
        <Link to="/" className="logo" id="logo">
            <p className="text-success">
                <LogoImg />
            </p>
        </Link>
    </aside>