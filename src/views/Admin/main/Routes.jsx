import React from 'react'
import { Switch, Route, Redirect } from 'react-router'
import './App.css'

import { isAuthenticated } from '../components/auth'

import Home from '../components/home/Home'
import AllPlants from "../components/plants/AllPlants";
// import EditPlant from "../components/plants/EditPlant";
import NewPlant from "../components/plants/NewPlant";
import Login from '../components/login/Login'
import Logout from '../components/logout/Logout'

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            isAuthenticated() ? (
                <Component {...props} />
            ) : (
                    <Redirect to={{ pathname: '/sign-in', state: { from: props.location } }} />
                )
        }
    />
);

export default props =>
    <Switch>
        <Route path='/sign-in' component={Login} />
        <PrivateRoute exact path='/admin' component={Home} />
        <PrivateRoute path='/admin/plantas' component={AllPlants} />
        <PrivateRoute path='/admin/nova-planta' component={NewPlant} />
        {/* <PrivateRoute path='/admin/editar-planta' component={EditPlant} /> */}
        <PrivateRoute path='/admin/logout' component={Logout} />
    </Switch>