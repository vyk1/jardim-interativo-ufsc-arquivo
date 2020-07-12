import React, { Component } from 'react'

import Main from '../template/Main/Main'
import Logo from '../template/Logo/Logo'
import Nav from '../template/Nav/Nav'
import Footer from '../template/Footer/Footer'
import '../template/Tables/Tables.css'

import config, { storage } from 'config'

import TableS from '../table/Index'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { Link } from 'react-router-dom'

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
                    id="infoBtn"
                    color="info"
                    to={`/leitura/${props.cell.value}`}
                    tag={Link}
                    target="_blank"
                ><i className="fa fa-info"></i>
                </Button>
                <Button
                    id="qrcodeBtn"
                    color="success"
                    to={`/admin/qrcode/${props.cell.value}`}
                    tag={Link}
                    target="_blank"
                ><i className="fa fa-qrcode"></i>
                </Button>
                <Button
                    id="gearBtn"
                    color="warning"
                    to={`/admin/editar-planta/${props.cell.value}`}
                    tag={Link}
                // onClick={() => this.load(props.row.original, props.cell)}
                ><i className="now-ui-icons ui-1_settings-gear-63"></i>
                </Button>
                <Button
                    id="scissorsBtn"
                    color="danger"
                    onClick={() => this.confirm(props.row.original, props.cell)}
                ><i className="now-ui-icons design_scissors"></i>
                </Button>
                {/* <Tooltip placement="top" toggle={(e) => this.toggleInfo(e)} isOpen={false} target="infoBtn">Visitar</Tooltip>
                <Tooltip placement="top" toggle={(e) => this.toggleQrCode(e)} isOpen={false} target="qrcodeBtn">Visitar</Tooltip>
                <Tooltip placement="top" toggle={(e) => this.toggleGear(e)} isOpen={false} target="gearBtn">Visitar</Tooltip>
                <Tooltip placement="top" toggle={(e) => this.toggleScissors(e)} isOpen={false} target="scissorsBtn">Visitar</Tooltip> */}
            </>
        );
    }

    confirm(plant, id) {
        console.log(plant)
        let tableId = id.value
        this.setState({ modal2: true, plant, id: tableId })
    }

    renderTable() {
        if (this.state.plants.length <= 0 || this.state.loaded === false) {
            return (
                <h1>
                    <i className="now-ui-icons loader_gear spin"></i>
                </h1>
            )
        } else {

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
                })

        } catch (error) {
            console.log(error)
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
                <Footer />
            </div>
        )
    }
}