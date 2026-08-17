import React from "react"
// reactstrap components
import {
    Button, CardGroup
} from "reactstrap"

import Items from "./Items.js"
import { Link } from "react-router-dom"
import plants from "../data/plantapedia.generated.json"

export default function Cards({ limit }) {
    if (!plants.length) {
        return null
    }
    const visible = limit ? plants.slice(0, limit) : plants
    return (
        <div className="col-12">
            <h3 className="title" id="sobre">Espécimes <i className="fa fa-leaf"></i></h3>
            <CardGroup>
                {visible.map(plant => (
                    <Items key={plant.slug} ch={plant.slug} content={plant} />
                ))}
            </CardGroup>
            {plants.length > 3 && limit && (
                <div className="d-flex flex-column-reverse">
                    <Button tag={Link} to="/catalogo" color="info" size="lg">
                        Mais
                    </Button>
                </div>
            )}
        </div>
    )
}
