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
    message: 'Carregando'
}

export default class AllPlants extends Component {


    constructor(props) {
        super(props)

        this.state = initialState

        config.syncState('plantapedia', {
            context: this,
            state: 'plants',
            asArray: false
        })
    }


    renderTable() {
        if (this.state.plants.length <= 0) {
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
                </div>
            )
        }
    }
    renderRows() {

        return Object.keys(this.state.plants)
            .map(key => {
                // console.log(key);
                return (
                    <tr key={key}>
                        {/* <td data-label="id">{this.state.plants[key].id}</td> */}
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
                                className="mr-1"
                            // onClick={() => setModal1(true)}
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