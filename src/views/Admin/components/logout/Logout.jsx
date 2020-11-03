import React, { Component } from "react";
import Main from '../template/Main/Main'
import Logo from '../template/Logo/Logo'
import Nav from '../template/Nav/Nav'
import LoadingCog from "views/LoadingCog";
import { auth } from "../../../../config";
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
            console.log(error)
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