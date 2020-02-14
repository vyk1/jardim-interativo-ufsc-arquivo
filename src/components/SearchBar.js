import React from "react";
// react plugin used to create switch buttons
// plugin that creates slider
import Slider from "nouislider";

// reactstrap components
import {
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Col
} from "reactstrap";
import { Link } from "react-router-dom";

function SearchBar() {
    const [rightFocus, setRightFocus] = React.useState(false);
    const [word, setWord] = React.useState("");

    React.useEffect(() => {

        if (
            !document
                .getElementById("sliderRegular")
                .classList.contains("noUi-target")
        ) {
            Slider.create(document.getElementById("sliderRegular"), {
                start: [50],
                connect: [true, false],
                step: 0.5,
                range: { min: 0, max: 100 }
            });
        }
        if (
            !document.getElementById("sliderDouble").classList.contains("noUi-target")
        ) {
            Slider.create(document.getElementById("sliderDouble"), {
                start: [20, 80],
                connect: [false, true, false],
                step: 1,
                range: { min: 0, max: 100 }
            });
        }
    });

    return (
        <Col lg="10" sm="10">
            <InputGroup className={rightFocus ? "input-group-focus" : ""}>
                <Input
                    style={{ backgroundColor: "#fff" }}
                    placeholder="Buscar planta (científico/popular)"
                    type="text"
                    value={word}
                    onFocus={() => setRightFocus(true)}
                    onBlur={() => setRightFocus(false)}
                    onChange={e => setWord(e.target.value)}
                // onChange={e => setWord(e.target.value)}
                // >{word}</Input>
                ></Input>
                <InputGroupAddon addonType="append">
                    <InputGroupText>
                        <Link
                            to={{
                                pathname: `/pesquisa`,
                                state: {
                                    word
                                }
                            }}
                        // to={`/pesquisa/${encodeURI(word)}`}
                        >
                            <i style={{ margin: "3px", color: "black" }} className="fas fa-search"></i>
                        </Link>
                    </InputGroupText>
                </InputGroupAddon>
            </InputGroup>
        </Col>
    )
}
export default SearchBar;