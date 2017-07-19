import axios from 'axios'

// ------------------------------------
// Constants
// ------------------------------------
export const USER_LIST_SUCCESS = 'USER_LIST_SUCCESS'
export const ADD_USER = 'ADD_USER'
export const SAVE_USER = 'SAVE_USER'
export const REMOVE_USER = 'REMOVE_USER'

// ------------------------------------
// Actions
// ------------------------------------
export function fetchUserList() {

    // fetch data from DB
    return (dispatch) => { 
      
        return axios.get('/users').then(response => { 
            dispatch(userListSuccess(response.data.data));         
        }).catch(function (err) {
            console.log(err);
        });
    }
}

export function userListSuccess(data) {
    return {
        type: 'USER_LIST_SUCCESS',
        payload: {
            data
        }
    }
}

export function addUser(data) {
   
    return (dispatch) => {
        
        return axios.post('/users', data).then(response => {
            dispatch({
                type: 'ADD_USER',
                payload: {
                    data
                }
            });
        })
    }
}

export function saveUser(data) {

    return (dispatch) => {

        return axios.put('/users/'+data.id, data).then(response => {
            dispatch({
                type: 'SAVE_USER',
                payload: {
                    data
                }
            });
        })
    }
}

export function removeUser(id) {

    return (dispatch) => {

        return axios.delete('/users/'+id).then(response => {
            dispatch({
                type: 'REMOVE_USER',
                payload: {
                    id
                }
            });
        })
    }  
}



