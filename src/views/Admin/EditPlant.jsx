import React, { Component } from 'react'
import './components/template/Tables/Tables.css'
import { Alert, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
import imageCompression from 'browser-image-compression'
import firebase from 'firebase'

import Main from './components/template/Main/Main'
import Logo from './components/template/Logo/Logo'
import Nav from './components/template/Nav/Nav'

import config, { storage } from 'config'
import PlantForm from '../../components/Plants/PlantForm'
import PlantSchema from 'data/PlantSchema'
import AdminHelmet from 'components/Helmet/AdminHelmet'
import { DB_URL } from 'config'
import { compressionOptions } from 'config'
import { setFilename } from 'utils'

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
    newImagesPropArray: [],
    carouselImgsSnapshot: [],
}

export default class EditPlants extends Component {

    constructor(props) {
        super(props)

        this.state = initialState

        this.onDismiss = this.onDismiss.bind(this)
        this.toggle = this.toggle.bind(this)
        this.clear = this.clear.bind(this)
    }

    async componentDidMount() {
        const { id } = this.props.match.params
        if (!id) {
            window.location.replace('/admin')
            return false;
        }

        const p = firebase.database().ref(DB_URL + id)
        p.on('value', async (snap) => {
            let plant = snap.val()
            if (plant) {
                if (plant.carouselImgs) {
                    this.setState({ plant, carouselImgsSnapshot: [...plant.carouselImgs] })
                } else {
                    this.setState({ plant, carouselImgsSnapshot: [] })
                }
            } else {
                window.location.replace('/admin')
                return false;
            }
        })
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
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

        const { id } = this.props.match.params

        const obj = {
            popularName: this.state.plant.popularName,
            scientificName: this.state.plant.scientificName,
            description: this.state.plant.description,
            geoDistrib: this.state.plant.geoDistrib,
            image: this.state.plant.image,
        }

        console.log(this.state)
        console.log(obj)

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

        const data = new PlantSchema(this.state.plant)
        try {

            // Se não mudar as imagens do carrosel, não faz nada
            if (this.state.carouselImgsSnapshot.length === this.state.plant.carouselImgs?.length && !this.state.newImagesPropArray.length) {
                // Se tiver imagem nova:
                // Nova imagem principal
                if (this.state.image) {
                    const oldImage = this.state.plant.image
                    const ref = storage.refFromURL(oldImage)
                    const compressedImage = await imageCompression(this.state.image[0], compressionOptions)

                    // Substitui a anterior
                    //Precisa do url nova!
                    let uploaded = await ref.put(compressedImage)
                    let url = await uploaded.ref.getDownloadURL()
                    data['image'] = url
                    console.log(data)
                }
                // Se não tiver nova principal, faz nada
                // Se carrosel da bd != carrosel atual OU estiver enviando uma imagem diferente
            } else {
                data['carouselImgs'] = []
                let carrouselURLArr = []

                console.log(this.state.carouselImgsSnapshot.length)
                console.log(this.state.plant.carouselImgs)
                console.log(this.state.newImagesPropArray)

                // Se for deletada alguma imagem,
                if (this.state.carouselImgsSnapshot.length > this.state.plant.carouselImgs?.length) {
                    console.log('del')
                    // E estiver carregando mais imagens
                    if (this.state.newImagesPropArray.length) {
                        let difference = this.state.carouselImgsSnapshot.filter(x => !this.state.plant.carouselImgs.includes(x));

                        // Apaga a diferença
                        for (let index = 0; index < difference.length; index++) {
                            const element = difference[index]
                            const ref = storage.refFromURL(element)
                            await ref.delete()
                        }

                        // Faz upload das novas no Storage
                        for (let index = 0; index < this.state.newImagesPropArray.length; index++) {

                            const im = this.state.newImagesPropArray[index]
                            const name = setFilename(obj.popularName, index)

                            const ref = storage.ref(name)

                            // [File, "blob:http..."]
                            let compressedCarouselImage = await imageCompression(im[0], compressionOptions)

                            let uploaded = await ref.put(compressedCarouselImage)
                            let url = await uploaded.ref.getDownloadURL()
                            // Armazena as novas no array
                            await carrouselURLArr.push(url)
                        }

                        // Guarda o que está no input e as novas
                        data['carouselImgs'] = [...this.state.plant.carouselImgs, ...carrouselURLArr]
                    } else {
                        // E não estiver carregando mais imagens
                        let difference = this.state.carouselImgsSnapshot.filter(x => !this.state.plant.carouselImgs.includes(x));

                        // Apaga a diferença
                        for (let index = 0; index < difference.length; index++) {
                            const element = difference[index]
                            const ref = storage.refFromURL(element)
                            await ref.delete()
                        }
                        // Guardo o que está no input
                        data['carouselImgs'] = this.state.plant.carouselImgs
                        console.log(this.state.plant.carouselImgs)

                    }
                    // Se for a mesma quantidade de imagens no carrosel
                } else {
                    // E estiver carregando mais imagens
                    if (this.state.newImagesPropArray.length) {
                        console.log('up')

                        // Faz upload das novas no Storage
                        for (let index = 0; index < this.state.newImagesPropArray.length; index++) {

                            const im = this.state.newImagesPropArray[index]
                            const name = setFilename(obj.popularName, index)

                            const ref = storage.ref(name)

                            // [File, "blob:http..."]
                            let compressedCarouselImage = await imageCompression(im[0], compressionOptions)

                            let uploaded = await ref.put(compressedCarouselImage)
                            let url = await uploaded.ref.getDownloadURL()
                            await carrouselURLArr.push(url)
                        }
                        // Guardo o que vem no banco e o que está enviando
                        data['carouselImgs'] = [...this.state.carouselImgsSnapshot, ...carrouselURLArr]
                    } else {
                        // E não estiver carregando mais imagens
                        data['carouselImgs'] = this.state.carouselImgsSnapshot
                    }
                }
            }

            console.log(data['carouselImgs'])
            await config.update(`${DB_URL}${id}`, { data })
            this.setState({ success: true, modal: true })

        } catch (error) {
            console.log(error)
            this.setState({ error: true })
        } finally {
            this.setState({ visible: true, loaded: true })
        }
    }

    fileSelectedHandler(e) {
        let carouselLength = !this.state.plant.carouselImgs ? 0 : this.state.plant.carouselImgs.length
        if (this.state.newImagesPropArray.length + carouselLength < 5) {
            this.setState({ newImagesPropArray: [...this.state.newImagesPropArray, [...e.target.files, URL.createObjectURL(...e.target.files)]] })
        }
    }

    handleDelete(index) {
        let aux = this.state.plant.carouselImgs
        aux.splice(index, 1)
        this.setState({ plant: { ...this.state.plant, carouselImgs: [...aux] } })
    }

    updateField(event) {
        const plant = { ...this.state.plant }
        plant[event.target.name] = event.target.value

        if (event.target.name === 'image2') {
            this.setState({ previewImg: URL.createObjectURL(event.target.files[0]), image: [...event.target.files] })
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
                    fileSelectedHandler={this.fileSelectedHandler.bind(this)}
                    handleDelete={this.handleDelete.bind(this)}
                    imagesPropArray={this.state.plant.carouselImgs}
                    updateField={this.updateField.bind(this)}
                    handleChangeHabit={this.handleChangeHabit.bind(this)}
                    handleChangeMdTx={this.handleChangeMdTx.bind(this)}
                    previewImg={this.state.previewImg}
                    newImagesPropArray={this.state.newImagesPropArray}
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
                <AdminHelmet title={headerProps.title} />
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
                    {this.renderForm()}
                </Main>
            </div>
        )
    }
}