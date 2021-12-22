import React from "react"
import PropTypes from "prop-types"
import Helmet from "react-helmet"
import { HelmetProvider } from "react-helmet-async";

function JHelmet({ title, description, meta, lang, async }) {

    return (
        <HelmetProvider>
            <Helmet
                async={async}
                htmlAttributes={{
                    lang,
                }}
                title={`${title} | Jardim Interativo`}
                titleTemplate={`${title} | Jardim Interativo`}
                meta={[
                    {
                        name: `title`,
                        content: `${title} | Jardim Interativo`
                    },
                    {
                        name: `keywords`,
                        content: `projeto jardim interativo ufsc, jardim interativo, ufsc, universidade federal de santa catarina, projeto de extensão, base de conhecimento de plantas, compartilhar, toxicidade, medicina das plantas, medicina veterinária, tratamento, aplicabilidade de plantas`
                    },
                    {
                        name: `robots`,
                        content: `index, follow`
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
                        name: `charset`,
                        content: `UTF-8`,
                    },
                    {
                        property: `og:title`,
                        content: `${title} | Jardim Interativo`,
                    },
                    {
                        property: `og:description`,
                        content: description,
                    },
                    {
                        property: `og:type`,
                        content: `website`,
                    },
                    {
                        property: `og:site_name`,
                        content: `Jardim Interativo`,
                    },
                    {
                        property: `og:locale`,
                        content: `pt_BR`,
                    },
                    {
                        property: `og:url`,
                        content: `https://jardim-interativo.web.app`,
                    },
                ].concat(meta)}
            />
        </HelmetProvider>
    )
}

JHelmet.defaultProps = {
    title: `Jardim Interativo`,
    description: `Esse website visa disponibilizar informações acerca das plantas medicinais e tóxicas dentro da veterinária a população`,
    lang: `pt-br`,
    meta: [],
    async: false
}

JHelmet.propTypes = {
    description: PropTypes.string,
    title: PropTypes.string.isRequired,
}

export default JHelmet
