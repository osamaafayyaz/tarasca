
import React from 'react';
import {Route, Redirect} from 'react-router-dom';


export const fakeAuth = {
    isAuthenticated: false,
    authenticate() {
      this.isAuthenticated = true;
      //setTimeout(cb, 100); // fake async
    },
    signout() {
      this.isAuthenticated = false;
      //setTimeout(cb, 100);
    }
  };
  
  
export const PrivateRoute = ({ component: Component, props: myprops, ...rest }) => {
  return(
    <Route
      {...rest}
      render={(props) => fakeAuth.isAuthenticated ? (
          <Component {...props} {...myprops}/>
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}