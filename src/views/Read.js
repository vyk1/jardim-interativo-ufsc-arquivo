import React from 'react';
import firebase from 'firebase'
import IndexNavbar from 'components/Navbars/IndexNavbar';
import ProfilePageHeader from 'components/Headers/ProfilePageHeader';
import { Container } from 'reactstrap';
import Nav from './Nav';

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
            <>
                <Nav />
                <div className="wrapper">
                    <div className="section">
                        <Container>
                            <section id="about">
                                <div class="container">
                                    <div class="row">
                                        <div class="col-lg-8 mx-auto">
                                            <h2>About this page</h2>
                                            <p class="lead">This is a great place to talk about your webpage. This template is purposefully unstyled so you can use it as a boilerplate or starting point for you own landing page designs! This template features:</p>
                                            {/* <div> */}
                                            <img src="" alt="" srcset="" />
                                            <p>{JSON.stringify(this.props.match.params)}</p>
                                            <p>{JSON.stringify(this.state.result)}</p>
                                            {/* </div> */}
                                            <ul>
                                                <li>Clickable nav links that smooth scroll to page sections</li>
                                                <li>Responsive behavior when clicking nav links perfect for a one page website</li>
                                                <li>Bootstrap's scrollspy feature which highlights which section of the page you're on in the navbar</li>
                                                <li>Minimal custom CSS so you are free to explore your own unique design options</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </Container>
                    </div>
                </div>
            </>

        )
    }
}