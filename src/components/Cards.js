import React, { Component } from "react";
// reactstrap components
import {
    Button, CardGroup
} from "reactstrap";

import Items from "./Items.js"
import config from "../config.js";
import LoadingCog from "views/LoadingCog.js";

export default class Cards extends Component {

    constructor(props) {
        super(props)

        this.state = {
            plants: [],
            limit: props.limit,
            disabled: false
        }

        config.syncState('plantapedia', {
            context: this,
            state: 'plants',
            asArray: false
        })
    }
    
    onNextPage = async () => {
        await this.setState({ limit: this.state.limit * 2 })
        if (this.state.limit >= Object.keys(this.state.plants).length) {
            return this.setState({ disabled: true })
        }
    }
    render() {

        if (this.state.plants.length <= 0) {
            return (
                <LoadingCog />

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

                    <div className="col-12">
                        <h3 className="title" id="sobre">Catálogo <i className="fa fa-leaf"></i></h3>
                        <CardGroup>{rows}
                        </CardGroup>
                        {!this.state.disabled && (
                            <div className="d-flex flex-column-reverse">
                                <Button color="info" size="lg" onClick={this.onNextPage}>Mais</Button>
                            </div>
                        )}
                    </div>
                </>
            )
        }
    }
}

