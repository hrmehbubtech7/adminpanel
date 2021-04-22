import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from 'variables/auth';

const PrivateRoute = ({component: Component, ...rest}) => {
    const {isAuthenticated,loading,authState}=useContext(AuthContext);
    if (loading) {

        return (
          <Route
            {...rest}
            render={() => {
              return <p>Loading...</p>;
            }}
          />
        );
      }
    return (

        // Show the component only when the user is logged in
        // Otherwise, redirect the user to /signin page
        <Route {...rest} render={props => (
            isAuthenticated() ?
                <Component {...props} authInfo={authState.userInfo} />
            : <Redirect to={{
                pathname: "/auth/login-page",
                state: { referrer: props.location.pathname }
            }}/>
        )} />
    );
};

export default PrivateRoute;