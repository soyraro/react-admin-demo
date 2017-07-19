import React from 'react'
import { connect } from 'react-redux'
import UsersPage from '../components'
import { fetchUserList, userListSuccess, addUser, saveUser, removeUser } from '../actions'
import withFlashMessages from '../../FlashMessages/hoc/with-flash-messages'

const mapStateToProps = (store, ownProps) => {  
    return {
        users: store.users.list
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchUserList: () => { return dispatch(fetchUserList()) },
        onAddUser: (data) => { return dispatch(addUser(data)) },
        onSaveUser: (data) => { return dispatch(saveUser(data)) },
        onRemoveUser: (id) => { return dispatch(removeUser(id)) },
        onUserListSuccess: (users) => { dispatch(userListSuccess(users)) }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withFlashMessages(UsersPage))

