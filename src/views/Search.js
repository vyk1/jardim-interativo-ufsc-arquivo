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
            word: props.location.state.word,
            plants: ""
        }
    }

    componentDidMount() {
        const { word } = this.state
        const plants = firebase.database().ref('plantapedia/').startAt(word).endAt(word + "\uf8ff").orderByChild('popularName')
        plants.once('value', (snap) => {
            let p = snap.val()
            console.log(p);
            console.log(word);
            debugger
            this.setState({ plants: p })
        })

    }

    // state = {
    //   user: null
    // }
    // componentDidMount () {
    //   const { handle } = this.props.match.params

    //   fetch(`https://api.twitter.com/user/${handle}`)
    //     .then((user) => {
    //       this.setState(() => ({ user }))
    //     })
    // }
    render() {
        let rows = []
        if (!this.state.word || this.state.plants) {
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
                    {/* <p>https://sebhastian.com/react-firebase-real-time-database-guide</p>
                <p>https://tylermcginnis.com/react-router-pass-props-to-link/</p> */}
                </div>
            </div>
        )
    }
}