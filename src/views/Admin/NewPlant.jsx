import React, { Component } from 'react'
import { Alert } from 'reactstrap'
import imageCompression from 'browser-image-compression'
import config, { storage } from 'config'

import Main from './components/template/Main/Main'
import Logo from './components/template/Logo/Logo'
import Nav from './components/template/Nav/Nav'
import PlantForm from '../../components/Plants/PlantForm'
import PlantSchema from '../../data/PlantSchema'
import AdminHelmet from 'components/Helmet/AdminHelmet'
import { setFilename } from 'utils'
import { DB_URL, compressionOptions } from 'config'

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
    imagesPropArray: []
}

export default class NewPlant extends Component {
    state = { ...initialState }

    async check(e) {
        e.preventDefault()
        this.setState({ loaded: false, success: false, error: false, validationError: false })


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
            // Se houver imagens para carrosel
            if (this.state.imagesPropArray.length) {

                let carrouselURLArr = []

                for (let index = 0; index < this.state.imagesPropArray.length; index++) {
                    const im = this.state.imagesPropArray[index]
                    const name = setFilename(obj.popularName, index)

                    const ref = storage.ref(name)

                    // [File, "blob:http..."]
                    let compressedCarouselImage = await imageCompression(im[0], compressionOptions)

                    let uploaded = await ref.put(compressedCarouselImage)
                    let url = await uploaded.ref.getDownloadURL()
                    await carrouselURLArr.push(url)
                }

                const name = setFilename(obj.popularName)
                const ref = storage.ref(name)
                const compressedImage = await imageCompression(obj.image[0], compressionOptions)

                let uploaded = await ref.put(compressedImage)
                let url = await uploaded.ref.getDownloadURL()
                const plant = {
                    ...schema,
                    image: url,
                    carouselImgs: carrouselURLArr
                }
                await config.push(DB_URL, {
                    data: plant
                })

            } else {

                const name = setFilename(obj.popularName)
                const ref = storage.ref(name)
                const compressedImage = await imageCompression(obj.image[0], compressionOptions)

                let uploaded = await ref.put(compressedImage)
                let url = await uploaded.ref.getDownloadURL()
                const plant = {
                    ...schema,
                    image: url,
                }
                await config.push(DB_URL, {
                    data: plant
                })
            }

            this.clear()
            this.setState({ success: true, loaded: true, visible: true })

        } catch (error) {
            console.log(error)
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

    fileSelectedHandler(e) {
        if (this.state.imagesPropArray.length < 5) {
            this.setState({ imagesPropArray: [...this.state.imagesPropArray, [...e.target.files, URL.createObjectURL(...e.target.files)]] })
        }
    }

    handleDelete(index) {
        let aux = this.state.imagesPropArray
        aux.splice(index, 1)
        this.setState({ imagesPropArray: [...aux] })
    }

    onDismiss() {
        let newView = !(this.state.visible)
        this.setState({ visible: newView })
    }

    updateField(event) {
        if (event.target.name === 'image') {
            this.setState({ previewImg: URL.createObjectURL(event.target.files[0]), image: [...event.target.files] })
        } else {
            this.setState({ [event.target.name]: event.target.value })
        }
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
                        fileSelectedHandler={this.fileSelectedHandler.bind(this)}
                        handleDelete={this.handleDelete.bind(this)}
                        imagesPropArray={this.state.imagesPropArray}
                        updateField={this.updateField.bind(this)}
                        handleChangeHabit={this.handleChangeHabit.bind(this)}
                        handleChangeMdTx={this.handleChangeMdTx.bind(this)}
                        previewImg={this.state.previewImg}
                        clear={this.clear.bind(this)}
                        plant={this.state}
                        editable={false}
                    />
                </div>
            )
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