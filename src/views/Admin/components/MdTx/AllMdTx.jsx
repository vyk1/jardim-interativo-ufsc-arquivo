import React, { Component } from 'react'

import Main from '../template/Main/Main'
import Logo from '../template/Logo/Logo'
import Nav from '../template/Nav/Nav'
import Footer from '../template/Footer/Footer'
import data from '../../../../data/MdTx';

import TableS from '../table/Index'

const headerProps = {
    icon: 'medkit',
    title: 'Todas as categorizações de medi/toxicidade',
    subtitle: 'Aqui estão listados todas as categorizações de medi/toxicidade.',
    type: 'md-tx',
    show: true
}

const initialState = {
    loaded: true,
}

export default class AllMdTx extends Component {

    constructor(props) {
        super(props)

        this.state = initialState
    }

    renderTable() {

        const columns = [
            {
                Header: "Listagem",
                columns: [
                    {
                        Header: "#",
                        accessor: "id",
                        sortType: "basic"
                    },
                    {
                        Header: "Nome",
                        accessor: "name",
                        sortType: "basic"
                    },
                ]
            }
        ];
        return (
            <TableS data={data} columns={columns} />
        )
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