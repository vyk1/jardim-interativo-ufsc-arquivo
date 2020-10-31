import React, { Component } from "react"
// reactstrap components
import {
    Button, CardGroup
} from "reactstrap"

import Items from "./Items.js"
import config from "../config.js"
import LoadingCog from "views/LoadingCog.js"
import { Link } from "react-router-dom"

export default class Cards extends Component {

    constructor(props) {
        super(props)

        this.state = {
            plants: [],
        }
    }
    componentDidMount() {
        config.syncState('plantapedia', {
            context: this,
            state: 'plants',
            asArray: false,
            queries: {
                orderByChild: 'popularName'
            }
        })
    }

    render() {
        const length = Object.keys(this.state.plants).length
        const { limit } = this.props
        if (!length) {
            return (
                <LoadingCog />

            )
        } else {
            let rows = []
            let count = 0

            if (limit) {
                Object.keys(this.state.plants)
                    .map(key => {
                        count++
                        if (count > limit) {
                            return false
                        } else {
                            return rows.push(<Items key={key} ch={key} content={this.state.plants[key]} />)
                        }
                    })

                return (
                    <div className="col-12">
                        <h3 className="title" id="sobre">Espécimes <i className="fa fa-leaf"></i></h3>
                        <CardGroup>
                            {rows}
                        </CardGroup>
                        {length > 3 && limit && (
                            <div className="d-flex flex-column-reverse">
                                <Button tag={Link} to="/catalogo" color="info" size="lg">
                                    Mais
                                </Button>
                            </div>
                        )}
                    </div>
                )
            } else {
                Object.keys(this.state.plants)
                    .map(key => {
                        count++
                        rows.push(<Items key={key} ch={key} content={this.state.plants[key]} />)
                        return true
                    })
                return (
                    <div className="col-12">
                        <h3 className="title" id="sobre">Espécimes <i className="fa fa-leaf"></i></h3>
                        <CardGroup>
                            {rows}
                        </CardGroup>
                    </div>
                )
            }
        }
    }
}

