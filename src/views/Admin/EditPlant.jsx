import React, { Component } from 'react'
import './components/template/Tables/Tables.css'
import { Alert, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'

import Main from './components/template/Main/Main'
import Logo from './components/template/Logo/Logo'
import Nav from './components/template/Nav/Nav'

import config, { storage } from 'config'
import firebase from 'firebase'
import imageCompression from 'browser-image-compression'
import PlantForm from 'components/Plants/PlantForm'
import PlantSchema from 'data/PlantSchema'

const headerProps = {
    icon: 'edit',
    title: 'Edição de Planta',
    subtitle: 'Preencha o formulário.',
    type: 'planta',
}

const initialState = {
    plant: {},
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

    async componentDidMount() {
        const { id } = this.props.match.params
        if (!id) {
            window.location.replace('/')
            return false;
        }

        const p = firebase.database().ref('plantapedia/' + id)
        p.on('value', async (snap) => {
            let plant = snap.val()
            await this.setState({ plant })
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
        this.setState({ plant: initialState.plant, id: null, loaded: true })
        return this.props.history.goBack()
    }

    handleChangeHabit(e) {
        let id = e.target.value

        const alreadySelected = this.state.plant.habit.includes(id)

        if (alreadySelected) {
            const filtered = this.state.plant.habit.filter(item => item !== id)
            this.setState({ plant: { ...this.state.plant, habit: filtered } })
        } else {
            this.setState({ plant: { ...this.state.plant, habit: [...this.state.plant.habit, id] } })
        }
    }

    handleChangeMdTx(e) {
        let id = e.target.value

        const alreadySelected = this.state.plant.mdtx.includes(id)

        if (alreadySelected) {
            const filtered = this.state.plant.mdtx.filter(item => item !== id)
            this.setState({ plant: { ...this.state.plant, mdtx: filtered } })
        } else {
            this.setState({ plant: { ...this.state.plant, mdtx: [...this.state.plant.mdtx, id] } })
        }
    }


    async check(e) {
        e.preventDefault()

        this.setState({ loaded: false })

        const newImage = e.target.image2.files[0]
        const { id } = this.props.match.params

        const obj = {
            popularName: this.state.plant.popularName,
            scientificName: this.state.plant.scientificName,
            description: this.state.plant.description,
            geoDistrib: this.state.plant.geoDistrib,
            image: this.state.plant.image,
        }

        const isEmpty = Object.values(obj).some(x => (x === null || x === ''))

        if (isEmpty) {
            return this.setState({ loaded: true, validationError: "Há campos necessários não preenchidos. Por favor, verifique o formulário." })
        }

        if (!this.state.plant.habit.length) {
            return this.setState({ loaded: true, validationError: "Por favor, preencha o campo 'Hábitos de Crescimento'." })
        }

        if (!this.state.plant.mdtx.length) {
            return this.setState({ loaded: true, validationError: "Por favor, preencha se a planta é tóxica ou medicinal." })
        }

        const oldImage = e.target.imagemAntiga.value

        let options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true
        }

        const data = new PlantSchema(this.state.plant)

        // Se tiver imagem nova:
        if (e.target.image2.files[0]?.length) {

            try {
                const compressedImage = await imageCompression(newImage, options)
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
                this.setState({ error: true, visible: true })
            } finally {
                this.setState({ loaded: true })
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
                return this.setState({ error: true, visible: true })
            } finally {
                this.setState({ loaded: true })
            }
        }
    }

    updateField(event) {
        const plant = { ...this.state.plant }
        plant[event.target.name] = event.target.value

        if (event.target.name === 'image2') {
            this.setState({ previewImg: URL.createObjectURL(event.target.files[0]) })
        }
        this.setState({ plant })
    }

    renderForm() {
        if (!Object.keys(this.state.plant).length || !this.state.loaded) {
            return (
                <h1>
                    <i className="now-ui-icons loader_gear spin"></i>
                </h1>
            )
        }
        return (
            <div className="form">
                <PlantForm
                    check={this.check.bind(this)}
                    updateField={this.updateField.bind(this)}
                    handleChangeHabit={this.handleChangeHabit.bind(this)}
                    handleChangeMdTx={this.handleChangeMdTx.bind(this)}
                    previewImg={this.state.previewImg}
                    editable={true}
                    clear={this.clear.bind(this)}
                    plant={this.state.plant}
                />
            </div>
        )
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
                                <Button color="secondary" onClick={() => { this.clear(); this.toggle() }}>Cancelar</Button>
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