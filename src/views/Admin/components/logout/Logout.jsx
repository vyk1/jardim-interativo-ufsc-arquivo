import React, { Component } from "react";
import Main from '../template/Main/Main'
import Logo from '../template/Logo/Logo'
import Nav from '../template/Nav/Nav'
import Footer from '../template/Footer/Footer'
import LoadingCog from "views/LoadingCog";
import { Redirect } from "react-router";
import { auth } from "../../../../config";

const headerProps = {
    icon: 'sign-out',
    title: 'Logout',
    subtitle: 'Por favor, aguarde...'
}

export default class Logout extends Component {
    async componentDidMount() {
        try {
            auth.signOut()
        } catch (error) {
            console.log(error);
        } finally {
            return < Redirect to="/index" />
        }

    }
    render() {
        return (
            <div className="app">
                <Logo />
                <Nav />
                <Main {...headerProps}>
                    <span>
                        <b> Saindo...</b>
                    </span>
                    <LoadingCog />
                </Main>
                <Footer />
            </div>

        );
    }
}