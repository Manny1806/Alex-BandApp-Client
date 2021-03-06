import { API_BASE_URL } from '../config';
import {SubmissionError} from 'redux-form';
import {normalizeResponseErrors} from './utils';

export const BAND_REQUEST = 'BAND_REQUEST'
export const fetchBandRequest = () =>({
    type: BAND_REQUEST
})

export const BAND_SUCCESS = 'BAND_SUCCESS'
export const fetchBandSuccess = (band) =>({
    type: BAND_SUCCESS,
    band
})

export const ALL_BANDS_REQUEST = 'ALL_BANDS_REQUEST'
export const fetchAllBandsRequest = () =>({
    type: ALL_BANDS_REQUEST
})

export const ALL_BANDS_SUCCESS = 'ALL_BANDS_SUCCESS'
export const fetchAllBandsSuccess = (allBands) =>({
    type: ALL_BANDS_SUCCESS,
    allBands
})

export const BAND_ERROR = 'BAND_ERROR'
export const fetchBandError = (error) =>({
    type: BAND_ERROR,
    error
})

export const fetchAllBands = () => dispatch =>{
    dispatch(fetchAllBandsRequest())
    fetch(`${API_BASE_URL}/bands`)
    .then(res => !res.ok ? Promise.reject(res.statusText) : res.json())
    .then(res => dispatch(fetchAllBandsSuccess(res)))
    .catch(err => dispatch(fetchBandError(err)))
}

export const fetchBand = (name) => dispatch =>{
    dispatch(fetchBandRequest())
    fetch(`${API_BASE_URL}/bands/${name}`)
    .then(res => !res.ok ? Promise.reject(res.statusText) : res.json())
    .then(res => dispatch(fetchBandSuccess(res)))
    .catch(err => dispatch(fetchBandError(err)))
}

export const registerBand = band => dispatch => {
    let newBand;
    
    return fetch(`${API_BASE_URL}/bands`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(band)
    })
        .then(res => normalizeResponseErrors(res))
        .then(res => res.json())
        .then(res => { newBand = res
            return dispatch(fetchAllBands())})
        .then(res => newBand)
        .catch(err => {
            const {reason, message, location} = err;
            if (reason === 'ValidationError') {
                // Convert ValidationErrors into SubmissionErrors for Redux Form
                return Promise.reject(
                    new SubmissionError({
                        [location]: message
                    })
                );
            }
        });
};