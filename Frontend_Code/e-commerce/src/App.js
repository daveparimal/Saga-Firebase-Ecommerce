import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { auth, handleUserProfile } from './firebase/utils';

// layouts
import MainLayout from './layouts/MainLayout';
import HomePageLayout from './layouts/HomePageLayout';
//pages
import HomePage from './pages/Homepage';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Recovery from './pages/Recovery';

import './default.scss';

const initialState = {
  currentUser : null
}
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ...initialState
    }
  }

  authListener = null; 

  // Setup an event listener to subscribe on auth object that will allow us to determine when user has signed in
  // componentwillunmount will be used to unsubscribe to avoid memory leaks

  componentDidMount() {
    this.authListener = auth.onAuthStateChanged (async userAuth => {
      if(userAuth) {
        const userRef = await handleUserProfile(userAuth);
        // subscribe to onsnapshot to update the current state of the application
        userRef.onSnapshot( snapshot => {
          this.setState({
            currentUser: {
              id: snapshot.id,
              ...snapshot.data()
            }
          })
        })
      } else {
        this.setState({
          ...initialState
        })
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
    console.log("hello unmount")
    this.authListener()
  }


  render() {

    const { currentUser } = this.state;
     return (
      <div className="App">
          <Switch>
            <Route exact path="/"  render={() => (
              <HomePageLayout currentUser={currentUser}>
                <HomePage />
              </HomePageLayout>
            )}/>
            <Route path="/registration" render={() => currentUser ? <Redirect to="/"/> : (
              <MainLayout currentUser={currentUser}>
                <Registration />
              </MainLayout>
            )} />
            <Route path="/login" render={() => currentUser ? <Redirect to="/" /> : 
            (
              <MainLayout currentUser={currentUser}>
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

export default App;
