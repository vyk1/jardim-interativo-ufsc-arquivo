<<<<<<< HEAD
import React, { useState } from 'react';

const ImageCarouselUploader = () => {
    const [imagesPropArray, setImagesPropArray] = useState([])

    const fileSelectedHandler = (e) => {
        if (imagesPropArray.length < 5) {
            setImagesPropArray([...imagesPropArray, [...e.target.files, URL.createObjectURL(...e.target.files)]])
        }
    }

    const handleDelete = (index) => {
        let aux = imagesPropArray
        aux.splice(index, 1)
        setImagesPropArray([...aux])
    }

    return (
        <div className="col-12">
            <legend className="ml-2 mt-2">Imagens para Carrosel</legend>
            <div className="form-group">
                {
                    imagesPropArray.length >= 5 ?
                        <p className="text-danger">Número máximo (5) de imagens para Carrosel atingido</p>
                        :
                        <>
                            <label htmlFor="images" className="btn btn-primary">Clique aqui para adicionar uma nova imagem ao Carrosel</label>
                            <input type="file" id="images" accept="image/*" onChange={fileSelectedHandler} />
                        </>
                }
            </div>

            <p className="text-muted">Clique na imagem para <span className="text-danger">apagá-la</span> </p>

            <p className="border border-primary p-2 rounded-pill">Preview das Imagens para Carrosel:</p>
            {
                imagesPropArray.map((img, i) => (
                    <React.Fragment key={i}>
                        <p>Imagem Carregada {i + 1}:</p>
                        <img alt={"img-preview-" + i} src={img[1]} onClick={(i) => handleDelete(i)} />
                    </React.Fragment>
                ))
            }
        </div>
=======
import React from 'react';

const ImageCarouselUploader = ({ newImagesPropArray, oldImages, editable, fileSelectedHandler, handleDelete, imagesPropArray }) => {

    const getNumber = (oldImages) => !oldImages ? 0 : oldImages.length

    return (
        <>
            <legend className="ml-2 mt-2">Imagens para Carrosel</legend>
            <h5 className="col-12 text-warning">*Número máximo de imagens no carrosel: 5 </h5>
            {
                editable ?
                    // novas dão push
                    <>
                        {oldImages?.length ?
                            <div className="col-6">
                                <>
                                    <p className="border border-primary p-2 col-12"><i>Preview</i> das imagens antigas para carrosel:</p>
                                    <p className="text-muted col-12">Clique na imagem para <span className="text-danger">apagá-la</span> </p>
                                    {
                                        oldImages?.map((img, i) => (
                                            <React.Fragment key={i}>
                                                <p>Imagem Anterior n° {i + 1}:</p>
                                                <img alt={"img-preview-" + i} src={img} onClick={(i) => handleDelete(i)} />
                                            </React.Fragment>
                                        ))
                                    }
                                </>
                            </div>
                            :
                            null
                        }

                        <div className="col-6">
                            <div className="form-group">
                                {newImagesPropArray.length ?
                                    <>
                                        <p className="border border-warning p-2"><i>Preview</i> das imagens novas para carrosel:</p>
                                        <p className="text-muted col-12">As novas imagens serão adicionadas após as antigas (se existirem)</p>
                                        {
                                            newImagesPropArray.map((img, i) => (
                                                <React.Fragment key={i}>
                                                    <p>Nova Imagem n° {i + 1 + getNumber(oldImages)}:</p>
                                                    <img alt={"img-preview-" + i} src={img[1]} />
                                                </React.Fragment>
                                            ))
                                        }
                                    </>
                                    :
                                    null
                                }
                                {
                                    newImagesPropArray.length + getNumber(oldImages) >= 5 ?
                                        <p className="text-danger">Número máximo (5) de imagens para carrosel atingido</p>
                                        :
                                        <>
                                            <label htmlFor="images" className="btn btn-primary">Clique aqui para adicionar uma nova imagem ao carrosel</label>
                                            <input type="file" id="images" accept="image/*" onChange={fileSelectedHandler} />
                                        </>
                                }
                            </div>
                        </div>
                    </>
                    :
                    <>
                        <div className="form-group">
                            {
                                imagesPropArray?.length >= 5 ?
                                    <p className="text-danger">Número máximo (5) de imagens para carrosel atingido</p>
                                    :
                                    <>
                                        <label htmlFor="images" className="btn btn-primary">Clique aqui para adicionar uma nova imagem ao carrosel</label>
                                        <input type="file" id="images" accept="image/*" onChange={fileSelectedHandler} />
                                    </>
                            }
                        </div>


                        {imagesPropArray?.length ?
                            <>
                                <p className="border border-primary p-2 col-12"><i>Preview</i> das imagens para carrosel:</p>
                                <p className="text-muted col-12">Clique na imagem para <span className="text-danger">apagá-la</span> </p>
                            </>
                            : null}
                        {
                            imagesPropArray?.map((img, i) => (
                                <div className="col-12" key={i}>
                                    <p>Imagem Carregada {i + 1}:</p>
                                    <img alt={"img-preview-" + i} src={img[1]} onClick={(i) => handleDelete(i)} />
                                </div>
                            ))
                        }
                    </>
            }
        </>
>>>>>>> 12d9870ee5c3d2e3de6286bf002b24323338120e
    );
}

export default ImageCarouselUploader;
