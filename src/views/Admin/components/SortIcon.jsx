import React from 'react';

const SortIcon = props => (
    props.type === 'up' ?
        (
            <i className="fa fa-arrow-up p-2"></i>
        )
        : (
            <i className="fa fa-arrow-down p-2"></i>
        )

)
export default SortIcon;