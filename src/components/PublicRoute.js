/* eslint-disable arrow-body-style */
import React from 'react';
import { Redirect, Route } from 'react-router';
import { Container, Loader } from 'rsuite';
import { useProfile } from '../context/profile.context';

const PublicRoute = ({ children, ...routeProps }) => {
  const {isLoading,profile} = useProfile(); // we are getting two values here therefore we are distructuring the profile and isloading
  if(isLoading && !profile){
    return <Container>
      <Loader center vertical size="md" content="Loading" speed="slow" />
    </Container>
  }

  if (profile && !isLoading) {
    return <Redirect to="/" />;
  }
  return <Route {...routeProps}>{children}</Route>;
};

export default PublicRoute;
