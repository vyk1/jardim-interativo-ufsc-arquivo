import React, { Component } from 'react'
import Main from '../template/Main'
import Logo from '../template/Logo'
import Nav from '../template/Nav'
import Footer from '../template/Footer'
import '../template/Tables.css'
import config from "config.js";
import { Button } from 'reactstrap'
import { Link } from 'react-router-dom'

const headerProps = {
    icon: 'users',
    title: 'Todas as plantas',
    subtitle: 'Aqui estão listados todas as plantas.'
}

const initialState = {
    plants: [],
    limit: 3,
    loaded: true,
    disabled2: false
}

export default class AllPlants extends Component {

    constructor(props) {
        super(props)

        this.state = initialState
    }

    componentDidMount() {
        config.syncState('plantapedia', {
            context: this,
            state: 'plants',
            asArray: false
        })
    }

    onNextPage = async () => {
        await this.setState({ limit: this.state.limit * 2 })
        if (this.state.limit >= Object.keys(this.state.plants).length) {
            return this.setState({ disabled2: true })
        }
    }

    renderTable() {
        if (this.state.plants.length <= 0 || this.state.loaded === false) {
            return (
                <h1>
                    <i className="now-ui-icons loader_gear spin"></i>
                </h1>
            )
        } else {
            return (
                <div>
                    <p><strong>{this.state.message}</strong></p>
                    <table>
                        <thead>
                            <tr>
                                <th scope="col">Nome Popular</th>
                                <th scope="col">Nome Científico</th>
                                <th scope="col">Mais informações</th>
                                <th scope="col">Gerar QR Code</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderRows()}
                        </tbody>
                    </table>
                    {this.state.plants && !this.state.disabled2 && (
                        <button className="btn btn-info" type="button" onClick={this.onNextPage}>
                            Mais
                        </button>
                    )}
                </div>
            )
        }
    }

    onNextPage = async () => {
        await this.setState({ limit: this.state.limit * 2 })
        if (this.state.limit >= Object.keys(this.state.plants).length) {
            return this.setState({ disabled2: true })
        }
    }

    renderRows() {
        let count = 0

        return Object.keys(this.state.plants)
            .map(key => {
                count++
                if (count > this.state.limit) {
                    return false
                }
                return (
                    <tr key={key}>
                        <td data-label="Nome Popular">{this.state.plants[key].popularName}</td>
                        <td data-label="Nome Científico">{this.state.plants[key].scientificName}</td>
                        <td data-label="Mais informações">
                            <Button
                                className="btn btn-info"
                                to={`/leitura/${key}`}
                                tag={Link}
                                target="_blank"
                            >
                                Info
                </Button>
                        </td>
                        <td data-label="QR Code">
                            <Button
                                color="success"
                                to={`/admin/qrcode/${key}`}
                                className="mr-1"
                                tag={Link}
                                target="_blank"
                            >QR Code</Button>
                        </td>
                    </tr >
                )
            })
    }

    render() {
        return (
            <div className="app">
                <Logo />
                <Nav />
                <Main {...headerProps}>
                    {this.renderTable()}
                </Main>
                <Footer />
            </div>
        )
    }
}