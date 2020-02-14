import React from "react";

// reactstrap components
// import {
// } from "reactstrap";

// core components
import IndexNavbar from "components/Navbars/IndexNavbar.js";

import ProfilePageHeader from "components/Headers/ProfilePageHeader.js";

function Nav() {
    const [pills, setPills] = React.useState("2");
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
            <ProfilePageHeader />
        </>
    )
}
export default Nav