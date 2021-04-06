import { takeLatest, call, all, put } from "redux-saga/effects";
import userTypes from "./user.types";
import {
  signInSuccess,
  signOutUserSuccess,
  userError,
  resetPasswordSuccess,
} from "./user.actions";
import {
  auth,
  handleUserProfile,
  getCurrentUser,
  GoogleProvider,
} from "./../../firebase/utils";
import { handleResetPasswordAPI } from "./user.helpers";

export function* getSnapshotFromUserAuth(user, additionalData = {}) {
  try {
    const userRef = yield call(handleUserProfile, {
      userAuth: user,
      additionalData,
    });
    const snapshot = yield userRef.get();
    yield put(
      signInSuccess({
        id: snapshot.id,
        ...snapshot.data(),
      })
    );
  } catch (err) {
    console.log(err);
  }
}

export function* emailSignIn({ payload: { email, password } }) {
  try {
    //await auth.signInWithEmailAndPassword(email, password);
    const { user } = yield auth.signInWithEmailAndPassword(email, password);
    yield getSnapshotFromUserAuth(user);
    // dispatch({
    //     type: userTypes.SIGN_IN_SUCCESS,
    //     payload: true
    // })
  } catch (err) {
    console.log(err);
  }
}

export function* onEmailSignInStart() {
  // Take latest takes an action type and the name of generator function
  // that will handle this event when it is called and it does intercept
  // this action
  yield takeLatest(userTypes.EMAIL_SIGN_IN_START, emailSignIn);
}

export function* isUserAuthenticated() {
  try {
    const userAuth = yield getCurrentUser();
    if (!userAuth) return;

    yield getSnapshotFromUserAuth(userAuth);
  } catch (err) {
    console.log(err);
  }
}

export function* onCheckUserSession() {
  yield takeLatest(userTypes.CHECK_USER_SESSION, isUserAuthenticated);
}
export function* signOutUser() {
  try {
    yield auth.signOut();
    yield put(signOutUserSuccess());
  } catch (err) {
    console.log(err);
  }
}

export function* onSignOutUserStart() {
  yield takeLatest(userTypes.SIGN_OUT_USER_START, signOutUser);
}

export function* signUpUser({
  payload: { displayName, email, password, confirmPassword },
}) {
  // validate if password matches
  if (password !== confirmPassword) {
    const err = ["Passwords Don't match"];
    yield put(userError(err));
    return;
  }

  // Create a user name using auth on firestore with username and passowrd
  // The returned user profile is used to login and route to home page (handle from router)\
  // Once account is created the user is signed in automatically
  // We have added a listener in App.js on auth, so the app automatically understands that user has signed in

  try {
    const { user } = yield auth.createUserWithEmailAndPassword(email, password);
    const additionalData = { displayName };
    yield getSnapshotFromUserAuth(user, additionalData);
    // yield call(handleUserProfile, {
    //   userAuth: user,
    //   additionalData: { displayName },
    // });
  } catch (err) {
    console.log(err);
  }
}

export function* onSignUpUserStart() {
  yield takeLatest(userTypes.SIGN_UP_USER_START, signUpUser);
}

export function* resetpassword({ payload: { email } }) {
  // Link where to send after password reset
  try {
    yield call(handleResetPasswordAPI, email);
    yield put(resetPasswordSuccess());
  } catch (err) {
    yield put(userError(err));
  }
}

export function* onResetPasswordStart() {
  yield takeLatest(userTypes.RESET_PASSWORD_START, resetpassword);
}

export function* googleSignIn() {
  try {
    const { user } = yield auth.signInWithPopup(GoogleProvider);
    yield getSnapshotFromUserAuth(user);
  } catch (err) {
    console.log(err);
  }
}

export function* onGoogleSignInStart() {
  yield takeLatest(userTypes.GOOGLE_SIGN_IN_START, googleSignIn);
}

// Below is exported to provide this sagas to redux store
export default function* userSagas() {
  // Once onEmailSignInStart is called it will call the emailSignIn function
  yield all([
    call(onEmailSignInStart),
    call(onCheckUserSession),
    call(onSignOutUserStart),
    call(onSignUpUserStart),
    call(onResetPasswordStart),
    call(onGoogleSignInStart),
  ]);
}
