import React from 'react';
import firebase from 'firebase'
import FullNav from '../components/FullNav';
import { CardDeck } from 'reactstrap';
import Items from 'components/Items';
import LoadingCog from '../components/LoadingCog';
import DefaultFooter from 'components/Footers/DefaultFooter';
import AdminHelmet from 'components/Helmet/AdminHelmet';
import { DB_URL } from 'config';

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
        let split = word.split("")
        split[0] = split[0].toUpperCase()
        let capital = split.join("")

        //igual
        const plantsEqualTo = firebase.database().ref(DB_URL).orderByChild('popularName').equalTo(capital)
        plantsEqualTo.on('value', (snap) => {
            let p = snap.val()
            if (!p) {
                // return this.setState({ message: "Não foram encontrados parâmetros para esta pesquisa." })
                // podemos pensar em um sistema de busca "inteligente"
                // se não achar pega a primeira letra, sei lá

                const plantsStartAt = firebase.database().ref(DB_URL).orderByChild('popularName').startAt(capital)
                plantsStartAt.on('value', (snap) => {
                    let p = snap.val()
                    if (!p) {
                        return this.setState({ message: "Não foram encontrados parâmetros para esta pesquisa." })
                        // podemos pensar em um sistema de busca "inteligente"
                        // se não achar pega a primeira letra, sei lá
                    }
                    return this.setState({ plants: p })
                })
            }
            return this.setState({ plants: p })
        })
        // começando por 


        // const plants = firebase.database().ref(DB_URL).orderByChild('popularName').startAt(word).endAt(word + "\uf8ff")
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
                    <DefaultFooter />
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
                <AdminHelmet title={"Busca para " + this.state.word} />
                <FullNav />
                <div className="container">
                    <h2>Resultados da busca para: "{this.state.word}"</h2>
                    {
                        Object.keys(this.state.plants)
                            .map(key => {
                                // se colocar return, retorna o índice :hmm
                                rows.push(<Items key={key} ch={key} content={this.state.plants[key]} />)
                                return true
                            })
                    }
                    <div className="col-lg-12 col-sm-12">
                        <CardDeck>{rows}</CardDeck>
                    </div>
                </div>
                <DefaultFooter />
            </div>
        )
    }

    render() {
        return this.renderCards()
    }
}