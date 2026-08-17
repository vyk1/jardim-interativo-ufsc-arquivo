import React from 'react';
import Badge from 'reactstrap/lib/Badge';

const MDTXBadge = ({ mdtx }) => {
    const list = mdtx || []
    return (
        <>
            {
                list.includes("Medicinal") && (
                    <Badge className="mx-1" color="success">Medicinal</Badge>
                )
            }
            {
                list.includes("Tóxica") && (
                    <Badge className="mx-1" color="warning">Tóxica</Badge>
                )
            }
        </>
    );
}

export default MDTXBadge;
