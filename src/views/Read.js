import React from 'react';
import firebase from 'firebase'
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Col, CardHeader, CardBody, FormGroup, Label, Input } from 'reactstrap';
import FullNav from '../components/FullNav.js';
import LoadingCog from '../components/LoadingCog';
import DefaultFooter from '../components/Footers/DefaultFooter.js';
import habits from '../data/HabCresc';
import mdtxs from '../data/MdTx';
import MDTXBadge from 'components/MDTXBadge.js';

export default class Read extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            result: "",
            activeTab: '1'
        }
    }

    componentDidMount() {
        if (!this.props.match.params.id) {
            window.location.replace('/')
            return false
        }
        const plants = firebase.database().ref('plantapedia/' + this.props.match.params.id)
        plants.on('value', (snap) => {
            let p = snap.val()
            if (!p) {
                window.location.replace('/')
                return false
            }
            this.setState({ result: p })
        })
    }

    toggle = tab => {
        if (this.state.activeTab !== tab) this.setState({ activeTab: tab });
    }

    renderInfo() {
        const { result } = this.state
        const hasThird = Boolean(result.prepMode) || Boolean(result.utilization)
        const hasFourth = Boolean(result.effects) || Boolean(result.observations)
        const hasFifth = Boolean(result.activeIngredient) || Boolean(result.regionForTreatment) || Boolean(result.therapeuticDose)
        const hasSixth = Boolean(result.toxicIngredient) || Boolean(result.toxicDose) || Boolean(result.possibleWounds) || Boolean(result.regionForPoison)
        const hasReferences = Boolean(result.references)

        const arr = [
            { condition: true, iconClassname: "now-ui-icons business_badge", title: "Informações Gerais" },
            { condition: true, iconClassname: "now-ui-icons location_compass-05", title: "Mais Detalhes" },
            { condition: hasThird, iconClassname: "now-ui-icons design-2_ruler-pencil", title: "Uso" },
            { condition: hasFourth, iconClassname: "now-ui-icons files_paper", title: "Efeitos & Observações" },
            { condition: hasFifth, iconClassname: "fas fa-file-medical mr-1", title: "Propriedades Medicinais" },
            { condition: hasSixth, iconClassname: "fas fa-skull-crossbones mr-1", title: "Propriedades Tóxicas" },
            { condition: hasReferences, iconClassname: "now-ui-icons education_agenda-bookmark", title: "Referências Bibliográficas" },
        ]
        return (
            <Card>
                <CardHeader>
                    <Nav
                        className="justify-content-center"
                        role="tablist"
                        tabs>
                        {
                            arr.map((e, i) => (
                                e.condition &&
                                <NavItem key={i + 1}>
                                    <NavLink
                                        className={this.state.activeTab === `${i + 1}` ? "active" : ""}
                                        href="#"
                                        onClick={e => {
                                            e.preventDefault();
                                            this.toggle(`${i + 1}`)
                                        }}
                                    >
                                        <i className={e.iconClassname}></i>
                                        {e.title}
                                    </NavLink>
                                </NavItem>
                            ))
                        }
                    </Nav>
                </CardHeader>
                <CardBody>
                    <TabContent activeTab={this.state.activeTab}
                        className="text-center">
                        <TabPane tabId="1">
                            <p>
                                <img src={result.image} alt={result.popularName} />
                            </p>
                            <h6>
                                Descrição:
                                            </h6>
                            <p>{result.description}</p>
                        </TabPane>
                        <TabPane tabId="2">
                            <div className="typography-line">
                                <blockquote>
                                    <p className="blockquote blockquote-muted">
                                        {result.geoDistrib}
                                        <br></br>
                                        <br></br>
                                        <small>Distribuição Geográfica</small>
                                    </p>
                                </blockquote>
                            </div>
                            <div>
                                <h4>Hábito de Crescimento</h4>
                                {
                                    habits.map(el => (
                                        <FormGroup aria-disabled key={el.id} check>
                                            <Label key={el.id} check>
                                                <Input disabled defaultChecked={result.habit.includes(el.id.toString()) ? true : false} type="checkbox" value={el.id} name="habit" id="habit" />
                                                {el.name}{" "}
                                                <span className="form-check-sign">
                                                    <span className="check"></span>
                                                </span>
                                            </Label>
                                        </FormGroup>
                                    ))
                                }
                            </div>
                            <div>
                                <h4>Tóxica, medicinal ou ambas?</h4>
                                {
                                    mdtxs.map(el => (
                                        <FormGroup aria-disabled key={el.id} check>
                                            <Label key={el.id} check>
                                                <Input disabled defaultChecked={result.mdtx.includes(el.id.toString()) ? true : false} type="checkbox" value={el.id} name="mdtx" id="mdtx" />
                                                {el.name}{" "}
                                                <span className="form-check-sign">
                                                    <span className="check"></span>
                                                </span>
                                            </Label>
                                        </FormGroup>
                                    ))
                                }
                            </div>
                        </TabPane>
                        <TabPane tabId="3">
                            {
                                result.utilization && (
                                    <h6>
                                        Utilização:
                                    </h6>
                                )
                            }
                            <p>
                                {result.utilization}
                            </p>
                            {
                                result.prepMode && (
                                    <h6>
                                        Modo de Preparo:
                                    </h6>
                                )
                            }
                            <p>
                                {result.prepMode}
                            </p>
                        </TabPane>
                        <TabPane tabId="4">
                            {
                                result.effects && (
                                    <>
                                        <h6>
                                            Efeitos
                                            </h6>
                                        <p>
                                            {result.effects}
                                        </p>
                                    </>
                                )
                            }
                            {
                                result.observations && (
                                    <>
                                        <h6>
                                            Observações
                                            </h6>
                                        <p>
                                            {result.observations}
                                        </p>
                                    </>
                                )
                            }
                        </TabPane>
                        <TabPane tabId="5">
                            {
                                result.activeIngredient && (
                                    <>
                                        <h6>
                                            Ingrediente Ativo
                                            </h6>
                                        <p>
                                            {result.activeIngredient}
                                        </p>
                                    </>
                                )
                            }
                            {
                                result.regionForTreatment && (
                                    <>
                                        <h6>
                                            Parte da Planta com Efeito Terapêutico
                                            </h6>
                                        <p>
                                            {result.regionForTreatment}
                                        </p>
                                    </>
                                )
                            }
                            {
                                result.therapeuticDose && (
                                    <>
                                        <h6>
                                            Dose Terapêutica
                                            </h6>
                                        <p>
                                            {result.therapeuticDose}
                                        </p>
                                    </>
                                )
                            }
                        </TabPane>
                        <TabPane tabId="6">
                            {
                                result.toxicIngredient && (
                                    <>
                                        <h6>
                                            Princípios Tóxicos
                                            </h6>
                                        <p>
                                            {result.toxicIngredient}
                                        </p>
                                    </>
                                )
                            }
                            {
                                result.regionForPoison && (
                                    <>
                                        <h6>
                                            Parte da Planta com Efeito Tóxico
                                            </h6>
                                        <p>
                                            {result.regionForPoison}
                                        </p>
                                    </>
                                )
                            }
                            {
                                result.toxicDose && (
                                    <>
                                        <h6>
                                            Dose Tóxica
                                            </h6>
                                        <p>
                                            {result.toxicDose}
                                        </p>
                                    </>
                                )
                            }
                            {
                                result.possibleWounds && (
                                    <>
                                        <h6>
                                            Possíveis Lesões
                                            </h6>
                                        <p>
                                            {result.possibleWounds}
                                        </p>
                                    </>
                                )
                            }

                        </TabPane>
                        <TabPane tabId="7">
                            <p>
                                {result.references}
                            </p>
                        </TabPane>
                    </TabContent>
                </CardBody>
            </Card>
        )
    }

    render() {
        const { result } = this.state

        if (!result) {
            return (
                <LoadingCog />
            )
        }
        return (
            <>
                <FullNav />
                <div className="wrapper">
                    <div className="section">
                        <Col className="ml-auto mr-auto" md="10" xl="6">
                            <p className="category">
                                {result.popularName}
                                <i>({result.scientificName})</i>
                                <MDTXBadge mdtx={result.mdtx} />
                            </p>

                            {this.renderInfo()}
                        </Col>
                    </div>
                    <DefaultFooter />
                </div>
            </>
        )
    }
}