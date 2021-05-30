/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import firebase from 'firebase/app';
import { Container, Grid, Panel, Row, Col, Button, Icon, Alert } from 'rsuite';
import { auth, database } from '../misc/firebase';

// eslint-disable-next-line arrow-body-style
const SignIn = () => {
  const signInProvider = async provider => {
    try {
      // this additionaluserinfo ans user objects comes from the json object we get
      const { additionalUserInfo, user } = await auth.signInWithPopup(provider);

      if (additionalUserInfo.isNewUser) {
        database.ref(`profiles/${user.uid}`).set({
          name:user.displayName,
          createdAt:firebase.database.ServerValue.TIMESTAMP         // provides sanatized timestamp(stored in milliseconds)
        });
      }

      Alert.success('Signed In', 4000);
    } catch (err) {
      Alert.error(err.message, 4000);
    }
  };
  const onFacebookSignIn = () => {
    signInProvider(new firebase.auth.FacebookAuthProvider());
  };
  const onGoogleSignIn = () => {
    signInProvider(new firebase.auth.GoogleAuthProvider());
  };

  return (
    <Container>
      {/* mt-page from utility scss file it puts top margin as to make the component a little center */}
      <Grid className="mt-page">
        <Row>
          <Col xs={24} md={12} mdOffset={6}>
            <Panel>
              {/* //this classname is from utility scss file */}
              <div className="text-center">
                <h2>welcome to chat</h2>
                <p>progressive chat platform</p>
              </div>
              <div className="mt-3">
                <Button block color="blue" onClick={onFacebookSignIn}>
                  <Icon icon="facebook" />
                  Continue with Facebook
                </Button>
                <Button block color="green" onClick={onGoogleSignIn}>
                  <Icon icon="google" />
                  Continue with Google
                </Button>
              </div>
            </Panel>
          </Col>
        </Row>
      </Grid>
    </Container>
  );
};

export default SignIn;
