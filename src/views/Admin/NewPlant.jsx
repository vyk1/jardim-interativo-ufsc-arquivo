import React, { Component } from 'react'
import { Alert } from 'reactstrap'
import imageCompression from 'browser-image-compression'
import config, { storage } from 'config'

import Main from './components/template/Main/Main'
import Logo from './components/template/Logo/Logo'
import Nav from './components/template/Nav/Nav'
import PlantForm from '../../components/Plants/PlantForm'
import PlantSchema from '../../data/PlantSchema'

const headerProps = {
    icon: 'plus-circle',
    title: 'Nova Planta',
    subtitle: 'Preencha o formulário.',
    type: 'planta',
}

const initialState = {
    loaded: true,
    visible: true,
    popularName: "",
    scientificName: "",
    description: "",
    geoDistrib: "",
    regionForTreatment: "",
    activeIngredient: "",
    utilization: "",
    toxicDose: "",
    prepMode: "",
    therapeuticDose: "",
    image: "",
    mdtx: [],
    habit: [],
}

export default class NewPlant extends Component {
    state = { ...initialState }

    onDismiss() {
        let newView = !(this.state.visible)
        this.setState({ visible: newView })
    }

    async check(e) {
        e.preventDefault()
        this.setState({ loaded: false, success: false, error: false, validationError: false })

        const image = e.target.image.files[0]
        const { name } = image

        let options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: false
        }

        const obj = {
            popularName: this.state.popularName,
            scientificName: this.state.scientificName,
            description: this.state.description,
            geoDistrib: this.state.geoDistrib,
            image: this.state.image,
        }

        const isEmpty = Object.values(obj).some(x => (x === null || x === ''))

        if (isEmpty) {
            return this.setState({ loaded: true, validationError: "Há campos necessários não preenchidos. Por favor, verifique o formulário." })
        }

        if (!this.state.habit.length) {
            return this.setState({ loaded: true, validationError: "Por favor, preencha o campo 'Hábitos de Crescimento'." })
        }

        if (!this.state.mdtx.length) {
            return this.setState({ loaded: true, validationError: "Por favor, preencha se a planta é tóxica ou medicinal." })
        }

        const schema = new PlantSchema(this.state)

        try {
            const compressedImage = await imageCompression(image, options)
            const ref = storage.ref(name)

            ref.put(compressedImage)
                .then(img => {
                    img.ref.getDownloadURL()
                        .then(dURL => {
                            const plant = {
                                ...schema,
                                image: dURL,
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
            return this.setState({ error: true, loaded: true, visible: true })
        }
    }

    clear() {
        this.setState({ ...initialState, loaded: true })
    }

    handleChangeHabit(e) {
        let id = e.target.value

        const alreadySelected = this.state.habit.includes(id)

        if (alreadySelected) {
            const filtered = this.state.habit.filter(item => item !== id)
            this.setState({ habit: filtered })
        } else {
            this.setState({ habit: [...this.state.habit, id] })
        }
    }

    handleChangeMdTx(e) {
        let id = e.target.value

        const alreadySelected = this.state.mdtx.includes(id)

        if (alreadySelected) {
            const filtered = this.state.mdtx.filter(item => item !== id)
            this.setState({ mdtx: filtered })
        } else {
            this.setState({ mdtx: [...this.state.mdtx, id] })
        }
    }
    updateField(event) {
        if (event.target.name === 'image') {
            this.setState({ previewImg: URL.createObjectURL(event.target.files[0]) })
        }
        this.setState({ [event.target.name]: event.target.value })
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
                    <PlantForm
                        check={this.check.bind(this)}
                        previewImg={this.state.previewImg}
                        updateField={this.updateField.bind(this)}
                        handleChangeHabit={this.handleChangeHabit.bind(this)}
                        handleChangeMdTx={this.handleChangeMdTx.bind(this)}
                        clear={this.clear.bind(this)}
                        plant={this.state}
                    />
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
                    {this.state.validationError && (
                        <Alert color="danger" isOpen={this.state.visible} toggle={this.onDismiss}>
                            {this.state.validationError}
                        </Alert>
                    )}
                    {this.renderForm()}
                </Main>
            </div>

        )
    }
}