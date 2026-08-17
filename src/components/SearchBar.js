import React from "react";

import {
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Col
} from "reactstrap";

function SearchBar() {
    const [rightFocus, setRightFocus] = React.useState(false);
    const [word, setWord] = React.useState("");

    return (
        <Col lg="10" sm="10" style={{ marginTop: '12px' }}>
            <form onSubmit={e => {
                e.preventDefault()
                window.location.href = `/pesquisa/${word}`
            }}>
                <InputGroup className={rightFocus ? "input-group-focus" : ""}>
                    <Input
                        style={{ backgroundColor: "#fff", padding: "6px 14px", fontSize: "14px", lineHeight: "20px" }}
                        placeholder="Buscar por nome popular ou científico"
                        type="text"
                        value={word}
                        onFocus={() => setRightFocus(true)}
                        onBlur={() => setRightFocus(false)}
                        onChange={e => setWord(e.target.value)}
                    />
                    <InputGroupAddon addonType="append">
                        <InputGroupText style={{ backgroundColor: "#fff", padding: "6px 14px" }}>
                            <a href={`/pesquisa/${word}`} style={{ color: "#333", lineHeight: "20px", display: "block" }}>
                                <i className="fas fa-search"></i>
                            </a>
                        </InputGroupText>
                    </InputGroupAddon>
                </InputGroup >
            </form>
        </Col >
    )
}
export default SearchBar;