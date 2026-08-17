import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

// styles for this kit
import "./assets/css/bootstrap.min.css";
import "./assets/scss/now-ui-kit.scss";
import "./assets/demo/demo.css";
import "./assets/demo/nucleo-icons-page-styles.css";

// pages for this kit
import Index from "./views/Index.js";
import About from "./views/About.js";
import Catalog from "./views/Catalog.js";
import Search from "./views/Search";
import Read from "./views/Read";
import QRCode from "./views/QRCode";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Index} />
      <Route path='/leitura/:id' component={Read} />
      <Route path='/pesquisa/:word' component={Search} />
      <Route path='/qrcode/:id' component={QRCode} />
      <Route path="/catalogo" component={Catalog} />
      <Route path="/sobre" component={About} />
      <Redirect to="/" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
