/*!

=========================================================
* Material Dashboard PRO React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { AuthProvider } from 'variables/auth';
import { FetchProvider } from 'variables/authFetch';
import AuthLayout from "layouts/Auth.js";
import RtlLayout from "layouts/RTL.js";
import AdminLayout from "layouts/Admin.js";
import LogOut from "layouts/LogOut.js";
import PrivateRoute from 'variables/PrivateRoute';
import "assets/scss/material-dashboard-pro-react.scss?v=1.9.0";
import { SnackbarProvider } from 'notistack';

const hist = createBrowserHistory();



ReactDOM.render(
  <AuthProvider>
    <FetchProvider>
      <SnackbarProvider>
        <Router history={hist}>
          <Switch>
            <PrivateRoute path="/rtl" component={RtlLayout} />
            <PrivateRoute path="/admin" component={AdminLayout} />
            <Route path="/auth" component={AuthLayout} />
            <Route path="/logout" component={LogOut} />
            <Redirect from="/" to="/admin/dashboard" />
          </Switch>
        </Router>
      </SnackbarProvider>
    </FetchProvider>
  </AuthProvider>,
  document.getElementById("root")
);
