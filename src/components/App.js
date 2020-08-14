import React, { Component } from 'react';
import { Route, Redirect, BrowserRouter as Router, Switch } from 'react-router-dom';
import Header from './common/Header';
import Footer from './common/Footer';
import Home from './common/Home';
import Listpage from './clubs/Listpage';
import Createpage from './clubs/Create'
import Editpage from './clubs/Edit'
import  Login from './Login/Login';
import NotFoundPage from './Notfound/NotFoundPage';
import firebase from './config/Firebase';
import Specialuser from './common/Specialuser';
import createBrowserHistory from "history/createBrowserHistory";
import Loader from './Loader/Loader'
import PrivateRoute from './Privateroutes/PrivateRoute';



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      loading: true,
      user: ''
    };
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authenticated: true,
          loading: false,
          user: user
        });
      } else {
        this.setState({
          authenticated: false,
          loading: false,
        });
      }
    })
  }



  render() {
    return this.state.loading === true ? <Loader />  :  (
      <div>
          {window.location.pathname !== '/login' &&  window.location.pathname != '/404' && <Header />}
          <Switch>
          <Route exact path="/login" component={Login} />
           <PrivateRoute exact path="/" authenticated={this.state.authenticated} component={Home}/>
           <PrivateRoute exact path="/app/home" authenticated={this.state.authenticated} component={Home}/>
           <PrivateRoute exact path="/createpage" authenticated={this.state.authenticated} component={Createpage}/>
           <PrivateRoute exact path="/listpage" authenticated={this.state.authenticated} component={Listpage}/>
           <PrivateRoute exact path="/editpage/:id" authenticated={this.state.authenticated} component={Editpage}/>
           <Route path="/404" component={NotFoundPage} />
           <Redirect to="/404" />
           </Switch>
     <Footer />
  </div>
);
}
}

export default App;
