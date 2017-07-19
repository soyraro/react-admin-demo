
function providers (state = {}, action) {

    switch (action.type) {  
        case 'PROVIDER_LIST_SUCCESS':   
            return Object.assign({}, state, {
                list: action.payload.list
            });  
        case 'PROVIDER_SELECTED':
            return Object.assign({}, state, {
                selected: action.payload.data
            }); 
        case 'PROVIDER_UNSELECTED':
            return Object.assign({}, state, {
                selected: {}
            }); 
        case 'ADD_PROVIDER':
            return Object.assign({}, state, {
                list: state.list.concat([action.payload.data])
            });
        case 'SAVE_PROVIDER':

            // replace item in list
            const updatedList = state.list.map(item => {

                if(item.id === action.payload.data.id){
                    return { ...item, ...action.payload.data }
                }
                return item
            })

            return Object.assign({}, state, {
                list: updatedList
            });
        case 'REMOVE_PROVIDER':
            return Object.assign({}, state, {
                list: state.list.filter( (item) => { return item.id !== action.payload.id } )
            });  
        default:
            return state
    }
}

export default providers 