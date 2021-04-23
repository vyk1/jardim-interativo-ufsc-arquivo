import React, { Component } from 'react'

import Main from './components/template/Main/Main'
import Logo from './components/template/Logo/Logo'
import Nav from './components/template/Nav/Nav'
import TableS from './components/table/Index'
import data from '../../data/HabCresc';

const headerProps = {
    icon: 'seedling',
    title: 'Todos os hábitos de crescimento',
    subtitle: 'Aqui estão listados todos os hábitos de crescimento.',
    type: 'habCresc',
    show: true
}

const initialState = {
    loaded: true,
}

export default class AllHabCresc extends Component {

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
            </div>
        )
    }
}