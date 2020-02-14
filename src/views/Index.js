import React from "react";

import {
  Container,
} from "reactstrap";

// core components
import Cards from "components/Cards.js";
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import DarkFooter from "components/Footers/DarkFooter.js";

import BasicElements from "./index-sections/BasicElements.js";
import Navbars from "./index-sections/Navbars.js";
// // import Tabs from "./index-sections/Tabs.js";
import Pagination from "./index-sections/Pagination.js";
import Notifications from "./index-sections/Notifications.js";
import Typography from "./index-sections/Typography.js";
import Javascript from "./index-sections/Javascript.js";
import Carousel from "./index-sections/Carousel.js";
import CompleteExamples from "./index-sections/CompleteExamples.js";
import SignUp from "./index-sections/SignUp.js";
import Examples from "./index-sections/Examples.js";
import ProfilePageHeader from "components/Headers/ProfilePageHeader.js";

function Index() {
  const [] = React.useState("2");
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
      <IndexNavbar />
      <div className="wrapper">
        <ProfilePageHeader />
        <div className="section">
          <Container>
            <Cards limit={6} />
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
          <BasicElements />
          <Navbars />
          <Pagination />
          <Notifications />
          <Typography />
          <Javascript />
          <Carousel />
          {/* <NucleoIcons /> */}
          <CompleteExamples />
          <SignUp />
          <Examples />
          {/* <Download /> */}
        </div>
        <DarkFooter />
      </div>
    </>
  );
}

export default Index;
