import React from 'react';
import firebase from 'firebase'
import FullNav from './FullNav';
import { CardDeck } from 'reactstrap';
import Items from 'components/Items';
import LoadingCog from './LoadingCog';

export default class Search extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            plants: "",
            message: "",
            word: this.props.match.params.word

        }
    }

    getCards() {
        const { word } = this.state
        const plants = firebase.database().ref('plantapedia/').startAt(word).endAt(word + "\uf8ff").orderByChild('popularName')
        plants.once('value', (snap) => {
            let p = snap.val()
            if (!p) {
                return this.setState({ message: "Não foram encontrados parâmetros para esta pesquisa." })
            }
            this.setState({ plants: p })
        })

    }
    componentDidMount() {
        this.getCards()
    }

    renderCards() {
        let rows = []
        if (this.state.message) {
            return (
                <div>
                    <FullNav />
                    <div className="container">
                        {/* <h2>Resultados da busca para: "{this.props.match.params.word}"</h2> */}
                        <h2>Resultados da busca para: "{this.state.word}"</h2>
                        <div className="col-lg-12 col-sm-12">
                            {this.state.message}
                        </div>
                    </div>
                </div>
            )
        }
        if (!this.state.plants) {
            return (
                <LoadingCog />
            )
        }
        return (

            <div>
                <FullNav />
                <div className="container">
                    <h2>Resultados da busca para: "{this.state.word}"</h2>
                    {
                        Object.keys(this.state.plants)
                            .map(key => {

                                rows.push(<Items key={key} ch={key} content={this.state.plants[key]} />)
                            })
                    }
                    <div className="col-lg-12 col-sm-12">
                        <CardDeck>{rows}</CardDeck>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return this.renderCards()
    }
}