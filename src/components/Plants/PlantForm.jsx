import HabCresc from 'data/HabCresc'
import MdTx from 'data/MdTx'
import React from 'react'

import { FormGroup, Label, Input } from 'reactstrap'

const PlantForm = ({ editable, previewImg, updateField, plant, handleChangeHabit, handleChangeMdTx, check, clear }) => {
    return (
        <form onSubmit={check}>
            <div className="row">
                <div className="col-lg-6 col-sm-12">
                    <div className="form-group">
                        <label htmlFor="popularName">Nome Popular</label>
                        <input type="text" className="form-control"
                            name="popularName"
                            id="popularName"
                            required
                            value={plant.popularName}
                            onChange={updateField}
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
                            value={plant.scientificName}
                            onChange={updateField}
                            placeholder="Digite o nome popular..." />
                    </div>
                </div>

                <div className="col-12">
                    <div className="form-group">
                        <label htmlFor="description">Descrição</label>
                        <textarea placeholder="Digite a Descrição..." required name="description" id="description" cols="30" rows="10" className="form-control" onChange={updateField} value={plant.description}></textarea>
                    </div>
                </div>
                <div className="col-12">
                    <div className="form-group">
                        <label htmlFor="geoDistrib">Distribuição Geográfica</label>
                        <textarea placeholder="Digite a Distribuição Geográfica..." required name="geoDistrib" id="geoDistrib" cols="30" rows="10" className="form-control" onChange={updateField} value={plant.geoDistrib}></textarea>
                    </div>
                </div>
                <div className="col-sm-12 col-md-6">
                    <fieldset>
                        <legend>Medicinal</legend>
                        <div className="col-12">
                            <div className="form-group">
                                <label htmlFor="regionForTreatment">Parte da Planta com Efeito Terapêutico</label>
                                <textarea placeholder="Digite a Parte da Planta com Efeito Terapêutico..." name="regionForTreatment" id="regionForTreatment" cols="30" rows="10" className="form-control" onChange={updateField} value={plant.regionForTreatment}></textarea>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="form-group">
                                <label htmlFor="activeIngredient">Princípios Ativos</label>
                                <textarea placeholder="Digite os Princípios Ativos..." name="activeIngredient" id="activeIngredient" cols="30" rows="10" className="form-control" onChange={updateField} value={plant.activeIngredient}></textarea>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="form-group">
                                <label htmlFor="therapeuticDose">Dose Terapêutica</label>
                                <textarea placeholder="Digite a Dose Terapêutica..." name="therapeuticDose" id="therapeuticDose" cols="30" rows="10" className="form-control" onChange={updateField} value={plant.therapeuticDose}></textarea>
                            </div>
                        </div>
                    </fieldset>
                </div>
                <div className="col-sm-12 col-md-6">
                    <fieldset>
                        <legend>Tóxica</legend>
                        <div className="col-12">
                            <div className="form-group">
                                <label htmlFor="regionForPoison">Parte da Planta que leva a Intoxicação</label>
                                <textarea placeholder="Digite a Parte da Planta com Efeito Tóxico..." name="regionForPoison" id="regionForPoison" cols="30" rows="10" className="form-control" onChange={updateField} value={plant.regionForPoison}></textarea>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="form-group">
                                <label htmlFor="toxicIngredient">Princípios Tóxicos</label>
                                <textarea placeholder="Digite os Princípios Tóxicos..." name="toxicIngredient" id="toxicIngredient" cols="30" rows="10" className="form-control" onChange={updateField} value={plant.toxicIngredient}></textarea>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="form-group">
                                <label htmlFor="toxicDose">Dose Tóxica</label>
                                <textarea placeholder="Digite a Dose Tóxica..." name="toxicDose" id="toxicDose" cols="30" rows="10" className="form-control" onChange={updateField} value={plant.toxicDose}></textarea>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="form-group">
                                <label htmlFor="possibleWounds">Possíveis Lesões</label>
                                <textarea placeholder="Digite as Possíveis Lesões..." name="possibleWounds" id="possibleWounds" cols="30" rows="10" className="form-control" onChange={updateField} value={plant.possibleWounds}></textarea>
                            </div>
                        </div>
                    </fieldset>
                </div>
                <div className="col-12">
                    <div className="form-group">
                        <label htmlFor="utilization">Utilização</label>
                        <textarea placeholder="Digite a Utilização..." name="utilization" id="utilization" cols="30" rows="10" className="form-control" onChange={updateField} value={plant.utilization}></textarea>
                    </div>
                </div>
                <div className="col-12">
                    <div className="form-group">
                        <label htmlFor="prepMode"> Modo de Preparo</label>
                        <textarea placeholder="Digite os Modo de Preparo..." name="prepMode" id="prepMode" cols="30" rows="10" className="form-control" onChange={updateField} value={plant.prepMode}></textarea>
                    </div>
                </div>
                <div className="col-12">
                    <div className="form-group">
                        <label htmlFor="effects">Efeitos</label>
                        <textarea placeholder="Digite os Efeitos..." name="effects" id="effects" cols="30" rows="10" className="form-control" onChange={updateField} value={plant.effects}></textarea>
                    </div>
                </div>
                <div className="col-12">
                    <div className="form-group">
                        <label htmlFor="observations">Observações</label>
                        <textarea placeholder="Digite as Observações..." name="observations" id="observations" cols="30" rows="10" className="form-control" onChange={updateField} value={plant.observations}></textarea>
                    </div>
                </div>
                <div className="col-12">
                    <div className="form-group">
                        <label htmlFor="references">Referências Bibliográficas</label>
                        <p className="text-muted">Dica: Pressione Shift + Enter para quebrar a linha entre referências</p>
                        <textarea placeholder="Digite as Referências Bibliográficas..." name="references" id="references" cols="30" rows="10" className="form-control" onChange={updateField} value={plant.references}></textarea>
                    </div>
                </div>

                <div className="col-6 mt-2 mb-2 mt-2">
                    <label htmlFor="habit">Hábito de Crescimento</label>
                    {
                        HabCresc.map(el => (
                            <FormGroup key={el.id} check onChange={handleChangeHabit} required>
                                <Label check>
                                    <Input defaultChecked={plant.habit.includes(el.id.toString()) ? true : false} type="checkbox" value={el.id} name="habit" id="habit" />
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
                        MdTx.map(el => (
                            <FormGroup key={el.id} check onChange={handleChangeMdTx} required>
                                <Label check>
                                    <Input defaultChecked={plant.mdtx.includes(el.id.toString()) ? true : false} type="checkbox" value={el.id} name="mdtx" id="mdtx" />
                                    {el.name}{" "}
                                    <span className="form-check-sign">
                                        <span className="check"></span>
                                    </span>
                                </Label>
                            </FormGroup>
                        ))
                    }
                </div>

                {
                    editable ?
                        <React.Fragment>
                            <legend>Imagens</legend>
                            <div className="col-6">
                                <div className="form-group">
                                    <label htmlFor="pImage" className="btn btn-danger disabled">Preview da Imagem Anterior</label>
                                    <br />
                                    <img src={plant.image} alt={plant.popularName} />
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="form-group">
                                    <label htmlFor="image2" className="btn btn-primary">Seleção da Nova Imagem</label>
                                    {plant.image2 && (
                                        <>
                                            <p>Imagem Carregada:</p>
                                            <img alt="img-preview" src={previewImg} />
                                        </>
                                    )}
                                    <input accept="image/*" type="file" id="image2" name="image2" placeholder="Selecione a imagem" onChange={updateField} value={plant.image2} />
                                    <input type="hidden" name="imagemAntiga" id="imagemAntiga" value={plant.image} />
                                </div>
                            </div>
                        </React.Fragment>
                        :
                        <div className="col-12 mt-2 mb-2 mt-2">
                            {plant.image && (
                                <>
                                    <p>Imagem Carregada:</p>
                                    <img alt="img-preview" src={previewImg} />
                                </>
                            )}
                            <input accept="image/*" type="file" name="image" id="image" placeholder="Selecione a imagem" onChange={updateField} value={plant.image} required />
                        </div>
                }

                <div className="col-12 d-flex justify-content-end">
                    <button type="submit" className="btn btn-info">
                        Salvar
                    </button>
                    <button className="btn btn-secondary ml-2"
                        onClick={clear}>
                        Cancelar
                    </button>
                </div>
            </div>
        </form>
    )
}

export default PlantForm