import firebase  from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import {firebaseConfig} from './config';

//connect to database 
firebase.initializeApp(firebaseConfig);

// export 2 instances of auth and firestore(db) to use throughout application

export const auth = firebase.auth();
export const firestore = firebase.firestore();

// custom pprovider for facebook, google, etc.
const GoogleProvider = new firebase.auth.GoogleAuthProvider();
// set some parameters
GoogleProvider.setCustomParameters({propmpt: 'select_account'});

// utility function to call on for sign in with Google. signInWithPopup accepts above provider
export const signInWithGoogle = () => auth.signInWithPopup(GoogleProvider)

// code that pushes login data to database
export const handleUserProfile = async (userAuth, additionalData) => {
    // if user is null then return
    if(!userAuth) return;
    const { uid } = userAuth; 

    //if user exists, returns get the reference of firestore collection name users, document name uid
    // if we get a userRef that means that user exist in database, if it doesn't we need to create a log of this user logging in
    const userRef = firestore.doc(`users/${uid}`);
    const snapshot = await  userRef.get();
    // boolean value explaing this document exists in the collection 
    if(!snapshot.exists) {

        const {displayName, email } = userAuth;
        const timestamp = new Date();
        try {
            // if user does not exist add the document(row) to the collection (table).
            await userRef.set({
                displayName,
                email,
                createdDate: timestamp,
                ...additionalData
            });
        } catch (err) {
            console.log(err);
        }
    }
    return userRef;
}