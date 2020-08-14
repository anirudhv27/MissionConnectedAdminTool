import * as firebase from 'firebase';
//import firestore from 'firebase/firestore'
import "firebase/storage";

//const settings = {timestampsInSnapshots: true};




const config = {
  apiKey: process.env.REACT_APP_API_TOKEN,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDERID,
  appId: process.env.REACT_APP_APP_ID,
}


firebase.initializeApp(config);

firebase.firestore();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
googleAuthProvider.setCustomParameters({
  'prompt': 'select_account'
});

export const auth = firebase.auth;

export default firebase;
