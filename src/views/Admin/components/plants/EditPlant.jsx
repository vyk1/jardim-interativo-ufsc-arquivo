import React, { Component } from 'react'
import Main from '../template/Main/Main'
import Logo from '../template/Logo/Logo'
import Nav from '../template/Nav/Nav'
import Footer from '../template/Footer/Footer'
import '../template/Tables/Tables.css'
import config, { storage } from 'config'
import { Alert, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
import TableS from '../table/Index'

const headerProps = {
    icon: 'edit',
    title: 'Edição de Planta',
    subtitle: 'Clique na opção desejada.',
    type: 'planta',
}

const initialState = {
    plants: [],
    plant: {},
    image2: "",
    limit: 3,
    loaded: true,
    sucess: false,
    error: false,
    visible: true,
    disabled2: false
}

export default class EditPlants extends Component {

    constructor(props) {
        super(props)

        this.state = initialState

        this.onDismiss = this.onDismiss.bind(this)
        this.toggle = this.toggle.bind(this)
        this.toggle2 = this.toggle2.bind(this)
        this.clear = this.clear.bind(this)
        this.erase = this.erase.bind(this)
    }

    componentDidMount() {
        config.syncState('plantapedia', {
            context: this,
            state: 'plants',
            asArray: true
        })
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        })
    }

    toggle2() {
        this.setState({
            modal2: !this.state.modal2
        })
    }

    onDismiss() {
        this.setState({
            visible: !this.state.visible
        })
    }

    clear() {
        this.setState({ plant: initialState.plant, id: null })
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
            this.clear()
            window.location.href = "#root"
            return this.setState({ loaded: true, visible: true })
        }

    }

    check(e) {
        e.preventDefault()
        this.setState({ loaded: false })

        const { scientificName, popularName, description, geoDistrib, regionForTreatment, activeIngredient, utilizationAndPrep } = this.state.plant
        const { id } = this.state

        const data = { scientificName, popularName, description, geoDistrib, regionForTreatment, activeIngredient, utilizationAndPrep }

        const oldImage = e.target.imagemAntiga.value

        // SE TEM IMAGEM NOVA
        if (e.target.image2.files[0]) {
            const newImage = e.target.image2.files[0]

            try {
                // solve storage 1st
                const ref = storage.refFromURL(oldImage)
                // config.updateDoc()
                ref.put(newImage)
                    .then(img => {
                        img.ref.getDownloadURL()
                            .then(dURL => {
                                data['image'] = dURL

                                config.update(`plantapedia/${id}`, {
                                    data
                                })
                                    .then(() => {
                                        return this.setState({ modal: true })
                                    })

                            })
                    })

            } catch (error) {
                console.log(error)
                return this.setState({ error: true, loaded: true, visible: true })
            }

            // SE NÃO TEM IMAGEM NOVA
        } else {
            data['image'] = oldImage

            try {
                config.update(`plantapedia/${id}`, {
                    data
                })
                    .then(() => {
                        return this.setState({ modal: true })
                    })
            } catch (error) {
                console.log(error)
                return this.setState({ error: true, loaded: true, visible: true })
            }
        }

    }

    displayActionItems = props => {
        return (
            <>
                <Button
                    className="btn btn-warning"
                    onClick={() => this.load(props.row.original, props.cell)}
                >
                    <i className="now-ui-icons ui-1_settings-gear-63"></i>
                </Button>

                <Button
                    className="btn btn-danger"
                    onClick={() => this.confirm(props.row.original, props.cell)}
                >
                    <i className="now-ui-icons design_scissors"></i>
                </Button>
            </>
        );
    }
    updateField(event) {
        const plant = { ...this.state.plant }
        plant[event.target.name] = event.target.value
        this.setState({ plant })
    }

    renderForm() {
        if (this.state.plant && Object.keys(this.state.plant).length) {
            return (
                <div className="form" id="form">
                    <form onSubmit={this.check.bind(this)}>
                        <div className="row">
                            <div className="col-lg-6 col-sm-12">
                                <div className="form-group">
                                    <label htmlFor="popularName">Nome Popular</label>
                                    <input type="text" className="form-control"
                                        name="popularName"
                                        id="popularName"
                                        required
                                        value={this.state.plant.popularName}
                                        onChange={e => this.updateField(e)}
                                        placeholder="Digite o nome popular..." />
                                </div>
                            </div>

                            <div className="col-lg-6 col-sm-12">
                                <div className="form-group">
                                    <label htmlFor="scientificName">Nome Científico</label>
                                    <input type="text" className="form-control"
                                        name="scientificName"
                                        id="scientificName"
                                        required
                                        value={this.state.plant.scientificName}
                                        onChange={e => this.updateField(e)}
                                        placeholder="Digite o nome popular..." />
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="form-group">
                                    <label htmlFor="description">Descrição</label>
                                    <textarea placeholder="Digite a Descrição..." required name="description" id="description" cols="30" rows="10" className="form-control" onChange={e => this.updateField(e)} value={this.state.plant.description}></textarea>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="form-group">
                                    <label htmlFor="geoDistrib">Distribuição Geográfica</label>
                                    <textarea placeholder="Digite a Distribuição Geográfica..." required name="geoDistrib" id="geoDistrib" cols="30" rows="10" className="form-control" onChange={e => this.updateField(e)} value={this.state.plant.geoDistrib}></textarea>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="form-group">
                                    <label htmlFor="regionForTreatment">Região Utilizada Para Tratamento</label>
                                    <textarea placeholder="Digite a Região Utilizada Para Tratamento..." required name="regionForTreatment" id="regionForTreatment" cols="30" rows="10" className="form-control" onChange={e => this.updateField(e)} value={this.state.plant.regionForTreatment}></textarea>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="form-group">
                                    <label htmlFor="activeIngredient">Princípios Ativos</label>
                                    <textarea placeholder="Digite os Princípios Ativos..." required name="activeIngredient" id="activeIngredient" cols="30" rows="10" className="form-control" onChange={e => this.updateField(e)} value={this.state.plant.activeIngredient}></textarea>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="form-group">
                                    <label htmlFor="utilizationAndPrep">Utilização e Modos De Preparo</label>
                                    <textarea placeholder="Digite a Utilização e Modos De Preparo..." required name="utilizationAndPrep" id="utilizationAndPrep" cols="30" rows="10" className="form-control" onChange={e => this.updateField(e)} value={this.state.plant.utilizationAndPrep}></textarea>
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <label htmlFor="pImage">Preview da Imagem Anterior</label>
                                    <br />
                                    <img src={this.state.plant.image} alt={this.state.plant.popularName} />
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <label htmlFor="image2">Seleção de Nova Imagem</label>
                                    {this.state.image2 && (
                                        <p>Imagem Carregada</p>
                                    )}
                                    <input accept="image/*" type="file" id="image2" name="image2" placeholder="Selecione a imagem" onChange={e => this.setState({ image2: e.target.value })} value={this.state.image2} />
                                    <input type="hidden" name="imagemAntiga" id="imagemAntiga" value={this.state.plant.image} />
                                </div>

                            </div>

                            <div className="col-12 d-flex justify-content-end">
                                <button type="submit" className="btn btn-info" disabled={this.state.disabled}>
                                    Salvar
                                        </button>
                                <button className="btn btn-secondary ml-2"
                                    onClick={e => this.clear(e)}>
                                    Cancelar
                                        </button>
                            </div>
                        </div>
                    </form>
                </div>
            )
        }
    }

    load(plant, id) {
        let tableId = id.value
        this.setState({ plant, id: tableId })
        return window.location.href = "#root"
    }

    confirm(plant, id) {
        this.setState({ modal2: true, plant, id })
    }

    renderTable() {
        const { loaded } = this.state
        if (this.state.plants.length <= 0 || loaded === false) {
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
                            Header: "Mais Informações",
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
                        <td data-label="Editar">
                            <button className="btn btn-warning"
                                onClick={() => this.load(this.state.plants[key], key)}>
                                <i className="now-ui-icons ui-1_settings-gear-63"></i>
                            </button>
                        </td>
                        <td data-label="Apagar">
                            {/* 
// https://stackoverflow.com/questions/47375945/delete-firebase-storage-image-url-with-download-url
                             */}
                            <button className="btn btn-danger"
                                onClick={() => this.confirm(this.state.plants[key], key)}>
                                <i className="now-ui-icons design_scissors"></i>
                            </button>
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
                    {this.state.success && (
                        <Alert color="success" isOpen={this.state.visible} toggle={this.onDismiss}>
                            Operação Concluída com Sucesso!
                        </Alert>
                    )}
                    {this.state.error && (
                        <Alert color="danger" isOpen={this.state.visible} toggle={this.onDismiss}>
                            Ocorreu um erro, tente novamente mais tarde...
                        </Alert>
                    )}
                    {/* modal */}
                    <div>
                        <Modal isOpen={this.state.modal} toggle={this.toggle} centered={true}>
                            <ModalHeader toggle={this.toggle}>Sucesso!</ModalHeader>
                            <ModalBody>
                                Visitar a página?
                            </ModalBody>
                            <ModalFooter>
                                <Button color="info" onClick={() => { return this.props.history.push('/leitura/' + this.state.id) }}>Visitar</Button>{' '}
                                <Button color="secondary" onClick={() => { this.clear(); this.toggle(); this.setState({ loaded: true }) }}>Cancelar</Button>
                            </ModalFooter>
                        </Modal>
                    </div>
                    <div>
                        <Modal isOpen={this.state.modal2} toggle={this.toggle2} centered={true}>
                            <ModalHeader toggle={this.toggle2}>Apagar Planta</ModalHeader>
                            <ModalBody>Deseja apagar "{this.state.plant.popularName}"?<br />
                                Atenção: Esta ação é irreversível
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onClick={this.erase}>Apagar</Button>
                                <Button color="secondary" onClick={this.toggle2}>Cancelar</Button>
                            </ModalFooter>
                        </Modal>
                    </div>
                    {this.renderForm()}
                    {this.renderTable()}
                </Main>
                <Footer />
            </div>
        )
    }
}