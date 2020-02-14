import React, { Component } from 'react'
import Main from '../template/Main'
import Logo from '../template/Logo'
import Nav from '../template/Nav'
import Footer from '../template/Footer'
import '../template/Tables.css'
import config from "config.js";
import { Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import firebase from 'firebase'

const headerProps = {
    icon: 'users',
    title: 'Todas as plantas',
    subtitle: 'Aqui estão listados todas as plantas.'
}

const initialState = {
    plants: [],
    // pageSize: 3,
    // field: "popularName"
}

export default class AllPlants extends Component {

    constructor(props) {
        super(props)

        this.state = initialState

        // ref = firebase.database().ref('plantapedia/')
        // query = ref.orderByChild(this.state.field).limitToLast(this.state.pageSize)


        config.syncState('plantapedia/', {
            context: this,
            state: 'plants',
            asArray: true,
            queries: {
                orderByChild: 'popularName',
                limitToFirst: 3
            }
        })
    }

    // nextPage(last) {
    //     return ref.orderByChild(this.state.field)
    //         .startAt(last['field'])
    //         .limitToFirst(this.state.pageSize)
    // }
    // previousPage(first) {
    //     return ref.orderByChild(this.state.field)
    //         .endAt(first['field'])
    //         .limitToLast(this.state.pageSize)
    // }

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
                    <button className="btn btn-info" onClick={this.nextPage.bind(this)}>Próxima página</button>
                </div>
            )
        }
    }
    nextPage() {
        this.setState({ loaded: false })
        let last = this.state.plants[this.state.plants.length - 1]
        console.log('====================================');
        console.log(last);
        console.log('====================================');
        let ref = firebase.database().ref('plantapedia/')
        let query = ref.orderByChild("popularName").limitToLast(3).startAt(last['key'])
        query.on('value', (snap) => {
            let p = snap.val()
            console.log('p')
            console.log(p)
            return this.setState({ plants: p, loaded: true })
        })
    }
    renderRows() {
        return Object.keys(this.state.plants)
            .map(key => {
                // console.log(key);
                // console.log(this.state.plants[key]);
                return (
                    <tr key={key}>
                        {/* <td data-label="id">{this.state.plants[key].id}</td> */}
                        <td data-label="Nome Popular">{this.state.plants[key].popularName}</td>
                        <td data-label="Nome Científico">{this.state.plants[key].scientificName}</td>
                        <td data-label="Mais informações">
                            <Button
                                className="btn btn-info"
                                to={`/leitura/${this.state.plants[key].key}`}
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