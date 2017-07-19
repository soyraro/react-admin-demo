import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import EnterpriseForm from '../components/form'
import { addInteraction, saveInteraction, getInteraction, interactionUnselected } from '../actions'
import { fetchEnterpriseContactList } from '../../Contacts/actions'
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

const mapStateToProps = (store) => {  
   
    let contacts = store.contacts.list;
    if (contacts.length > 0) {
        contacts = mapForDropdownList(contacts, {label: 'fullname'});
    }  

    return {
        data: store.interactions.selected,
        contacts
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getInteraction: (enterprise_id, interaction_id) => { return dispatch(getInteraction(enterprise_id, interaction_id)); },
        unselectInteraction: () => { dispatch(interactionUnselected()) },
        getContacts: (contact_id) => { return dispatch(fetchEnterpriseContactList(contact_id)) },
        onAddInteraction: (contact_id, data) => { return dispatch(addInteraction(contact_id, data)) },
        onSaveInteraction: (contact_id, data) => { return dispatch(saveInteraction(contact_id, data)) },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withFlashMessages(EnterpriseForm))