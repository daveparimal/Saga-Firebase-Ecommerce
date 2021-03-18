import userTypes from './user.types';
import { auth, handleUserProfile, GoogleProvider } from './../../firebase/utils'

export const setCurrentUser = user => ({
    type: userTypes.SET_CURRENT_USER,
    payload: user
});

export const resetAllAuthForms = () => ({
    type:userTypes.RESET_AUTH_FORMS
})

// Here dispatch is an another function which is being called inside this async function
// To avoid this we use Redux thunk. Redux thunk is a middleware
export const signInUser = ({ email, password }) => async dispatch => {
    try {
        await auth.signInWithEmailAndPassword(email, password);
        dispatch({
            type: userTypes.SIGN_IN_SUCCESS,
            payload: true
        })
    } catch (err) {
        console.log(err);
    }
}

export const signUpUser = ({ displayName, email, password, confirmPassword }) => async dispatch => {

    // validate if password matches 
    if (password !== confirmPassword) {
        const err = ['Passwords Don\'t match'];
        // setErrors(err);
        dispatch({
            type: userTypes.SIGN_UP_ERROR,
            payload: err
        })
        return;
    }

    // Create a user name using auth on firestore with username and passowrd
    // The returned user profile is used to login and route to home page (handle from router)\
    // Once account is created the user is signed in automatically
    // We have added a listener in App.js on auth, so the app automatically understands that user has signed in

    try {
        const { user } = await auth.createUserWithEmailAndPassword(email, password);
        await handleUserProfile(user, { displayName });
        dispatch({
            type: userTypes.SIGN_UP_SUCCESS,
            payload: true
        })

    } catch (err) {
        console.log(err);
    }
}

export const resetPassword = ({ email }) => async dispatch => {
    // Link where to send after password reset
    const config = {
        url: 'http://localhost:3000/login'
    }

    try {
        // reset password email API
        await auth.sendPasswordResetEmail(email, config)
            .then(() => {
                dispatch({
                    type: userTypes.RESET_PASSWORD_SUCCESS,
                    payload: true
                })

            }).catch(() => {
                const err = ["Email not found. Please try again"];

                dispatch({
                    type: userTypes.RESET_PASSWORD_ERROR,
                    payload: err
                })
            })
    } catch (err) {
        console.log(err)
    }
}

export const signInWithGoogle = () => async dispatch => {
    try {
        await auth.signInWithPopup(GoogleProvider)
            .then(() => {
                dispatch({
                    type: userTypes.SIGN_IN_SUCCESS,
                    payload: true
                })
            })
    } catch (err) {
        console.log(err)
    }
}