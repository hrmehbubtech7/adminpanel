import React,{useState,useContext} from "react";


import {AuthContext} from 'variables/auth';

import { Redirect, useHistory } from "react-router-dom";

export default function LoginPage(props) {

  const {logout } = useContext(AuthContext);

  React.useEffect(() => {
    logout();

  });
  return (
    <Redirect to="/auth/login-page" />
  );
}
