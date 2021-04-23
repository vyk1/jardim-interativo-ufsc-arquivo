import React from "react";

import {
  Container,
} from "reactstrap";

import Cards from "components/Cards.js";

import FullNav from "../components/FullNav.js";
import DefaultFooter from "../components/Footers/DefaultFooter.js";
import JHelmet from "components/Helmet/JHelmet.jsx";

function Catalog() {
  React.useEffect(() => {
    document.body.classList.add("profile-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    return function cleanup() {
      document.body.classList.remove("profile-page");
      document.body.classList.remove("sidebar-collapse");
    };
  });
  return (
    <>
      <JHelmet title="Catálogo" description={"Veja nosso Catálogo de Espécimes"} />
      <FullNav />
      <div className="wrapper">
        <div className="section">
          <Container>
            <Cards />
          </Container>
        </div>
        <DefaultFooter />
      </div>
    </>
  );
}

export default Catalog;
