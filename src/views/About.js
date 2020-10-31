import React from "react";

import FullNav from "./FullNav.js";
import DefaultFooter from "../components/Footers/DefaultFooter.js";

function About() {
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
          <h5 className="description text-dark mb-0 pb-0">
            Os mais antigos sabem a importância e a valorização do conhecimento passado de geração em geração e muitos estão familiarizados com as receitas caseiras e dos chás que nossos pais, avós e bisavós, mas o qual o fundamento para tais tratamentos? Quais são realmente comprovadamente funcionais e quais podem fazer mau a saúde? E quais podemos utilizar em animais? Esse é o objetivo desse projeto e deste site disponibilizar todas as informações acerca das plantas medicinais e tóxicas a população e dando uma maior valorização nas suas aplicabilidades.
            </h5>
          {/* <CarouselSection /> */}
        </div>
        <DefaultFooter />
      </div>
    </>
  );
}

export default About;
