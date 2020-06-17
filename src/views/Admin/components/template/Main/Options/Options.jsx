import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import "./styles.css";
import OptionsArray from './OptionsArray'

export default props => {

    const [loaded, setLoaded] = useState(false)
    const [element, setElement] = useState({})

    useEffect(() => {
        const find = async array => {
            for (let i = 0; i < OptionsArray.length; i++) {
                const element = OptionsArray[i];
                if (array.type === element.type) {
                    setLoaded(true)
                    setElement(element)
                }
            }
        }
        find(props)
    }, [props])
    
    return (
        !loaded ? (<></>)
            :
            (
                <>
                    <div className="options-menu">
                        <Link to={element.main}>
                            <i className={`fa fa-leaf`}></i>Listar</Link>
                        <Link to={element.add}>
                            <i className={`fa fa-plus-circle`}></i>Adicionar</Link>
                        <Link to={element.edit}>
                            <i className={`fa fa-edit`}></i>Editar ou Deletar</Link>
                    </div>

                </>
            )
    )

}
