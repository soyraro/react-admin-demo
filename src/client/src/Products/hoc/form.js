import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import ProductForm from '../components/form'
import { getProduct, addProduct, saveProduct } from '../actions'
import { fetchProviderList } from '../../Providers/actions'
import { fetchFamilyList } from '../../Commons/actions/families'
import { fetchGroupList } from '../../Commons/actions/groups'
import withFlashMessages from '../../FlashMessages/hoc/with-flash-messages'
import _ from 'lodash'

function mapForDropdownList(list, params) {

    // merge default with params
    const objectKeys = Object.assign({
        id: 'id',
        label: 'name',
        value: 'id'        
    }, params)

    return Object.values(list).map((item)=>{

        const data = {
            id: item[objectKeys.id],
            label: item[objectKeys.label],
            value: item[objectKeys.value]
        }

        if(typeof objectKeys.extra != 'undefined') {
            data[objectKeys.extra] = item[objectKeys.extra]; // arbitrary data
        }
            
        return data;
    })
}

const mapStateToProps = (store, ownProps) => {  
    
    // fetch providers and format data for dropdownlist
    let providers = store.providers;
    if (typeof providers.list != 'undefined' && providers.list.length) {
        providers = mapForDropdownList(providers.list, {label: 'legal_name'});
    }  

    // fetch families and format data for dropdownlist
    let families = store.families.list;
    if(families.length > 0) { 
        families = mapForDropdownList(families);
    }    
  
    // fetch groups and format data for dropdownlist
    let groups = store.families.groups;
    if(groups.length > 0) { 
        groups = mapForDropdownList(groups);
    }    
 
    return {
        data: store.products.selected,
        providers,
        families,
        groups
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getProduct: (id) => { return dispatch(getProduct(id)); },
        getFamilies: () => { return dispatch(fetchFamilyList()); },
        getGroups: (family_id) => { return dispatch(fetchGroupList(family_id)); },
        familySelected: (family) => { return dispatch(familySelected(family)); },
        getProviders: () => { return dispatch(fetchProviderList()); },
        onAddProduct: (data) => { dispatch(addProduct(data)) },
        onSaveProduct: (data) => { dispatch(saveProduct(data)) },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withFlashMessages(ProductForm))