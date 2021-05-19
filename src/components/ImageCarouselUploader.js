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
    );
}

export default ImageCarouselUploader;
