import React from 'react';
import firebase from 'firebase'
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Col, CardHeader, CardBody } from 'reactstrap';
import FullNav from './FullNav.js';
import LoadingCog from './LoadingCog';
import DefaultFooter from 'components/Footers/DefaultFooter.js';

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
            return false;
        }
        const plants = firebase.database().ref('plantapedia/' + this.props.match.params.id)
        plants.on('value', (snap) => {
            let p = snap.val()
            this.setState({ result: p })
            console.log(p);

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

        return (
            <>
                <FullNav />
                <div className="wrapper">
                    <div className="section">
                        <Col className="ml-auto mr-auto" md="10" xl="6">
                            <p className="category">
                                {result.popularName}
                                <i>({result.scientificName})</i>
                            </p>

                            <Card>
                                <CardHeader>
                                    <Nav
                                        className="justify-content-center"
                                        role="tablist"
                                        tabs
                                    >
                                        <NavItem>
                                            <NavLink
                                                className={this.state.activeTab === "1" ? "active" : ""}
                                                href="#pablo"
                                                onClick={e => {
                                                    e.preventDefault();
                                                    this.toggle("1");
                                                }}
                                            >
                                                <i className="now-ui-icons business_badge"></i>
                                                Informações Gerais
        </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={this.state.activeTab === "2" ? "active" : ""}
                                                href="#pablo"
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
                                                href="#pablo"
                                                onClick={e => {
                                                    e.preventDefault();
                                                    this.toggle("3");
                                                }}
                                            >
                                                <i className="now-ui-icons design-2_ruler-pencil"></i>
                                                Uso
        </NavLink>
                                        </NavItem>
                                        {/* <NavItem>
                                            <NavLink
                                                className={this.state.activeTab === "4" ? "active" : ""}
                                                href="#pablo"
                                                onClick={e => {
                                                    e.preventDefault();
                                                    this.toggle("4");
                                                }}
                                            >
                                                Settings
        </NavLink>
                                        </NavItem> */}
                                    </Nav>
                                </CardHeader>
                                <CardBody>
                                    <TabContent activeTab={this.state.activeTab}
                                        className="text-center"
                                    >
                                        <TabPane tabId="1">
                                            <p>
                                                <img src={result.image} alt={result.popularName} />
                                            </p>
                                            <h6>
                                                Descrição:
                                            </h6>
                                            {result.description}
                                        </TabPane>
                                        <TabPane tabId="2">


                                            <div className="typography-line">
                                                {/* <span>Descrição</span> */}
                                                <blockquote>
                                                    <p className="blockquote blockquote-muted">
                                                        {result.geoDistrib}
                                                        <br></br>
                                                        <br></br>
                                                        <small>--Distribuição Geográfica</small>
                                                    </p>
                                                </blockquote>
                                            </div>


                                        </TabPane>
                                        <TabPane tabId="3">
                                            <h6>
                                                Região para Tratamento:
                                            </h6>
                                            <p>
                                                {result.regionForTreatment}

                                            </p>
                                            <h6>
                                                Utilização e Preparo:
                                            </h6>
                                            <p>
                                                {result.utilizationAndPrep}
                                            </p>
                                        </TabPane>
                                        {/* <TabPane tabId="4">
                                            <p>
                                                "I will be the leader of a company that ends up being
                                                worth billions of dollars, because I got the answers. I
                                                understand culture. I am the nucleus. I think that’s a
                                                responsibility that I have, to push possibilities, to
                                                show people, this is the level that things could be at."
        </p>
                                        </TabPane> */}
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