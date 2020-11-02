import React from 'react';
import firebase from 'firebase'
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Col, CardHeader, CardBody, FormGroup, Label, Input, Badge } from 'reactstrap';
import FullNav from './FullNav.js';
import LoadingCog from './LoadingCog';
import DefaultFooter from '../components/Footers/DefaultFooter.js';
import habits from '../data/HabCresc';
import mdtxs from '../data/MdTx';

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

    render() {
        const { result } = this.state

        if (!result) {
            return (
                <LoadingCog />
            )
        }

        const hasDoses = Boolean(result.toxicDose) || Boolean(result.therapeuticDose)

        return (
            <>
                <FullNav />
                <div className="wrapper">
                    <div className="section">
                        <Col className="ml-auto mr-auto" md="10" xl="6">
                            <p className="category">
                                {result.popularName}
                                <i>({result.scientificName})</i>
                                {
                                    result.mdtx.includes("1") && (
                                        <Badge className="mx-1" color="success">Medicinal</Badge>
                                    )
                                }
                                {
                                    result.mdtx.includes("2") && (
                                        <Badge className="mx-1" color="warning">Tóxica</Badge>
                                    )
                                }
                            </p>

                            <Card>
                                <CardHeader>
                                    <Nav
                                        className="justify-content-center"
                                        role="tablist"
                                        tabs>
                                        <NavItem>
                                            <NavLink
                                                className={this.state.activeTab === "1" ? "active" : ""}
                                                href="#"
                                                onClick={e => {
                                                    e.preventDefault();
                                                    this.toggle("1");
                                                }}>
                                                <i className="now-ui-icons business_badge"></i>
                                                Informações Gerais
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={this.state.activeTab === "2" ? "active" : ""}
                                                href="#"
                                                onClick={e => {
                                                    e.preventDefault();
                                                    this.toggle("2");
                                                }}
                                            >
                                                <i className="now-ui-icons location_compass-05"></i>
                                                Mais Detalhes
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={this.state.activeTab === "3" ? "active" : ""}
                                                href="#"
                                                onClick={e => {
                                                    e.preventDefault();
                                                    this.toggle("3");
                                                }}
                                            >
                                                <i className="now-ui-icons design-2_ruler-pencil"></i>
                                                Uso
                                            </NavLink>
                                        </NavItem>
                                        {
                                            hasDoses && (
                                                <NavItem>
                                                    <NavLink
                                                        className={this.state.activeTab === "4" ? "active" : ""}
                                                        href="#"
                                                        onClick={e => {
                                                            e.preventDefault();
                                                            this.toggle("4");
                                                        }}
                                                    >
                                                        <i className="now-ui-icons files_paper"></i>
                                                    Doses
                                                </NavLink>
                                                </NavItem>
                                            )
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
                                                {/* <span>Descrição</span> */}
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
                                            <h6>
                                                Parte da Planta com Efeito Terapêutico:
                                            </h6>
                                            <p>
                                                {result.regionForTreatment}
                                            </p>
                                            <h6>
                                                Utilização:
                                            </h6>
                                            <p>
                                                {result.utilization}
                                            </p>
                                            <h6>
                                                Modo de Preparo:
                                            </h6>
                                            <p>
                                                {result.prepMode}
                                            </p>
                                        </TabPane>
                                        <TabPane tabId="4">
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
                                    </TabContent>
                                </CardBody>
                            </Card>
                        </Col>
                    </div>
                    <DefaultFooter />
                </div>
            </>
        )
    }
}