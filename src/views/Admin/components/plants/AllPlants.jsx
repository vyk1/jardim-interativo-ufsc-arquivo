import React, { Component } from 'react'

import Main from '../template/Main/Main'
import Logo from '../template/Logo/Logo'
import Nav from '../template/Nav/Nav'
import Footer from '../template/Footer/Footer'
import '../template/Tables/Tables.css'

import config from "config.js";
import TableS from '../table/Index'
import { Button } from 'reactstrap'
import { Link } from 'react-router-dom'

const headerProps = {
    icon: 'leaf',
    title: 'Todas as plantas',
    subtitle: 'Aqui estão listados todas as plantas.',
    type: 'planta',
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
            asArray: true
        })
    }
    displayActionItems = props => {
        return (
            <>
                <Button
                    className="btn btn-info"
                    to={`/leitura/${props.cell.value}`}
                    tag={Link}
                    target="_blank"
                ><i className="fa fa-info"></i>
                </Button>
                <Button
                    color="success"
                    to={`/admin/qrcode/${props.cell.value}`}
                    className="mr-1"
                    tag={Link}
                    target="_blank"
                ><i className="fa fa-qrcode"></i>
                </Button>
            </>
        );
    }
    renderTable() {
        if (this.state.plants.length <= 0 || this.state.loaded === false) {
            return (
                <h1>
                    <i className="now-ui-icons loader_gear spin"></i>
                </h1>
            )
        } else {
            console.log(this.state.plants);

            const columns = [
                {
                    Header: "Plantas",
                    columns: [
                        {
                            Header: "Nome Popular",
                            accessor: "popularName",
                            sortType: "basic"
                        },
                        {
                            Header: "Nome Científico",
                            accessor: "scientificName",
                            sortType: "basic"
                        },
                        {
                            id: 'key',
                            Header: "Opções",
                            accessor: d => d.key,
                            Cell: props => this.displayActionItems(props),
                            sortable: false,
                        },
                    ]
                }
            ];
            return (
                <TableS data={this.state.plants} columns={columns} />
            )
        }
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