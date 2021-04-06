// all and call are called effects
// all - allows us to resolve effects in parallel similar to promis.all
// call - allows us to call functions

import { all, call } from 'redux-saga/effects';
import userSagas from './User/user.sagas';

export default function* rootSaga() {
    yield all([call(userSagas)]);
}