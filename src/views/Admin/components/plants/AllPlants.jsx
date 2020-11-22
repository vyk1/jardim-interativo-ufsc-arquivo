import React, { Component } from 'react'

import Main from '../template/Main/Main'
import Logo from '../template/Logo/Logo'
import Nav from '../template/Nav/Nav'
import '../template/Tables/Tables.css'

import config, { storage } from 'config'

import TableS from '../table/Index'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Badge } from 'reactstrap'
import { Link } from 'react-router-dom'
import HabCresc from 'data/HabCresc'
import MdTx from 'data/MdTx'

const headerProps = {
    icon: 'leaf',
    title: 'Todas as plantas',
    subtitle: 'Aqui estão listados todas as plantas.',
    type: 'planta',
}

const initialState = {
    plants: [],
    plant: {},
    loaded: true,
    disabled2: false,
    modal2: false
}

export default class AllPlants extends Component {

    constructor(props) {
        super(props)

        this.state = initialState

        this.toggle2 = this.toggle2.bind(this)
        this.erase = this.erase.bind(this)
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
                    className="col-sm-12 col-md-6 col-lg-4 col-xl-2"
                    id="infoBtn"
                    color="info"
                    to={`/leitura/${props.cell.value}`}
                    tag={Link}
                    target="_blank"
                ><i className="fa fa-info" />
                </Button>
                <Button
                    className="col-sm-12 col-md-6 col-lg-4 col-xl-2"
                    id="qrcodeBtn"
                    color="success"
                    to={`/admin/qrcode/${props.cell.value}`}
                    tag={Link}
                    target="_blank"
                ><i className="fa fa-qrcode" />
                </Button>
                <Button
                    className="col-sm-12 col-md-6 col-lg-4 col-xl-2"
                    id="gearBtn"
                    color="warning"
                    to={`/admin/editar-planta/${props.cell.value}`}
                    tag={Link}
                // onClick={() => this.load(props.row.original, props.cell)}
                ><i className="now-ui-icons ui-1_settings-gear-63" />
                </Button>
                <Button
                    className="col-sm-12 col-md-6 col-lg-4 col-xl-2"
                    id="scissorsBtn"
                    color="danger"
                    onClick={() => this.confirm(props.row.original, props.cell)}
                ><i className="now-ui-icons design_scissors" />
                </Button>
            </>
        );
    }

    confirm(plant, id) {
        let tableId = id.value
        this.setState({ modal2: true, plant, id: tableId })
    }

    renderTable() {

        if (this.state.plants.length <= 0 || this.state.loaded === false) {
            return (
                <h1>
                    <i className="now-ui-icons loader_gear spin" />
                </h1>
            )
        } else {

            let counter = []
            let counter2 = []

            for (let index = 0; index < this.state.plants.length; index++) {
                // para cada planta
                const plant = this.state.plants[index]

                // conte hab cresc
                for (let index = 0; index < plant.habit.length; index++) {
                    const habit = plant.habit[index]

                    isNaN(counter[habit]) ? counter[habit] = 1 : counter[habit]++
                }

                // conte mdtx
                for (let index = 0; index < plant.mdtx.length; index++) {
                    const mdtx = plant.mdtx[index]

                    isNaN(counter2[mdtx]) ? counter2[mdtx] = 1 : counter2[mdtx]++
                }
            }

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
                <>
                    {
                        HabCresc.map(h => (
                            <Badge key={h.name} color="primary">{h.name}: {counter[h.id] ? counter[h.id] : '-'}</Badge>
                        ))
                    }
                    <br />
                    {
                        MdTx.map(m => (
                            <Badge key={m.name} color="warning">{m.name}: {counter2[m.id] ? counter2[m.id] : '-'}</Badge>
                        ))
                    }

                    <br />
                    <Badge color="info">Total de Plantas Cadastradas {this.state.plants.length}</Badge>
                    <TableS data={this.state.plants} columns={columns} />
                </>
            )
        }
    }

    toggle2() {
        this.setState({
            modal2: !this.state.modal2
        })
    }

    erase() {

        this.setState({ loaded: false })
        const { id, plant } = this.state
        const image = plant.image
        try {
            const ref = storage.refFromURL(image)
            ref.delete()
                .then(() => {
                    config.remove(`plantapedia/${id}`)
                        .then(() => {
                            return this.setState({ success: true })
                        })
                        .catch(() => {
                            return this.setState({ success: true })
                        })
                })
                .catch(() => {
                    return this.setState({ success: true })
                })


        } catch (error) {
            return this.setState({ error: true })

        } finally {
            this.toggle2()
            window.location.href = "#root"
            return this.setState({ loaded: true })
        }

    }

    render() {
        return (
            <div className="app">
                <Logo />
                <Nav />
                <Main {...headerProps}>
                    {this.renderTable()}
                    <Modal isOpen={this.state.modal2} toggle={this.toggle2} centered={true}>
                        <ModalHeader toggle={this.toggle2}>Apagar Planta</ModalHeader>
                        <ModalBody>Deseja apagar "{this.state.plant.popularName}"?<br />
                                Atenção: Esta ação é irreversível
                            </ModalBody>
                        <ModalFooter>
                            <Button color="danger" onClick={this.erase}>Apagar</Button>
                            <Button color="secondary" onClick={this.toggle2}>Cancelar</Button>
                        </ModalFooter>
                    </Modal>
                </Main>
            </div>
        )
    }
}