/*eslint-disable*/
import React from "react";

// reactstrap components
import { Container } from "reactstrap";

function DefaultFooter() {
  return (
    <>
      <footer className="footer footer-default">
        <Container>
          <nav>
            <ul>
              <li>
                <a
                  href="/"
                >
                  Jardim Unificado
                </a>
              </li>
              <li>
                <a
                  href="#sobre"
                >
                  Sobre
                </a>
              </li>
              <li>
                <a
                  href="/admin"
                >
                  Á. Rest.
                </a>
              </li>
            </ul>
          </nav>
          <div className="copyright" id="copyright">
            © {new Date().getFullYear()},
            Layout by Creative Tim &amp; Invision<br /> Coded by <a href="https://vyk1.github.io">Victoria Botelho Martins</a>
          </div>
        </Container>
      </footer>
    </>
  );
}

export default DefaultFooter;
