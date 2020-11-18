/*eslint-disable*/
import React from "react";
import { Link } from "react-router-dom";
import image1 from '../../assets/sponsors/image1.png'

// reactstrap components
import { Container } from "reactstrap";

function DefaultFooter() {
  return (
    <footer className="footer footer-default">
      <Container>
        <nav>
          <ul>
            <li>
              <Link to="/">
                Jardim Unificado
                </Link>
            </li>
            <li>
              <Link to="/sobre">
                Sobre
                </Link>
            </li>
            <li>
              <Link to="/admin"
              >
                Á. Rest.
                </Link>
            </li>
            {/* <li>
              <Link href="https://ufsc.br" rel="noopener noreferrer" target="_blank">
                A<img className="w-25" src={image1} />
              </Link>
            </li> */}

          </ul>
        </nav>
        <div className="copyright" id="copyright">
          © {new Date().getFullYear()},
            Layout by Creative Tim &amp; Invision<br /> Coded by <a target="_blank" rel="noopener noreferrer" href="https://vyk1.github.io" >Victoria Botelho Martins</a>
        </div>
      </Container>
    </footer>
  );
}

export default DefaultFooter;
