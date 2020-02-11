import React, { Component } from "react";
// reactstrap components
import {
    CardDeck
} from "reactstrap";

import Items from "./Items.js"
import config from "../config.js";

export default class Cards extends Component {

    constructor(props) {
        super(props)

        this.state = {
            plants: [],
            limit: props.limit
        }

        config.syncState('plantapedia', {
            context: this,
            state: 'plants',
            asArray: false
        })
    }

    render() {

        if (this.state.plants.length <= 0) {
            return (
                <h1>
                    <i className="now-ui-icons loader_gear spin"></i>
                </h1>
            )
        } else {
            let rows = []
            let count = 0

            return (
                <>
                    {
                        Object.keys(this.state.plants)
                            .map(key => {
                                count++
                                if (count > this.state.limit) {
                                    return false
                                }
                                // rows.push(<Items key={key} content={this.state.plants} />)
                                rows.push(<Items key={key} ch={key} content={this.state.plants[key]} />)
                            })
                    }

                    <div className="col-lg-12 col-sm-12">
                        <CardDeck>{rows}</CardDeck>
                    </div>
                </>
            )
        }
    }
}

