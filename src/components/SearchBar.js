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
            <InputGroup className={rightFocus ? "input-group-focus" : ""} style={{ height: "20px" }}>
                <Input
                    style={{ backgroundColor: "#fff" }}
                    placeholder="Buscar por nome popular"
                    type="text"
                    value={word}
                    onFocus={() => setRightFocus(true)}
                    onBlur={() => setRightFocus(false)}
                    onChange={e => setWord(e.target.value)}
                />
                <InputGroupAddon addonType="append" style={{ maxHeight: "38px" }}>
                    <InputGroupText>
                        <a href={`/pesquisa/${word}`}>
                            < i style={{ margin: "3px", color: "black", height: '20px' }} className="fas fa-search"></i>
                        </a>
                    </InputGroupText>
                </InputGroupAddon>
            </InputGroup >
        </Col >
    )
}
export default SearchBar;