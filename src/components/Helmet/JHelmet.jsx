import React from "react"
import PropTypes from "prop-types"
import Helmet from "react-helmet"

function JHelmet({ title, description, meta, lang }) {

    return (
        <Helmet
            htmlAttributes={{
                lang,
            }}
            title={title}
            titleTemplate={`${title} | Jardim Interativo`}
            meta={[
                {
                    name: `robots`,
                    content: `index, follow`
                },
                {
                    name: `description`,
                    content: description,
                },
                {
                    property: `og:title`,
                    content: title,
                },
                {
                    property: `og:description`,
                    content: description,
                },
                {
                    property: `og:type`,
                    content: `website`,
                }
            ].concat(meta)}
        />
    )
}

JHelmet.defaultProps = {
    title: `Jardim Interativo`,
    description: `Esse website visa disponibilizar informações acerca das plantas medicinais e tóxicas dentro da veterinária a população`,
    author: `Victoria Botelho Martins`,
    lang: `pt-br`,
    meta: []
}

JHelmet.propTypes = {
    description: PropTypes.string,
    title: PropTypes.string.isRequired,
}

export default JHelmet
