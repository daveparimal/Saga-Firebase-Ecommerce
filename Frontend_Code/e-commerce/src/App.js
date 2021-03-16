import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import { auth, handleUserProfile } from './firebase/utils';
import { setCurrentUser } from './redux/User/user.actions'
// layouts
import MainLayout from './layouts/MainLayout';
import HomePageLayout from './layouts/HomePageLayout';
//pages
import HomePage from './pages/Homepage';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Recovery from './pages/Recovery';

import './default.scss';

class App extends Component {

  authListener = null; 

  // Setup an event listener to subscribe on auth object that will allow us to determine when user has signed in
  // componentwillunmount will be used to unsubscribe to avoid memory leaks

  componentDidMount() {

    const {setCurrentUser} = this.props;

    this.authListener = auth.onAuthStateChanged (async userAuth => {
      if(userAuth) {
        const userRef = await handleUserProfile(userAuth);
        // subscribe to onsnapshot to update the current state of the application
        userRef.onSnapshot( snapshot => {

          setCurrentUser({
            id: snapshot.id,
            ...snapshot.data()            
          });
        })
      } else {
        setCurrentUser(userAuth);
      }
      // if (!userAuth) {
      //   this.setState({
      //     ...initialState
      //   })
      // };
      
      // this.setState({
      //   currentUser: userAuth
      // })
    });
  }

  componentWillUnmount() {
    this.authListener()
  }


  render() {

    const { currentUser } = this.props;
     return (
      <div className="App">
          <Switch>
            <Route exact path="/"  render={() => (
              <HomePageLayout>
                <HomePage />
              </HomePageLayout>
            )}/>
            <Route path="/registration" render={() => currentUser ? <Redirect to="/"/> : (
              <MainLayout>
                <Registration />
              </MainLayout>
            )} />
            <Route path="/login" render={() => currentUser ? <Redirect to="/" /> : 
            (
              <MainLayout>
                <Login />
              </MainLayout>
            )} />

            <Route path="/recovery" render={() => (
              <MainLayout>
                <Recovery />
              </MainLayout>
            )} />
          </Switch>
      </div>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser
})

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
