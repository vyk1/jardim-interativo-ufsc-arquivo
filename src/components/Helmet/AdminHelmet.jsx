import React from "react"
import PropTypes from "prop-types"
import Helmet from "react-helmet"

function AdminHelmet({ title, description, meta, lang }) {

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
                    content: `noindex, nofollow`
                },
                {
                    name: `author`,
                    content: `Victoria Botelho Martins`
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

AdminHelmet.defaultProps = {
    title: `Jardim Interativo`,
    description: `Admin`,
    lang: `pt-br`,
    meta: []
}

AdminHelmet.propTypes = {
    description: PropTypes.string,
    title: PropTypes.string.isRequired,
}

export default AdminHelmet
