import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

// styles for this kit
import './views/Admin/main/App.css'
import "./assets/css/bootstrap.min.css";
import "./assets/scss/now-ui-kit.scss";
import "./assets/demo/demo.css";
import "./assets/demo/nucleo-icons-page-styles.css";
// pages for this kit
import Index from "./views/Index.js";
import LoginPage from "./views/examples/LoginPage.js";
import Home from "./views/Admin/components/home/Home";
import QRCodeClass from "./views/Admin/components/qrcode/QRCode";
import AllPlants from "./views/Admin/components/plants/AllPlants";
import NewPlant from "./views/Admin/components/plants/NewPlant";
import Logout from "./views/Admin/components/logout/Logout";
import Search from "./views/Search";
import EditPlants from "./views/Admin/components/plants/EditPlant";
import Read from "./views/Read";
import { auth } from "./config";
import LoadingCog from "./views/LoadingCog";
import AllHabCresc from "./views/Admin/components/habCresc/AllHabCresc";
import AllMdTx from "./views/Admin/components/MdTx/AllMdTx";

class Starter extends React.Component {
  constructor(props) {
    super(props)
    this.state = { loaded: false }
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      this.setState({
        isAuthenticated: !!user,
        user,
        loaded: true
      })
    })
  }

  render() {
    const PrivateRoute = ({ component: Component, ...rest }) => (
      <Route
        {...rest}
        render={props =>
          this.state.isAuthenticated ? (
            <Component {...props} />
          ) : (
              <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
            )
        }
      />
    )

    if (!this.state.loaded) {
      return <LoadingCog />
    }

    return (
      <BrowserRouter>
        <Switch>
          {/* Loop aqui */}
          <PrivateRoute exact path='/admin' component={Home} />
          <PrivateRoute path='/admin/plantas' component={AllPlants} />
          <PrivateRoute path='/admin/nova-planta' component={NewPlant} />
          <PrivateRoute path='/admin/editar-planta/:id' component={EditPlants} />
          <PrivateRoute path='/admin/qrcode/:id' component={QRCodeClass} />
          <PrivateRoute path='/admin/logout' component={Logout} />

          <PrivateRoute path='/admin/habitos-crescimento' component={AllHabCresc} />
          <PrivateRoute path='/admin/md-tx' component={AllMdTx} />

          <Route path="/index" component={Index} />
          <Route path='/leitura/:id' component={Read} />
          <Route path='/pesquisa/:word' component={Search} />
          <Route path="/login" component={LoginPage} />
          <Redirect from="/" to="/index" />
          <Redirect to="/index" />
        </Switch>
      </BrowserRouter>
    )
  }
}

ReactDOM.render(<Starter />
  ,
  document.getElementById("root")
);
