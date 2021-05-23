import React from 'react';

const MainImageUploader = ({ image, loadedImg, popularName, previewImg, updateField, editable }) => {
    return (
        <>
            <legend className="ml-2 mt-2">Imagem Principal</legend>
            {
                // Edição
                editable ?
                    <>
                        <div className="col-6">
                            <div className="form-group">
                                <p htmlFor="pImage" className="border border-primary p-2">Preview da Imagem Anterior:</p>
                                <img src={image} alt={popularName} />
                            </div>
                        </div>

                        <div className="col-6">
                            {loadedImg && (
                                <>
                                    <p className="border border-warning p-2"><i>Preview</i> da Imagem Carregada:</p>
                                    <img alt="img-preview" src={previewImg} />
                                </>
                            )}

                            <div className="form-group">
                                <label htmlFor="image2" className="btn btn-primary">Clique aqui para adicionar uma nova imagem principal</label>
                                <input accept="image/*" type="file" id="image2" name="image2" placeholder="Selecione a imagem" onChange={updateField} />
                            </div>
                        </div>
                    </>
                    // Cadastro
                    :
                    <>
                        <div className="form-group">
                            <label htmlFor="image" className="btn btn-primary">Clique aqui para adicionar a nova imagem principal</label>
                            <input accept="image/*" type="file" name="image" id="image" onChange={updateField} required />
                        </div>

                        {previewImg && (
                            <>
                                <p className="border border-primary p-2 col-12"><i>Preview</i> da imagem principal</p>
                                <img alt="img-preview" src={previewImg} />
                            </>
                        )}
                    </>
            }
        </>
    );
}

export default MainImageUploader;
