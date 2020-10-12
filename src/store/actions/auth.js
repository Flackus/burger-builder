import axios from 'axios';

import * as actionTypes from './actionTypes';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (authData) => {
    return {
        type: actionTypes.AUTH_START,
        authData
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error
    };
};

const AUTH_API_KEY = 'AIzaSyCXyVanDkgtBuJG5PvJZesNYnTOlp6_nZk';

export const auth = (email, password, isSignup) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email,
            password,
            returnSecureToken: true
        };
        let url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp`;
        if (!isSignup) {
            url = `https://identitytoolkit.googleapis.com/v1/accounts:verifyPassword`;
        }
        url += `?key=${AUTH_API_KEY}`;
        axios.post(url, authData, {headers: {}})
            .then(response => {
                dispatch(authSuccess(response.data));
            })
            .catch(error => {
                dispatch(authFail(error));
            });
    };
};
