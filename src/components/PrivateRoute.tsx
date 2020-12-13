import React from "react";
import { Route, Redirect } from "react-router";

function PrivateRoute({ children, ...rest }: any) {
  const token = localStorage.getItem('myToken');
  return (
    <Route {...rest} render={() => {
      return token
        ? children
        : <Redirect to='/' />
    }} />
  )
}

export default PrivateRoute;