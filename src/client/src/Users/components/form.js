import React, {Component} from 'react'
import PropTypes from 'prop-types'
import FlashMessages from '../../FlashMessages'
import _ from 'lodash'

class Form extends Component {

    static defaultProps = {
        password: '',
        password_confirmation: ''
    };

    static PropsType = {
        data: PropTypes.array,
        onSaveUser: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired
    }

    constructor(props = {}) {
        
        super(props)
        
        this.state = {...this.props.data, ...Form.defaultProps};

        // events
        this.handleInputChange = this.handleInputChange.bind(this);
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    /**
     * Form data received for edition
     * 
     * @param {obj} nextProps 
     */
    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.data)
    }

    /**
     * Handle form interactions
     * @param {*} event 
     */
    handleInputChange(event) {

        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    save() {
        const data = this.state;        
        this.props.onSaveUser(data);  
    }

    cancel() {
        this.props.onCancel();  
    }

    render() {
       
        return (

            <div className="portlet light bordered">
                <div className="portlet-title">
                    <div className="caption font-red-sunglo">
                        <i className="icon-settings font-red-sunglo"></i>
                        <span className="caption-subject bold uppercase">
                            { this.props.data.id ? ' Edición' : ' Alta usuario' }</span>
                    </div>                    
                </div>
                <div className="portlet-body form">

                    <div className="messages">
                        <FlashMessages target="form" />
                    </div>

                    <form role="form">
                        <div className="form-body">

                            <div className="form-group">
                                <label>Nombre completo</label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        name="fullname"
                                        className="form-control"
                                        placeholder="Nombre completo"
                                        onChange={this.handleInputChange}
                                        value={this.state.fullname}
                                        />
                                    <span className="input-group-addon">
                                        <i className="fa fa-user"></i>
                                    </span>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Nombre de usuario</label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        name="username"                                        
                                        onChange={this.handleInputChange}
                                        className="form-control"
                                        placeholder="Nombre de usuario"
                                        value={this.state.username}
                                        />
                                    <span className="input-group-addon">
                                        <i className="fa fa-user"></i>
                                    </span>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <div className="input-group right">   
                                    <input type="text" 
                                        className="form-control" 
                                        name="email"                                        
                                        onChange={this.handleInputChange}
                                        placeholder="Email"
                                        value={this.state.email}
                                        />
                                    <span className="input-group-addon">                                
                                        <i className="fa fa-envelope"></i>
                                    </span>
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label>Contraseña</label>
                                <div className="input-group">
                                    <input
                                        type="password"
                                        name="password"                                        
                                        onChange={this.handleInputChange}
                                        className="form-control"
                                        placeholder="Contraseña"
                                        value={this.state.password}
                                        />
                                    <span className="input-group-addon">
                                        <i className="fa fa-key"></i>
                                    </span>
                                </div>
                            </div>  

                            <div className="form-group">
                                <label>Confirmar Contraseña</label>
                                <div className="input-group">
                                    <input
                                        type="password"
                                        name="password_confirmation"                                        
                                        onChange={this.handleInputChange}
                                        className="form-control"
                                        placeholder="Contraseña"
                                        value={this.state.password_confirmation}
                                        />
                                    <span className="input-group-addon">
                                        <i className="fa fa-key"></i>
                                    </span>
                                </div>
                            </div>  

                            <input type="hidden" name="id" value={this.state.id} />                                            
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn blue" onClick={this.save}>Guardar</button>
                            <button type="button" className="btn default" onClick={this.cancel}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Form