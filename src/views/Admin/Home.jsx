import React from 'react'
import Main from './components/template/Main/Main'
import Logo from './components/template/Logo/Logo'
import Nav from './components/template/Nav/Nav'

export default props =>
    <div className="app">
        <Logo />
        <Nav />
        <Main icon="home" title="Início"
            subtitle="Página Administrativa para o Sistema Jardim Interativo.">
            <div className='display-4'>Bem Vindo!</div>
            <hr />
            <p className="mb-0">Selecione a operação desejada no menu.</p>
        </Main>
    </div>