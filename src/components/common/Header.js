import React, { Component } from 'react';
import { Button, ButtonToolbar} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';



import firebase from '../config/Firebase';

const appTokenKey = "appToken"; // also duplicated in Login.js
class Header extends Component {

  constructor(props) {
    super(props)
    this.state = { 
    }
  }

  logOutUser = () => {
    firebase
    .auth()
    .signOut()
    .then(() => {
      //localStorage.removeItem("firebase:host:.icloudsigmaxm.firebaseapp.com");
      localStorage.removeItem(appTokenKey);
      
      this.props.history.push('/login');
    })
    .catch(function(error) {
    });
  }

  render(){
    return(
  <div>
    <div className="container">
      <h2> </h2>
      <ButtonToolbar>
        <Button bsStyle="info" href="/app/home">Home</Button>
        <Button bsStyle="info" href="/listpage">List</Button>
        <Button bsStyle="info" href="/createpage">Add</Button>
        <Button bsStyle="danger" style={{float: "right"}}onClick={this.logOutUser}>Signout</Button>
      </ButtonToolbar>
    </div>
    <hr/>
  </div>
);
    }
  }

export default withRouter(Header);
