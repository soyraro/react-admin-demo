import React, {Component} from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import ContactsList from '../components'
import { fetchContactsList, contactListSuccess, fetchContactStates, addContact, updateContactState, removeContact } from '../actions'
import { fetchEnterpriseList } from '../../Enterprises/actions'
import { fetchSectorList } from '../../Sectors/actions'
import withFlashMessages from '../../FlashMessages/hoc/with-flash-messages'

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
    
    let enterprises = store.enterprises.list || [];
    if (enterprises.length > 0) {
        enterprises = mapForDropdownList(enterprises, {label:'legal_name'});
    }  

    let sectors = store.sectors.list || [];
    if (sectors.length > 0) {
        sectors = mapForDropdownList(sectors);
    }  

    let states = store.contacts.states || [];
    if (states.length > 0) {
        states = mapForDropdownList(states, {value:'keyname'});
    }  

    return {
        contacts: store.contacts.list,
        enterprises,
        sectors,
        states
    }
}

const mapDispatchToProps = dispatch => { 
    return {
        fetchEnterpriseList: () => { return dispatch(fetchEnterpriseList()); },
        fetchSectorList: (enterprise_id = null) => { return dispatch(fetchSectorList(enterprise_id)); },
        fetchContactStates: () => { return dispatch(fetchContactStates()); },
        fetchEnterpriseContactList: (filters) => { return dispatch(fetchContactsList(filters)); },
        onAddContact: (data) => { dispatch(addContact(data)) },
        onChangeContactState: (enterprise_id, contact_id, data) => {return dispatch(updateContactState(enterprise_id, contact_id, data)) },
        onRemoveContact: (id) => { return dispatch(removeContact(id)) },
        onContactListSuccess: (list) => { dispatch(contactListSuccess(list)) }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withFlashMessages(ContactsList))