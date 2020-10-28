import './Main.css'
import React from 'react'
import Header from '../Header/Header'
import Options from './Options/Options'
import Footer from '../Footer/Footer'

export default props =>
    <React.Fragment>
        <Header {...props} />
        <main className="content container-fluid">
            <div className="p-3 mt-3">
                <Options {...props} />
                {props.children}
            </div>
            <Footer />
        </main>
    </React.Fragment>