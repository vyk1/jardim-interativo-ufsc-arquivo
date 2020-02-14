import React, { Component } from 'react'
import Main from '../template/Main'
import Logo from '../template/Logo'
import Nav from '../template/Nav'
import Footer from '../template/Footer'
import config, { storage } from 'config'
import { Alert } from 'reactstrap'

const headerProps = {
    icon: 'plus-circle',
    title: 'Nova Planta',
    subtitle: 'Preencha o formulário para completar a operação.'
}

const initialState = {
    loaded: true,
    visible: true,
    scientificName: "",
    popularName: "",
    description: "",
    geoDistrib: "",
    regionForTreatment: "",
    activeIngredient: "",
    utilizationAndPrep: "",
    image: "",
}

export default class NewPlant extends Component {
    state = { ...initialState }

    constructor(props) {
        super(props)
    }

    onDismiss() {
        let newView = !(this.state.visible)
        this.setState({ visible: newView });
    }
    async check(e) {
        e.preventDefault()
        this.setState({ loaded: false })

        const { scientificName, popularName, description, geoDistrib, regionForTreatment, activeIngredient, utilizationAndPrep } = this.state
        const image = e.target.image.files[0]
        const { name } = image

        try {

            const ref = storage.ref(name)
            ref.put(image)
                .then(img => {
                    // console.log(img);
                    img.ref.getDownloadURL()
                        .then(dURL => {
                            const plant = {
                                scientificName,
                                popularName,
                                description,
                                geoDistrib,
                                regionForTreatment,
                                activeIngredient,
                                utilizationAndPrep,
                                image: dURL
                            }
                            config.push('plantapedia', {
                                data: plant
                            }).then(() => {
                                this.clear()
                                return this.setState({ success: true, loaded: true, visible: true })
                            })
                        })
                })
        } catch (error) {
            console.log(error);
            return this.setState({ error: true, loaded: true, visible: true })
        }
    }
    clear() {
        this.setState({ ...initialState, loaded: true })
    }
    renderForm() {
        if (!this.state.loaded) {
            return (
                <h1>
                    <i className="now-ui-icons loader_gear spin"></i>
                </h1>
            )
        } else {
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
                                        value={this.state.popularName}
                                        onChange={e => this.setState({ popularName: e.target.value })}
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
                                        value={this.state.scientificName}
                                        onChange={e => this.setState({ scientificName: e.target.value })}
                                        placeholder="Digite o nome popular..." />
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="form-group">
                                    <label htmlFor="description">Descrição</label>
                                    <textarea placeholder="Digite a Descrição..." required name="description" id="description" cols="30" rows="10" className="form-control" onChange={e => this.setState({ description: e.target.value })} value={this.state.description}></textarea>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="form-group">
                                    <label htmlFor="geoDistrib">Distribuição Geográfica</label>
                                    <textarea placeholder="Digite a Distribuição Geográfica..." required name="geoDistrib" id="geoDistrib" cols="30" rows="10" className="form-control" onChange={e => this.setState({ geoDistrib: e.target.value })} value={this.state.geoDistrib}></textarea>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="form-group">
                                    <label htmlFor="regionForTreatment">Região Utilizada Para Tratamento</label>
                                    <textarea placeholder="Digite a Região Utilizada Para Tratamento..." required name="regionForTreatment" id="regionForTreatment" cols="30" rows="10" className="form-control" onChange={e => this.setState({ regionForTreatment: e.target.value })} value={this.state.regionForTreatment}></textarea>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="form-group">
                                    <label htmlFor="activeIngredient">Princípios Ativos</label>
                                    <textarea placeholder="Digite os Princípios Ativos..." required name="activeIngredient" id="activeIngredient" cols="30" rows="10" className="form-control" onChange={e => this.setState({ activeIngredient: e.target.value })} value={this.state.activeIngredient}></textarea>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="form-group">
                                    <label htmlFor="utilizationAndPrep">Utilização e Modos De Preparo</label>
                                    <textarea placeholder="Digite a Utilização e Modos De Preparo..." required name="utilizationAndPrep" id="utilizationAndPrep" cols="30" rows="10" className="form-control" onChange={e => this.setState({ utilizationAndPrep: e.target.value })} value={this.state.utilizationAndPrep}></textarea>
                                </div>
                            </div>

                            <div className="col-12">
                                {/* <input accept="image/*" type="file" name="image" id="image" name="image" placeholder="Selecione a imagem" onChange={e => this.setState({ image: e.target.value })} value={this.state.image} required ref={(ref) => this.image = ref} /> */}
                                <input accept="image/*" type="file" name="image" id="image" placeholder="Selecione a imagem" onChange={e => this.setState({ image: e.target.value })} value={this.state.image} required />
                            </div>

                            <div className="col-12 d-flex justify-content-end">
                                <button type="submit" className="btn btn-primary">
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
                    {this.renderForm()}

                </Main>
                <Footer />
            </div>

        )
    }
}