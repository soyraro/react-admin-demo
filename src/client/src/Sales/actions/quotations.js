import axios from 'axios'

// ------------------------------------
// Constants
// ------------------------------------
export const UPDATE_QUOTATION = 'UPDATE_QUOTATION'
export const ADD_PRODUCT_TO_QUOTATION = 'ADD_PRODUCT_TO_QUOTATION'
export const UPDATE_QUOTATION_PRODUCT = 'UPDATE_QUOTATION_PRODUCT'
export const REMOVE_PRODUCT_FROM_QUOTATION = 'REMOVE_PRODUCT_FROM_QUOTATION'
export const SHIPMENT_TYPE_LIST_SUCCESS = 'SHIPMENT_TYPE_LIST_SUCCESS'

// ------------------------------------
// Actions
// ------------------------------------

export function updateQuotation(data) {
 
    return {
        type: 'UPDATE_QUOTATION',
        payload: {
            data
        }
    }
}

export function addProduct(product) {
 
    product.id = product.product.id;

    return {
        type: 'ADD_PRODUCT_TO_QUOTATION',
        payload: {
            data: product
        }
    }
}

export function saveProduct(product) {
 
    return {
        type: 'UPDATE_QUOTATION_PRODUCT',
        payload: {
            data: product
        }
    }
}

export function removeProduct(id) {

    return (dispatch) => { 
        return new Promise( resolve => {
            dispatch({
                type: 'REMOVE_PRODUCT_FROM_QUOTATION',
                payload: {
                    id
                }
            });
            resolve();
        });
    }
}

export function fetchShipmentTypesList() {

    // fetch data from DB
    return (dispatch, getState) => { 
     
        if (shouldFetchShipmentTypes(getState())) {
            // Dispatch a thunk from thunk!
            return axios.get('/sales/shipment-types').then(response => { 
                dispatch(shipmentTypeListSuccess(response.data));
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
function shouldFetchShipmentTypes(state) {
    const shipments = state.shipment_types
    return (_.isEmpty(shipments)) ? true : false;
}

export function shipmentTypeListSuccess(list) {
    return {
        type: 'SHIPMENT_TYPE_LIST_SUCCESS',
        payload: {
            list
        }
    }
}
