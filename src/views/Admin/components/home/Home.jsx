import React from 'react'
import Main from '../template/Main/Main'
import Footer from '../template/Footer/Footer'
import Logo from '../template/Logo/Logo'
import Nav from '../template/Nav/Nav'

export default props =>
    <div className="app">
        <Logo />
        <Nav />
        <Main icon="home" title="Início"
            subtitle="Página Administrativa para o Sistema Jardim Unificado.">
            <div className='display-4'>Bem Vindo!</div>
            <hr />
            <p className="mb-0">Selecione a operação desejada no menu.</p>
        </Main>
        <Footer />
    </div>