import React from 'react'
import { Link } from 'react-router-dom'
import "./styles.css";
const optionsArray = [{
    type: 'planta',
    main: '/admin/plantas',
    add: '/admin/nova-planta',
    edit: '/admin/editar-planta',
},
{
    type: 'categoria',
    main: '/admin/categorias',
    add: '/admin/nova-categoria',
    edit: '/admin/editar-categoria',
},
{
    type: 'tipo',
    main: '/admin/tipos',
    add: '/admin/novo-tipo',
    edit: '/admin/editar-tipo',
}
]

export default props => {

    const find = async props => {
        for (let i = 0; i < optionsArray.length; i++) {
            const element = optionsArray[i];
            if (props.type === element.type) {
                return await element
            }

        }
    }

    const el = find(props)
    return (
        <React.Fragment>
            <div className="options-menu">
                <Link to={el.main}>
                    <i className={`fa fa-leaf`}></i>Listar
                </Link>
                <Link to={el.add}>
                    <i className={`fa fa-plus-circle`}></i>Adicionar
                </Link>
                <Link to={el.edit}>
                    <i className={`fa fa-edit`}></i>Editar ou Deletar
                </Link>
            </div>

        </React.Fragment>
    )
}
