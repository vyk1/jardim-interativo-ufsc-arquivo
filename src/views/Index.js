import React from "react";

import {
  Container,
} from "reactstrap";

// core components
import Cards from "components/Cards.js";

import FullNav from "../components/FullNav.js";
import DefaultFooter from "../components/Footers/DefaultFooter.js";
import JHelmet from "components/Helmet/JHelmet.jsx";
import CarouselComponent from "components/CarouselComponent.js";

function Index() {
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
      <JHelmet title="Início" />
      <FullNav />
      <div className="wrapper">
        <div className="section pt-0">
          <Container>
            <h3 className="title" id="sobre">
              Fotos <i className="fa fa-camera"></i>
            </h3>
            <CarouselComponent
              items={[
                require("../assets/img/carousel/1.jpeg"),
                require("../assets/img/carousel/2.jpeg"),
                require("../assets/img/carousel/3.jpeg"),
                require("../assets/img/carousel/4.jpeg"),
                require("../assets/img/carousel/5.jpeg"),
              ]} />
            <Cards limit={3} />
          </Container>
        </div>
        <DefaultFooter />
      </div>
    </>
  );
}

export default Index;
