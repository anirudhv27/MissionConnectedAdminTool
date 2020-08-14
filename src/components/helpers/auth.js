import {auth, googleAuthProvider} from "../config/Firebase";

export function loginWithGoogle() {
    return auth().signInWithRedirect(googleAuthProvider);
    //return authenticate(loginWithFirebase(googleProvider));
}

export function logout() {
    return auth().signOut();
}

