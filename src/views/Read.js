import React from 'react';
import firebase from 'firebase'
import { Container } from 'reactstrap';
import FullNav from './FullNav.js';
import LoadingCog from './LoadingCog';
import TransparentFooter from 'components/Footers/TransparentFooter.js';

export default class Read extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            result: ""
        }
    }

    componentDidMount() {
        const plants = firebase.database().ref('plantapedia/' + this.props.match.params.id)
        plants.on('value', (snap) => {
            let p = snap.val()
            this.setState({ result: p })
        })
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
                        <Container>
                            <section id="about">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-lg-8 mx-auto">
                                            <div className="text-center">
                                                <h2>
                                                    {result.popularName}
                                                    <br />
                                                    {/* <span>Small Tag</span>Header with small subtitle */}
                                                    <small>{result.description}</small>
                                                </h2>
                                            </div>
                                            <img src={result.image} alt={result.popularName} />
                                            <ul>
                                                <li>{result.activeIngredient}</li>
                                                <li>{result.activeIngredient}</li>
                                                <li>{result.activeIngredient}</li>
                                                <li>{result.activeIngredient}</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </Container>
                    </div>
                </div>
                <TransparentFooter />
            </>

        )
    }
}