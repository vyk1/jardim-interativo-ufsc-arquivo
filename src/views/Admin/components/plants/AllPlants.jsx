import React, { Component } from 'react'
import Main from '../template/Main'
import Logo from '../template/Logo'
import Nav from '../template/Nav'
import Footer from '../template/Footer'
import { getToken } from '../auth'
import api from '../../Server'
import '../template/Tables.css'
import config from "config.js";
import { Button, UncontrolledPopover, PopoverHeader, PopoverBody, UncontrolledTooltip } from 'reactstrap'

const headerProps = {
    icon: 'users',
    title: 'Todos os Membros',
    subtitle: 'Aqui estão listados todos os membros.'
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
                                color="info"
                                className="mr-1"
                            // onClick={() => setModal1(true)}
                            >Visitar</Button>
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