import React from "react";

import FullNav from "./FullNav.js";
import DefaultFooter from "../components/Footers/DefaultFooter.js";
import { Col, Container, Row, TabContent, TabPane } from "reactstrap";
import CarouselSection from "components/Carousel.js";

function About() {
  // const [] = React.useState("2");
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
      <FullNav />
      <div className="wrapper">
        <div className="section">
          <h3 className="title" id="sobre">Sobre o Projeto</h3>
          <h5 className="description">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium maiores perferendis ipsam commodi fugiat vel praesentium porro alias, quaerat repudiandae illum, voluptatibus perspiciatis. Inventore fugit, totam blanditiis nesciunt quisquam tenetur.
            </h5>
          <Container>
            <Row className="text-center">
              <Col className="ml-auto mr-auto" md="12">
                <h4 className="title text-center">Fotos</h4>
              </Col>
              <TabContent className="gallery" activeTab={"pills1"}>
                <TabPane tabId="pills1">
                  <Col className="ml-auto mr-auto" md="12">
                    <Row className="collections">
                      <Col md="6">
                        <img
                          alt="..."
                          className="img-raised"
                          src={"https://via.placeholder.com/350"}
                        ></img>
                        <img
                          alt="..."
                          className="img-raised"
                          src={"https://via.placeholder.com/350"}
                        ></img>
                      </Col>
                      <Col md="6">
                        <img
                          alt="..."
                          className="img-raised"
                          src={"https://via.placeholder.com/350"}
                        ></img>
                        <img
                          alt="..."
                          className="img-raised"
                          src={"https://via.placeholder.com/350"}
                        ></img>
                      </Col>
                    </Row>
                  </Col>
                </TabPane>
              </TabContent>
            </Row>
          </Container>
        </div>
        <CarouselSection />
        <DefaultFooter />
      </div>
    </>
  );
}

export default About;
