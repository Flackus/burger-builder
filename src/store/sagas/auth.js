import { put, delay } from 'redux-saga/effects';
import axios from 'axios';

import * as actions from '../actions';

export function* logoutSaga(action) {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    yield put(actions.logoutSucceed());
}

export function* checkAuthTimeoutSaga(action) {
    yield delay(action.expirationTimeMs);
    yield put(actions.logout());
}

// No worries -- this token has been revoked
const AUTH_API_KEY = 'AIzaSyCXyVanDkgtBuJG5PvJZesNYnTOlp6_nZk';

export function* authUserSaga(action) {
    yield put(actions.authStart());
    const authData = {
        email: action.email,
        password: action.password,
        returnSecureToken: true
    };
    let url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp`;
    if (!action.isSignup) {
        url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword`;
    }
    url += `?key=${AUTH_API_KEY}`;
    try {
        const response = yield axios.post(url, authData, {headers: {}});
        const expirationTime = new Date().getTime() + response.data.expiresIn * 1000;
        localStorage.setItem('token', response.data.idToken);
        localStorage.setItem('expirationDate', new Date(expirationTime));
        localStorage.setItem('userId', response.data.localId);
        yield put(actions.authSuccess(response.data.idToken, response.data.localId));
        yield put(actions.checkAuthTimeout(response.data.expiresIn * 1000));
    } catch (error) {
        yield put(actions.authFail(error.response.data.error));
    }
}

export function* authCheckState(action) {
    const token = localStorage.getItem('token');
    if (!token) {
        yield put(actions.logout());
    } else {
        const expirationDate = new Date(localStorage.getItem('expirationDate'));
        if (expirationDate <= new Date()) {
            yield put(actions.logout());
        } else {
            const userId = localStorage.getItem('userId');
            yield put(actions.authSuccess(token, userId));
            yield put(actions.checkAuthTimeout(expirationDate.getTime() - new Date().getTime()));
        }
    }
}
