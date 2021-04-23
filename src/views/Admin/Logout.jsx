import React, { Component } from "react";
import Main from './components/template/Main/Main'
import Logo from './components/template/Logo/Logo'
import Nav from './components/template/Nav/Nav'
import LoadingCog from "../../components/LoadingCog";
import { auth } from "../../config";
import { Alert } from "reactstrap";

const headerProps = {
    icon: 'sign-out',
    title: 'Logout',
    subtitle: 'Por favor, aguarde...'
}

const initialState = {
    error: false,
}

export default class Logout extends Component {
    constructor() {
        super()
        this.state = initialState
    }
    async componentDidMount() {
        try {
            auth.signOut()
            this.setState({ error: false })
        } catch (error) {
            this.setState({ error: "Ocorreu um erro..." })
        } finally {
            return window.location.href = "/"
        }

    }
    render() {
        return (
            <div className="app">
                <Logo />
                <Nav />
                <Main {...headerProps}>
                    {
                        this.state.error ?
                            <Alert color="warning">{this.state.error}</Alert>
                            :
                            <span>
                                <b> Saindo...</b>
                            </span>
                    }
                    <LoadingCog />
                </Main>
            </div>

        );
    }
}