import PropTypes from "prop-types";
import React from "react";
import { Helmet } from 'react-helmet';
import { HelmetProvider } from "react-helmet-async";

function AdminHelmet({ title, description, meta, lang }) {

    return (
        <HelmetProvider>
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
        </HelmetProvider>
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
