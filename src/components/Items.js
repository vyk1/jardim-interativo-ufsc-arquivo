import React from 'react';
import { Card, CardImg, CardBody, CardTitle, CardText, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import MDTXBadge from './MDTXBadge';
import './index.css';

const Items = props => {

    return (
        <div className="col-sm-12 col-md-6 col-lg-4">
            <Card key={props.ch}>
                <CardImg
                    alt={props.content.scientificName}
                    src={props.content.image}
                    className="cardImg"
                    top>
                </CardImg>
                <CardBody>
                    <CardTitle tag="h4">{props.content.popularName}</CardTitle>
                    <CardText>Também conhecido como <i>{props.content.scientificName}</i></CardText>

                    <div>
                        <MDTXBadge mdtx={props.content.mdtx} />
                    </div>

                    <Button
                        className="btn btn-success"
                        to={`/leitura/${props.ch}`}
                        tag={Link}>
                        <i className="fas fa-info"></i>
                    </Button>
                </CardBody>
            </Card>
        </div>
    )

}
export default Items