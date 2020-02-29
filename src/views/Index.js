import React from "react";

import {
  Container,
} from "reactstrap";

// core components
import Cards from "components/Cards.js";

import FullNav from "./FullNav.js";
import DefaultFooter from "components/Footers/DefaultFooter.js";

function Index() {
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
          <Container>
            <h3 className="title" id="sobre">Sobre</h3>
            <h5 className="description">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium maiores perferendis ipsam commodi fugiat vel praesentium porro alias, quaerat repudiandae illum, voluptatibus perspiciatis. Inventore fugit, totam blanditiis nesciunt quisquam tenetur.
            </h5>
            <Cards limit={3} />
            {/* <Tabs /> */}
            {/* <div className="button-container">
              <Button className="btn-round" color="info" size="lg">
                Follow
              </Button>
              <Button
                className="btn-round btn-icon"
                color="default"
                id="tooltip515203352"
                size="lg"
              >
                <i className="fab fa-twitter"></i>
              </Button>
              <UncontrolledTooltip delay={0} target="tooltip515203352">
                Follow me on Twitter
              </UncontrolledTooltip>
              <Button
                className="btn-round btn-icon"
                color="default"
                id="tooltip340339231"
                size="lg"
              >
                <i className="fab fa-instagram"></i>
              </Button>
              <UncontrolledTooltip delay={0} target="tooltip340339231">
                Follow me on Instagram
              </UncontrolledTooltip>
            </div> */}
          </Container>
        </div>
        {/* <IndexHeader /> */}
        <div className="main">
          {/* <Images /> */}
          {/* <BasicElements /> */}
          {/* <Navbars /> */}
          {/* <Pagination /> */}
          {/* <Notifications /> */}
          {/* <Typography /> */}
          {/* <Javascript /> */}
          {/* <Carousel /> */}
          {/* <NucleoIcons /> */}
          {/* <CompleteExamples /> */}
          {/* <SignUp /> */}
          {/* <Examples /> */}
          {/* <Download /> */}
        </div>
        <DefaultFooter />
      </div>
    </>
  );
}

export default Index;
