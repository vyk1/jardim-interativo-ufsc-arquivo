import React from 'react';
import { Card, CardImg, CardBody, CardTitle, CardText, Button } from 'reactstrap';

const Items = props => {

    return (
        <Card>
            <CardImg alt={props.content.scientificName}
                src={props.content.image}
                top>
            </CardImg>
            <CardBody>
                <CardTitle tag="h4">{props.content.popularName}</CardTitle>
                <CardText>Também conhecido como <i>{props.content.scientificName}</i></CardText>
                {/* <CardText>{JSON.stringify(props)}</CardText> */}
                <Button
                    color="success"
                    href="#pablo"
                    onClick={e => e.preventDefault()}
                >
                    Mais informações
            </Button>
            </CardBody>
        </Card>
    )
}
export default Items