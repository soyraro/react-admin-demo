import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

class Actions extends Component {

    static propTypes = {
        enterprise_id: PropTypes.number,
        interaction_id: PropTypes.number,
        onDelete: PropTypes.func.isRequired,
    }

    /**
     * ID will be provided on the fly by Table component iterator
     */
    static defaultProps = {
        enterprise_id: null,
        interaction_id: null
    };

    render() {
        return (
            <div className="actions">
                <Link type="button" className="btn btn-circle btn-icon-only btn-default green" 
                    to={"/empresas/"+this.props.enterprise_id+"/interacciones/" +this.props.interaction_id+ "/edicion"}>
                    <i className="fa fa-pencil"></i>
                </Link>
                <button type="button" className="btn btn-circle btn-icon-only btn-default red" onClick={()=>{this.props.onDelete(this.props.interaction_id)}}>
                    <i className="fa fa-remove"></i>
                </button>            
            </div>
        )
    }
}

export default Actions
