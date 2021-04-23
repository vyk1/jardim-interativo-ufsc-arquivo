import React from 'react'
import Main from './components/template/Main/Main'
import Logo from './components/template/Logo/Logo'
import Nav from './components/template/Nav/Nav'
import AdminHelmet from 'components/Helmet/AdminHelmet'

const headerProps = {
    icon: 'home',
    title: 'Início',
    subtitle: 'Página Administrativa para o Sistema Jardim Interativo',
}

export default props =>
    <div className="app">
        <AdminHelmet title={headerProps.title} />
        <Logo />
        <Nav />
        <Main {...headerProps}>
            <div className='display-4'>Bem Vindo!</div>
            <hr />
            <p className="mb-0">Selecione a operação desejada no menu.</p>
        </Main>
    </div>