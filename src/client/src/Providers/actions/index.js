import axios from 'axios'
import _ from 'lodash'

// ------------------------------------
// Constants
// ------------------------------------
export const PROVIDER_LIST_SUCCESS = 'PROVIDER_LIST_SUCCESS'
export const PROVIDER_SELECTED = 'PROVIDER_SELECTED'
export const PROVIDER_UNSELECTED = 'PROVIDER_UNSELECTED'
export const ADD_PROVIDER = 'ADD_PROVIDER'
export const SAVE_PROVIDER = 'SAVE_PROVIDER'
export const REMOVE_PROVIDER = 'REMOVE_PROVIDER'

// ------------------------------------
// Actions
// ------------------------------------
export function fetchProviderList(filters, force = false) {
  
    // fetch data from DB
    return (dispatch, getState) => { 
     
        if ( force || shouldFetchProviders(getState()) ) {
            // Dispatch a thunk from thunk!
            return axios.get('/providers', {
                params: filters
            }).then(response => { 
                dispatch(providerListSuccess(response.data.data));
            }).catch(function (err) {
                console.log(err);
            });
        } else {
            // Let the calling code know there's nothing to wait for.
            return Promise.resolve(); 
        }
    }
}

/**
 * Cache
 */
function shouldFetchProviders(state) {
    const providers = state.providers
    return (_.isEmpty(providers)) ? true : false;
}

export function getProvider(id) {

    // fetch data from DB
    return (dispatch) => { 
      
        return axios.get('/providers/'+id).then(response => { 
            dispatch(providerSelected(response.data.data));
        }).catch(function (err) {
            console.log(err);
        });
    }
}

export function providerListSuccess(list) {
    return {
        type: 'PROVIDER_LIST_SUCCESS',
        payload: {
            list
        }
    }
}

export function providerSelected(data) {
    return {
        type: 'PROVIDER_SELECTED',
        payload: {
            data
        }
    }
}

export function providerUnselected() {
    return {
        type: 'PROVIDER_UNSELECTED'
    }
}

export function addProvider(data) {
    return {
        type: 'ADD_PROVIDER',
        payload: {
            data
        }
    };
}

export function saveProvider(data) {
    return {
        type: 'SAVE_PROVIDER',
        payload: {
            data
        }
    };
}

export function removeProvider(id) {
    return {
        type: 'REMOVE_PROVIDER',
        payload: {
            id
        }
    };
}



