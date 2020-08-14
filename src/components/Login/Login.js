import React  from 'react';
import './css/main.css'
import './css/util.css'
import bg from "./images/bg-01.jpg";
import icongoogle from './images/icons/icon-google.png';
import firebase, {googleAuthProvider} from  '../config/Firebase';
import {loginWithGoogle} from "../helpers/auth";
import Loader from '../Loader/Loader';
import { Redirect } from 'react-router-dom';


const firebaseAuthKey = "firebaseAuthInProgress";
const appTokenKey = "appToken";


export default class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loggedin: false,
            splashScreen: false,
            specialuser: false,
            loading: false,
            notAuthUser: false,
            user:{},
            authenticated: true
        };
      }



    signInWithGoogle = (e) =>{
      e.preventDefault();
      googleAuthProvider.addScope('profile');
      googleAuthProvider.addScope('email');
      firebase.auth().signInWithPopup(googleAuthProvider);
      firebase.auth().onAuthStateChanged((user)=>{
        this.setState({loading:true});
        let isFound = false;
          if(user){
            let ref = firebase.database().ref("/schools/missionsanjosehigh/special_users");
            ref.on("value", snapshot => {
            const googleusers = user.email;
            console.log(googleusers);
            isFound = snapshot.val().includes(googleusers);
            this.setState({user:user});
            if(user && isFound){
              this.setState({loading:false, notAuthUser: true});
              //console.log("User signed in: ", JSON.stringify(user));
              this.setState({ user });
              localStorage.removeItem(firebaseAuthKey);
              localStorage.setItem(appTokenKey, user.uid);
               this.props.history.push("/app/home");
            }else {
              this.setState({loading:false, notAuthUser: true});
            }
          })
          }
        })

           }


      render() {
        return (
            <div className="limiter">
                <div className="container-login100" style={{"background-color": "#164e3e"}}>
                { this.state.loading ? <Loader /> :
                   <div className="wrap-login100 p-l-110 p-r-110 p-t-62 p-b-33">
                     {this.state.notAuthUser ? <p className="authorized">User not Authorized</p> : null}
                          <span className="login100-form-title p-b-53">Sign In With</span>
                          <button onClick={this.signInWithGoogle} className="btn-google m-b-20 login100-form-btn"><img src={icongoogle} alt="GOOGLE" className="githubIcon" />Google</button>

                </div>
              }
                </div>

            </div>
        )
     }

   }
