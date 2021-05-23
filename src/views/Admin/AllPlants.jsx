import React, { Component } from 'react'
import config, { storage } from 'config'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Badge } from 'reactstrap'
import { Link } from 'react-router-dom'

import './components/template/Tables/Tables.css'

import Main from './components/template/Main/Main'
import Logo from './components/template/Logo/Logo'
import Nav from './components/template/Nav/Nav'

import TableS from './components/table/Index'

import HabCresc from 'data/HabCresc'
import MdTx from 'data/MdTx'
import AdminHelmet from 'components/Helmet/AdminHelmet'
import { DB_URL } from 'config'
import Alert from 'reactstrap/lib/Alert'

const headerProps = {
    icon: 'leaf',
    title: 'Todas as plantas',
    subtitle: 'Aqui estão listados todas as plantas.',
    type: 'planta',
}

const initialState = {
    plants: [],
    plant: {},
    loaded: false,
    modal: false
}

export default class AllPlants extends Component {

    constructor(props) {
        super(props)

        this.state = initialState

        this.toggle = this.toggle.bind(this)
        this.erase = this.erase.bind(this)
    }

    componentDidMount() {
        config.syncState(DB_URL, {
            context: this,
            state: 'plants',
            asArray: true,
            then: (() => {
                this.setState({ loaded: true })
            }),
            onFailure: (() => {
                this.setState({ loaded: true, plants: [], error: true })
            }),

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
        this.setState({ modal: true, plant, id: tableId })
    }

    renderTable() {

        if (!this.state.loaded) {
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
                            sortType: "basic",
                            Cell: ({ value }) => <i>{value}</i>
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
                    <p className="text-muted">Clique abaixo em <u>Nome Popular</u> ou <u>Nome Científico</u> para ordenar a tabela</p>
                    <TableS data={this.state.plants} columns={columns} />
                </>
            )
        }
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        })
    }

    async erase() {

        this.setState({ loaded: false, success: false, error: false, modal: false })
        const { id, plant } = this.state
        const { image } = plant
        try {
            let ref = storage.refFromURL(image)
            await ref.delete()
                .catch(e => { })

            if (plant.carouselImgs) {
                for (let index = 0; index < plant.carouselImgs.length; index++) {
                    const element = plant.carouselImgs[index];
                    const refElement = storage.refFromURL(element)
                    await refElement.delete()
                        .catch(e => { })
                }
            }

            await config.remove(`${DB_URL}${id}`)

            this.setState({ success: true })

        } catch (error) {
            this.setState({ error: true })

        } finally {
            this.toggle()
            window.location.href = "#root"
            this.setState({ loaded: true })
        }

    }

    render() {
        return (
            <div className="app">
                <AdminHelmet title={headerProps.title} />
                <Logo />
                <Nav />
                <Main {...headerProps}>
                    {this.state.success && (
                        <Alert color="success" isOpen={this.state.success}>
                            Operação Concluída com Sucesso!
                        </Alert>
                    )}
                    {this.state.error && (
                        <Alert color="danger" isOpen={this.state.error}>
                            Ocorreu um erro!
                        </Alert>
                    )}
                    {this.renderTable()}
                    <Modal isOpen={this.state.modal} toggle={this.toggle} centered={true}>
                        <ModalHeader toggle={this.toggle}>Apagar Planta</ModalHeader>
                        <ModalBody>Deseja apagar "{this.state.plant.popularName}"?<br />
                                Atenção: Esta ação é irreversível
                            </ModalBody>
                        <ModalFooter>
                            <Button color="danger" onClick={this.erase}>Apagar</Button>
                            <Button color="secondary" onClick={this.toggle}>Cancelar</Button>
                        </ModalFooter>
                    </Modal>
                </Main>
            </div>
        )
    }
}