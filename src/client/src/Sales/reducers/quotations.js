const skel = {
    products: [],
    shipment_types: []
}

function quotations (state = skel, action) {
  
    switch(action.type) {
        case 'SHIPMENT_TYPE_LIST_SUCCESS':
            return Object.assign({}, state, {
                shipment_types: action.payload.list
            });
        case 'UPDATE_QUOTATION': 
            return Object.assign({}, state, action.payload.data);
        case 'ADD_PRODUCT_TO_QUOTATION': 
            return Object.assign({}, state, {
                products: state.products.concat([Object.assign({}, action.payload.data)])
            });
        case 'UPDATE_QUOTATION_PRODUCT': 

            const updatedList = state.products.map(item => {
                if(item.product.id === action.payload.data.product.id) {
                    return { ...item, ...action.payload.data }
                }
                return item;
            }); 

            return Object.assign({}, state, {
                products: updatedList
            });
        case 'REMOVE_PRODUCT_FROM_QUOTATION': 
            return Object.assign({}, state, {
                products: state.products.filter(x=>x.id !== parseInt(action.payload.id))
            });   
        default:  
            return state
    }

}

export default quotations