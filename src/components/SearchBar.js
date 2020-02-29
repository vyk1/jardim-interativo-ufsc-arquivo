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
        <Col lg="10" sm="10">
            <InputGroup className={rightFocus ? "input-group-focus" : ""}>
                <Input
                    style={{ backgroundColor: "#fff" }}
                    placeholder="Buscar planta (nome popular)"
                    type="text"
                    value={word}
                    onFocus={() => setRightFocus(true)}
                    onBlur={() => setRightFocus(false)}
                    onChange={e => setWord(e.target.value)}
                ></Input>
                <InputGroupAddon addonType="append">
                    <InputGroupText>
                        <a href={`/pesquisa/${word}`}>
                            < i style={{ margin: "3px", color: "black" }} className="fas fa-search"></i>
                        </a>
                    </InputGroupText>
                </InputGroupAddon>
            </InputGroup >
        </Col >
    )
}
export default SearchBar;