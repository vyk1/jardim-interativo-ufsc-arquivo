// https://github.com/tylermcginnis/re-base#updateendpoint-options
// https://imasters.com.br/desenvolvimento/git-para-corajosos-rebase-parte-01
// https://stackoverflow.com/questions/47375945/delete-firebase-storage-image-url-with-download-url
// https://firebase.google.com/docs/database/web/read-and-write

import React, { Component } from 'react'
import Main from '../template/Main'
import Logo from '../template/Logo'
import Nav from '../template/Nav'
import Footer from '../template/Footer'
import '../template/Tables.css'
import firebase from 'firebase'
import config, { storage } from 'config'
import { Alert } from 'reactstrap'

const headerProps = {
    icon: 'edit',
    title: 'Edição de Planta',
    subtitle: 'Clique no botão de edição para começar.'
}

const initialState = {
    plants: [],
    plant: {},
    image2: "",
    limit: 3,
    loaded: false,
    visible: true,
    sucess: false,
    error: false
}

export default class EditPlants extends Component {


    constructor(props) {
        super(props)

        this.state = initialState
        this.onDismiss = this.onDismiss.bind(this);
    }

    onDismiss() {
        let newView = !(this.state.visible)
        this.setState({ visible: newView });
    }

    getPlantsWithPagination() {

        // firestore
        const plants = firebase.database().ref('plantapedia/')
            .limitToFirst(this.state.limit)
            // .orderByChild('scientificName')
            .orderByKey()

        plants.on('value', (snap) => {
            let p = snap.val()
            return this.setState({ plants: p, loaded: true })
        })
    }

    clear() {
        this.setState({ plant: initialState.plant, id: null })
    }

    check(e) {
        e.preventDefault()
        this.setState({ loaded: false })

        const { scientificName, popularName, description, geoDistrib, regionForTreatment, activeIngredient, utilizationAndPrep } = this.state.plant
        const { id } = this.state

        const data = { scientificName, popularName, description, geoDistrib, regionForTreatment, activeIngredient, utilizationAndPrep }

        // SE TEM IMAGEM NOVA
        const oldImage = e.target.imagemAntiga.value

        if (e.target.image2.files[0]) {
            const newImage = e.target.image2.files[0]

            try {
                // solve storage 1st
                const ref = storage.refFromURL(oldImage)
                ref.put(newImage)
                    .then(img => {
                        img.ref.getDownloadURL()
                            .then(dURL => {
                                data['image'] = dURL

                                config.update(`plantapedia/${id}`, {
                                    data
                                })
                                    .then(() => {
                                        this.clear()
                                        return this.setState({ success: true, loaded: true, visible: true })
                                    })

                            })
                    })

            } catch (error) {
                console.log(error);
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
                        this.clear()
                        return this.setState({ success: true, loaded: true, visible: true })

                    })
            } catch (error) {
                console.log(error);
                return this.setState({ error: true, loaded: true, visible: true })
            }
        }

    }

    onNextPage = () => {
        this.setState(
            state => ({ limit: state.limit * 2 })
        )
        this.getPlantsWithPagination()
    }

    updateField(event) {
        const plant = { ...this.state.plant }
        plant[event.target.name] = event.target.value
        this.setState({ plant })
    }

    componentDidMount() {
        this.getPlantsWithPagination()
    }

    renderForm() {
        if (this.state.loaded && Object.keys(this.state.plant).length) {
            return (
                <div className="form">
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
                                    <br/>
                                    <img src={this.state.plant.image} />
                                </div>
                                {/* </img> alt={this.state.plant.scientificName} /> */}
                                {/* <input accept="image/*" type="file" name="image" id="image" name="image" placeholder="Selecione a imagem" onChange={e=>this.updateField(e)} value={this.state.plant.image} required ref={(ref) => this.image = ref} /> */}
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
                                    Limpar
                                        </button>
                            </div>
                        </div>
                    </form>
                </div>
            )
        }
    }

    load(plant, id) {
        this.setState({ plant, id })
    }

    renderTable() {
        const { loaded, plants } = this.state
        if (!loaded) {
            return (
                <h1>
                    <i className="now-ui-icons loader_gear spin"></i>
                </h1>
            )
        } else {
            return (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th scope="col">Nome Popular</th>
                                <th scope="col">Nome Científico</th>
                                <th scope="col">Editar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderRows()}
                        </tbody>
                    </table>
                    {loaded && plants && (
                        <button className="btn btn-info" type="button" onClick={this.onNextPage}>
                            Mais
                        </button>
                    )}

                </div>
            )
        }
    }

    renderRows() {

        return Object.keys(this.state.plants)
            .map(key => {
                return (
                    <tr key={key}>
                        <td data-label="Nome Popular">{this.state.plants[key].popularName}</td>
                        <td data-label="Nome Científico">{this.state.plants[key].scientificName}</td>
                        <td data-label="Editar">
                            <button className="btn btn-warning"
                                onClick={() => this.load(this.state.plants[key], key)}>
                                {/* <i className="fa fa-edit"></i> */}
                                <i className="now-ui-icons ui-1_settings-gear-63"></i>
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
                    {/* This is a primary alert with <a href="#" className="alert-link">an example link</a>. Give it a click if you like. */}
                    {this.renderForm()}
                    {this.renderTable()}
                </Main>
                <Footer />
            </div>
        )
    }
}