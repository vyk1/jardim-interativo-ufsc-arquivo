import React, { Component } from 'react'
import Main from '../template/Main/Main'
import Logo from '../template/Logo/Logo'
import Nav from '../template/Nav/Nav'
import '../template/Tables/Tables.css'
import config, { storage } from 'config'
import { Alert, Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, FormGroup, Label } from 'reactstrap'
import habits from '../../../../data/HabCresc';
import mdtxs from '../../../../data/MdTx';
import firebase from 'firebase'
import imageCompression from 'browser-image-compression'

const headerProps = {
    icon: 'edit',
    title: 'Edição de Planta',
    subtitle: 'Clique na opção desejada.',
    type: 'planta',
}

const initialState = {
    plant: {},
    image2: "",
    loaded: true,
    sucess: false,
    error: false,
    visible: true,
}

export default class EditPlants extends Component {

    constructor(props) {
        super(props)

        this.state = initialState

        this.onDismiss = this.onDismiss.bind(this)
        this.toggle = this.toggle.bind(this)
        this.toggle2 = this.toggle2.bind(this)
        this.clear = this.clear.bind(this)
    }

    componentDidMount() {
        const { id } = this.props.match.params
        if (!id) {
            window.location.replace('/')
            return false;
        }

        const p = firebase.database().ref('plantapedia/' + id)
        p.on('value', (snap) => {
            let plant = snap.val()
            this.setState({ plant })
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
        return this.props.history.goBack()
    }

    handleChangeHabit(e) {
        let id = e.target.value

        const alreadySelected = this.state.plant.habit.includes(id)

        if (alreadySelected) {
            const filtered = this.state.plant.habit.filter(item => item !== id)
            this.setState({ habit: filtered })
        } else {
            this.setState({ habit: [...this.state.plant.habit, id] })
        }
    }

    handleChangeMdTx(e) {
        let id = e.target.value

        const alreadySelected = this.state.plant.mdtx.includes(id)

        if (alreadySelected) {
            const filtered = this.state.plant.mdtx.filter(item => item !== id)
            this.setState({ mdtx: filtered })
        } else {
            this.setState({ mdtx: [...this.state.plant.mdtx, id] })
        }
    }


    async check(e) {
        e.preventDefault()

        this.setState({ loaded: false })

        const { scientificName, popularName, description, geoDistrib, regionForTreatment, activeIngredient, prepMode, toxicDose, therapeuticDose, utilization, habit, mdtx } = this.state.plant

        const { id } = this.props.match.params

        const data = {
            scientificName, popularName, description, geoDistrib, regionForTreatment, activeIngredient, prepMode, toxicDose, therapeuticDose, utilization, habit, mdtx
        }

        console.log(data)
        const oldImage = e.target.imagemAntiga.value

        var options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true
        }

        // Se tiver imagem nova:
        if (e.target.image2.files[0]) {
            const newImage = e.target.image2.files[0]
            const compressedImage = await imageCompression(newImage, options)

            try {
                const ref = storage.refFromURL(oldImage)
                // Substitui a anterior
                ref.put(compressedImage)
                    .then(img => {
                        img.ref.getDownloadURL()
                            .then(dURL => {
                                // Pega a url nova
                                data['image'] = dURL

                                // E salva
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

            // Se não tiver:
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

    updateField(event) {
        const plant = { ...this.state.plant }
        plant[event.target.name] = event.target.value
        this.setState({ plant })

    }

    renderForm() {
        if (Object.keys(this.state.plant).length) {
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
                                    <label htmlFor="regionForTreatment">Parte da Planta com Efeito Terapêutico</label>
                                    <textarea placeholder="Digite a Parte da Planta com Efeito Terapêutico..." required name="regionForTreatment" id="regionForTreatment" cols="30" rows="10" className="form-control" onChange={e => this.updateField(e)} value={this.state.plant.regionForTreatment}></textarea>
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
                                    <label htmlFor="utilization">Utilização</label>
                                    <textarea placeholder="Digite a Utilização..." required name="utilization" id="utilization" cols="30" rows="10" className="form-control" onChange={e => this.updateField(e)} value={this.state.plant.utilization}></textarea>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="form-group">
                                    <label htmlFor="prepMode"> Modos De Preparo</label>
                                    <textarea placeholder="Digite os Modos De Preparo..." name="prepMode" id="prepMode" cols="30" rows="10" className="form-control" onChange={e => this.updateField(e)} value={this.state.plant.prepMode}></textarea>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="form-group">
                                    <label htmlFor="toxicDose">Dose Tóxica</label>
                                    <textarea placeholder="Digite a Dose Tóxica..." name="toxicDose" id="toxicDose" cols="30" rows="10" className="form-control" onChange={e => this.updateField(e)} value={this.state.plant.toxicDose}></textarea>

                                </div>
                            </div>
                            <div className="col-12">
                                <div className="form-group">
                                    <label htmlFor="therapeuticDose">Dose Terapêutica</label>
                                    <textarea placeholder="Digite a Dose Terapêutica..." name="therapeuticDose" id="therapeuticDose" cols="30" rows="10" className="form-control" onChange={e => this.updateField(e)} value={this.state.plant.therapeuticDose}></textarea>
                                </div>
                            </div>

                            <div className="col-6 mt-2 mb-2 mt-2">
                                <label htmlFor="habit">Hábito de Crescimento</label>
                                {
                                    habits.map(el => (
                                        <FormGroup key={el.id} check onChange={e => this.handleChangeHabit(e)}>
                                            <Label check>
                                                <Input defaultChecked={this.state.plant.habit.includes(el.id.toString()) ? true : false} type="checkbox" value={el.id} name="habit" id="habit" />
                                                {el.name}{" "}
                                                <span className="form-check-sign">
                                                    <span className="check"></span>
                                                </span>
                                            </Label>
                                        </FormGroup>
                                    ))
                                }
                            </div>
                            <div className="col-6 mt-2 mb-2 mt-2">
                                <label htmlFor="mdtx">Tóxica, medicinal ou ambas?</label>
                                {
                                    mdtxs.map(el => (
                                        <FormGroup key={el.id} check onChange={e => this.handleChangeMdTx(e)}>
                                            <Label check>
                                                <Input defaultChecked={this.state.plant.mdtx.includes(el.id.toString()) ? true : false} type="checkbox" value={el.id} name="mdtx" id="mdtx" />
                                                {el.name}{" "}
                                                <span className="form-check-sign">
                                                    <span className="check"></span>
                                                </span>
                                            </Label>
                                        </FormGroup>
                                    ))
                                }
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
                                    onClick={e => this.clear()}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )
        }
    }

    async load(plant, id) {
        await this.clear()
        let tableId = id.value
        this.setState({ plant, id: tableId })
        return window.location.href = "#root"
    }

    confirm(plant, id) {
        let tableId = id.value
        this.setState({ modal2: true, plant, id: tableId })
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
                    <div>
                        <Modal isOpen={this.state.modal} toggle={this.toggle} centered={true}>
                            <ModalHeader toggle={this.toggle}>Sucesso!</ModalHeader>
                            <ModalBody>
                                Visitar a página?
                            </ModalBody>
                            <ModalFooter>
                                <Button color="info" onClick={() => { return this.props.history.push('/leitura/' + this.props.match.params.id) }}>Visitar</Button>{' '}
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
                                <Button color="danger" onClick={this.erase}>Apagar</Button>
                                <Button color="secondary" onClick={this.toggle2}>Cancelar</Button>
                            </ModalFooter>
                        </Modal>
                    </div>
                    {this.renderForm()}
                </Main>
            </div>
        )
    }
}