import React from 'react';
import firebase from 'firebase'

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
            console.log(p);
            this.setState({ result: p })
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
        return (
            <div>
                <p>{JSON.stringify(this.props.match.params)}</p>
                <p>{JSON.stringify(this.state.result)}</p>
            </div>
        )
    }
}