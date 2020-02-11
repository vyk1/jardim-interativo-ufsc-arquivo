import React from 'react';
import firebase from 'firebase'

export default class Search extends React.Component {
    constructor(props) {
        super(props)
        console.log(props.location.state.word);

        this.state = {
            word: props.location.state.word
        }
    }

    // componentDidMount() {
    //     const plants = firebase.database().ref('plantapedia/' + this.props.match.params.id)
    //     plants.on('value', (snap) => {
    //         let p = snap.val()
    //         console.log(p);
    //         this.setState({ word: p })
    //     })

    // }

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
        return (
            <div>
                <p>{JSON.stringify(this.props.location.state)}</p>
                <p>{JSON.stringify(this.state.word)}</p>
                <p>https://sebhastian.com/react-firebase-real-time-database-guide</p>
                <p>https://tylermcginnis.com/react-router-pass-props-to-link/</p>
            </div>
        )
    }
}