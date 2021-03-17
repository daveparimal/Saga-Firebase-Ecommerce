import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import { auth, handleUserProfile } from './firebase/utils';
import { setCurrentUser } from './redux/User/user.actions';

// hoc
import WithAuth from './hoc/withAuth';

// layouts
import MainLayout from './layouts/MainLayout';
import HomePageLayout from './layouts/HomePageLayout';
//pages
import HomePage from './pages/Homepage';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Recovery from './pages/Recovery';
import Dashboard from './pages/Dashboad';

import './default.scss';

const App = props => {

  const { setCurrentUser, currentUser } = props;

  // Setup an event listener to subscribe on auth object that will allow us to determine when user has signed in
  // componentwillunmount will be used to unsubscribe to avoid memory leaks

  useEffect(() => {

     const authListener = auth.onAuthStateChanged(async userAuth => {
      if (userAuth) {
        const userRef = await handleUserProfile(userAuth);
        // subscribe to onsnapshot to update the current state of the application
        userRef.onSnapshot(snapshot => {

          setCurrentUser({
            id: snapshot.id,
            ...snapshot.data()
          });
        })
      } else {
        setCurrentUser(userAuth);
      }
    });

    // this will work like componentwillUnMount
    return () => {
      // this will act as a function, because onAuthStateChanged will return a function that will help unsubscribe the listener
      authListener();
    };
  }, []);

  return (
    <div className="App">
      <Switch>
        <Route exact path="/" render={() => (
          <HomePageLayout>
            <HomePage />
          </HomePageLayout>
        )} />
        <Route path="/registration" render={() => (
          <MainLayout>
            <Registration />
          </MainLayout>
        )} />
        <Route path="/login" render={() => (
            <MainLayout>
              <Login />
            </MainLayout>
          )} />

        <Route path="/recovery" render={() => (
          <MainLayout>
            <Recovery />
          </MainLayout>
        )} />

        <Route path="/dashboard" render={() => (
          <WithAuth>
          <MainLayout>
            <Dashboard />
          </MainLayout>
          </WithAuth>
        )} />
      </Switch>
    </div>
  );
}

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser
})

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
