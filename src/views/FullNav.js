import React from 'react';
import IndexNavbar from 'components/Navbars/IndexNavbar';
import ProfilePageHeader from 'components/Headers/ProfilePageHeader';

export default function FullNav() {

    React.useEffect(() => {
        document.body.classList.add("profile-page");
        document.body.classList.add("sidebar-collapse");
        document.documentElement.classList.remove("nav-open");
        return function cleanup() {
            document.body.classList.remove("profile-page");
            document.body.classList.remove("sidebar-collapse");
        };
    })

    return (
        <>
            <IndexNavbar />
            <div className="wrapper">
                <ProfilePageHeader />
            </div>
            {/* trocar o id para outro id="end" */}
            {/* <div id="sliderRegular"></div>
            <div id="sliderDouble"></div> */}
        </>

    )
}