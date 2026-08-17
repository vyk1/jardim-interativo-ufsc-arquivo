import React from 'react';
import FullNav from '../components/FullNav';
import { CardDeck } from 'reactstrap';
import Items from 'components/Items';
import DefaultFooter from 'components/Footers/DefaultFooter';
import AdminHelmet from 'components/Helmet/AdminHelmet';
import plants from '../data/plantapedia.generated.json';

export default class Search extends React.Component {
    constructor(props) {
        super(props)

        const word = this.props.match.params.word
        const term = word.trim().toLowerCase()
        const matches = plants.filter(plant => {
            const popular = (plant.popularName || '').toLowerCase()
            const scientific = (plant.scientificName || '').toLowerCase()
            return popular.includes(term) || scientific.includes(term)
        })

        this.state = { word, matches }
    }

    render() {
        const { word, matches } = this.state
        return (
            <div>
                <AdminHelmet title={"Busca para " + word} />
                <FullNav />
                <div className="container" style={{ marginTop: "40px" }}>
                    <h2>Resultados da busca para: "{word}"</h2>
                    {matches.length === 0 ? (
                        <div className="col-lg-12 col-sm-12">
                            Não foram encontrados parâmetros para esta pesquisa.
                        </div>
                    ) : (
                        <div className="col-lg-12 col-sm-12">
                            <CardDeck>
                                {matches.map(plant => (
                                    <Items key={plant.slug} ch={plant.slug} content={plant} />
                                ))}
                            </CardDeck>
                        </div>
                    )}
                </div>
                <DefaultFooter />
            </div>
        )
    }
}
