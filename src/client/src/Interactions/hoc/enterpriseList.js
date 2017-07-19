import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import withFlashMessages from '../../FlashMessages/hoc/with-flash-messages'
import EnterpriseInteractionsPage from '../components/enterpriseList'
import { fetchEnterpriseInteractionList, interactionListSuccess, removeInteraction } from '../actions'
import { getEnterpriseContact } from '../../Contacts/actions'

const mapStateToProps = (store, ownProps) => { 
    return {
        interactions: store.interactions.list || [],
        contact: store.contacts.selected
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchEnterpriseInteractionList: (enterprise_id, contact_id) => { return dispatch(fetchEnterpriseInteractionList(enterprise_id, contact_id)); },
        onRemoveInteraction: (id) => { dispatch(removeInteraction(id)) },
        getContact: (enterprise_id, contact_id) => { dispatch(getEnterpriseContact(enterprise_id, contact_id)) },
        onInteractionListSuccess: (interactions) => { dispatch(interactionListSuccess(interactions)) }
    }
}

export const EnterpriseInteractions = connect(
    mapStateToProps,
    mapDispatchToProps
)(withFlashMessages(EnterpriseInteractionsPage))

