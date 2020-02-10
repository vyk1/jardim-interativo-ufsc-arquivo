import React, { useState, Component } from "react";
// reactstrap components
import {
    Card,
    CardImg,
    CardBody,
    CardTitle,
    CardText,
    Button,
    CardGroup,
    CardDeck
} from "reactstrap";

import Items from "./Items.js"
import config from "../config.js";

// function Cards() {
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
                    <i class="now-ui-icons loader_gear spin"></i>
                </h1>
            )
        } else {
            let rows = []
            return (
                <>
                    {
                        Object.keys(this.state.plants)
                            .map(key => {
                                console.log(key);

                                // return <Items key={key} content={this.state.plants[key]} />
                                rows.push(<Items key={key} content={this.state.plants[key]} />)
                            })
                        // for (let index = 1; index < this.state.limit; index++) {
                        //     //     return (<p>1</p>)
                        // }
                        //     const element = this.state.plants[index];
                        //     console.log("element");
                        //     console.log(element);
                        //     rows.push(<Items key={index} content={element} />)
                        // }
                    }

                    <CardDeck>{rows}</CardDeck>
                </>
            )
        }
    }
}

