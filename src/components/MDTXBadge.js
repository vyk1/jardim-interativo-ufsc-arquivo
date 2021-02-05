import React from 'react';
import Badge from 'reactstrap/lib/Badge';

const MDTXBadge = ({ mdtx }) => {
    return (
        <>
            {
                mdtx.includes("1") && (
                    <Badge className="mx-1" color="success">Medicinal</Badge>
                )
            }
            {
                mdtx.includes("2") && (
                    <Badge className="mx-1" color="warning">Tóxica</Badge>
                )
            }
        </>
    );
}

export default MDTXBadge;
