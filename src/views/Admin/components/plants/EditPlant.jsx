import React, { Component } from 'react'
import Main from '../template/Main'
import Logo from '../template/Logo'
import Nav from '../template/Nav'
import Footer from '../template/Footer'
import '../template/Tables.css'
import firebase, { firestore } from 'firebase'
import config, { storage } from 'config'

const headerProps = {
    icon: 'edit',
    title: 'Edição de Planta',
    subtitle: 'Clique no botão de edição para começar.'
}

const initialState = {
    plants: [],
    plant: {},
    limit: 5,
    loaded: false
}

export default class EditPlants extends Component {


    constructor(props) {
        super(props)

        this.state = initialState
    }
    //     config.syncState('plantapedia', {
    //         context: this,
    //         state: 'plants',
    //         asArray: false
    //     })
    // }


    getPlantsWithPagination() {

        // firestore

        const plants = firebase.database().ref('plantapedia/')
            .limitToFirst(this.state.limit)
            .orderByChild('scientificName')

        plants.on('value', (snap) => {
            let p = snap.val()
            this.setState({ plants: p, loaded: true })
        })
    }

    clear() {
        this.setState({ plant: initialState.plant, id: null })
    }

    async check(e) {
        e.preventDefault()

        const { id, scientificName, popularName, description, geoDistrib, regionForTreatment, activeIngredient, utilizationAndPrep } = this.state

        // SE TEM IMAGEM NOVA
        if (e.target.image2.files[0]) {
            const newImage = e.target.image2.files[0]
            const { name } = newImage
            // url
            const oldImage = e.target.imagemAntiga.value
            console.log(oldImage);
            console.log(storage);
            try {
                const ref = storage.ref().child(oldImage)
                console.log(ref);

                ref.delete().then(() => {

                })
            } catch (error) {
                console.log(error);
            }

            // SENÃO TEM IMAGEM NOVA
        } else {
            console.log('no img');
            try {
                config.update('plantapedia/' + id, {
                    data: { popularName: "novoNome" }
                })
                    .then(() => {
                        console.log('alterado');
                        // https://github.com/tylermcginnis/re-base#updateendpoint-options
                        // https://imasters.com.br/desenvolvimento/git-para-corajosos-rebase-parte-01
                        // https://stackoverflow.com/questions/47375945/delete-firebase-storage-image-url-with-download-url
                        // https://firebase.google.com/docs/database/web/read-and-write

                    })

                // const ref = storage.ref()
                // ref.put(image)
                //     .then(img => {
                //         // console.log(img);
                //         img.ref.getDownloadURL()
                //             .then(dURL => {
                //                 console.log(dURL);
                //                 const plant = {
                //                     scientificName,
                //                     popularName,
                //                     description,
                //                     geoDistrib,
                //                     regionForTreatment,
                //                     activeIngredient,
                //                     utilizationAndPrep,
                //                     image: dURL
                //                 }
                //                 console.log(plant);
                //                 config.push('plantapedia', {
                //                     data: plant
                //                 })
                //             })
                //     })
            } catch (error) {
                console.log(error);
            }
        }

    }

    onNextPage = () => {
        this.setState(
            state => ({ limit: state.limit + 5 }),
            this.getPlantsWithPagination,
        )
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
        if (Object.keys(this.state.plant).length) {
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
                                    <img src={this.state.plant.image} />
                                </div>
                                {/* </img> alt={this.state.plant.scientificName} /> */}
                                {/* <input accept="image/*" type="file" name="image" id="image" name="image" placeholder="Selecione a imagem" onChange={e=>this.updateField(e)} value={this.state.plant.image} required ref={(ref) => this.image = ref} /> */}
                            </div>
                            <div className="col-6">
                                <div className="form-group">
                                    <label htmlFor="image2">Seleção de Nova Imagem</label>
                                    {/* <input accept="image/*" type="file" id="image" name="image" placeholder="Selecione a imagem" onChange={e => this.updateField(e)} value={this.state.plant.image} required /> */}
                                </div>
                                <input accept="image/*" type="file" id="image2" name="image2" placeholder="Selecione a imagem" onChange={e => this.setState({ image2: e.target.value })} value={this.state.image2} />
                                <input type="hidden" name="imagemAntiga" id="imagemAntiga" value={this.state.plant.image} />

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
                        <button type="button" onClick={this.onNextPage}>
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
                    {this.renderForm()}
                    {this.renderTable()}
                </Main>
                <Footer />
            </div>
        )
    }
}