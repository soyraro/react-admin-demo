import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import _ from 'lodash'
import FlashMessages from '../../FlashMessages'

class Form extends Component {

    static propTypes = {
        data: PropTypes.object.isRequired,
        isEdition: PropTypes.bool,
        enterprises: PropTypes.array.isRequired,
        sectors: PropTypes.array.isRequired,  
        contact_states: PropTypes.array.isRequired,  
        save: PropTypes.func.isRequired,  
        cancel: PropTypes.func.isRequired,  
    }

    /**
     * Pre-declaring nested fields
     */
    static defaultProps = {
        data: { 
            emails: [
                {},
                {},
                {}
            ]
        }
    }

    constructor(props) {

        super(props);
        
        this.state = {
            ...props.data,
            ...Form.defaultProps.data
        }
        // events
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    componentWillReceiveProps(newProps) {
      
        let newState = {
            isEdition: newProps.data.id ? true : false,
            emails: Object.assign([], Form.defaultProps.data.emails, newProps.data.emails)
        }
    
        // under edition, we only display enterprise name, because it's immutable.
        if(newState.isEdition && newProps.enterprises.length > 0) {
            newState.enterprise_name = newProps.data.enterprise.legal_name;
        }
       
        this.setState({
            ...newProps.data,
            ...newState
        });
    }

    /**
     * Handle form interactions
     * @param {*} event 
     */
    handleInputChange(event) {
      
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    /**
     * Handle form nested values
     * @param {*} event 
     */
    handleEmailChange(key, event) {

        const value = event.target.value;
      
        const emails = this.state.emails;
        emails[key].email = value;

        this.setState({
            emails
        });
    }

    /**
     * Handle dropdowns & radio buttons 
     * @param {*} field name
     * @param {*} value 
     */
    handleOptionChange (field, value) {

        this.setState({
            [field]: value
        });
    }

    save() {

        // emails from props (defaults to empty object on )
        let emails = this.props.data.emails ? this.props.data.emails : this.state.emails;

        const data = {
            ...this.state,
            enterprise: this.state.enterprise.id,
            sector: this.state.sector.id,
            contact_state: this.state.contact_state.id,
            emails: emails.filter(x=>{ return (x.id || x.email) })
        };       

        this.props.save(data);
    }

    cancel() {
        this.props.cancel();  
    }

    render() {

        const data = this.state;
       
        return (

            <div className="portlet light bordered">

                <div className="messages">
                    <FlashMessages />
                </div>

                <div className="portlet-title">
                    <div className="row">

                        <div className="col-xs-12 col-sm-6">
                            <div className="caption font-red-sunglo">
                                <i className="icon-settings font-red-sunglo"></i>
                                <span className="caption-subject bold uppercase">
                                    
                                   { this.state.isEdition ? ' Edición' : ' Nuevo contacto' }</span>
                            </div>     
                        </div>

                        <div className="col-xs-12 col-sm-6">
                            <button className="btn green pull-right" onClick={this.cancel} >
                                <i className="fa fa-arrow-left" /> Volver
                            </button>
                        </div>
                    </div>
                </div>
                <div className="portlet-body form">
                    <form className="" role="form">

                        <div className="form-body">

                            <div className="row">

                                <div className="col-xs-12 col-sm-5 col-md-4">
                                    <div className="form-group">
                                        <label>Nombre</label>
                                        <input type="text" 
                                            className="form-control" 
                                            placeholder="Nombre"
                                            name="fullname"
                                            value={data.fullname}
                                            onChange={this.handleInputChange} />                                            
                                    </div>
                                </div>

                                <div className="col-xs-12 col-sm-4 col-md-4">
                                    <div className="form-group">
                                        <label>Cargo</label>
                                        <input type="text" 
                                            className="form-control" 
                                            placeholder="Cargo"
                                            name="position"
                                            value={data.position}
                                            onChange={this.handleInputChange} />
                                    </div>
                                </div>       
                                
                                <div className="col-xs-12 col-sm-3 col-md-2">
                                    <div className="form-group">
                                        <label>Estado</label>
                                        { this.props.contact_states.length > 0 && data.contact_state &&
                                            <Select
                                                placeholder="Seleccione..."
                                                name="contact_state"
                                                value={data.contact_state.id}
                                                options={this.props.contact_states}
                                                clearable={false}
                                                onChange={obj=>{this.handleOptionChange("contact_state", obj)}}
                                                />
                                        }    
                                    </div>
                                </div>                         
                            </div>

                            <div className="row">

                                <div className="col-xs-12 col-sm-6 col-md-3">
                                    <div className="form-group">
                                        <label>Empresa</label>
                                        { this.props.enterprises.length > 0 && data.enterprise &&
                                            <Select
                                                name="enterprise"
                                                placeholder="Seleccione..."
                                                value={data.enterprise.id}
                                                options={this.props.enterprises}
                                                clearable={false}
                                                disabled={this.state.isEdition}
                                                onChange={obj=>{this.props.handleEnterpriseChange(obj)}}
                                                />
                                        } 
                                    </div>
                                </div>

                                <div className="col-xs-12 col-sm-6 col-md-3">
                                    <div className="form-group">
                                        <label>Sector</label>
                                        { this.props.sectors.length > 0 && data.sector &&
                                            <Select
                                                name="sector"
                                                placeholder="Seleccione..."
                                                noResultsText="Sin resultados"
                                                value={data.sector.id}
                                                options={this.props.sectors}
                                                onChange={obj=>{this.handleOptionChange("sector", obj)}}
                                                />
                                        }    
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-xs-12 col-sm-7 col-md-8">
                                    <div className="form-group">
                                        <label>Teléfonos</label>
                                        <input type="text" 
                                            className="form-control" 
                                            placeholder="Teléfonos"
                                            name="phones"
                                            value={data.phones}
                                            onChange={this.handleInputChange} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-5 col-md-4">
                                    <div className="form-group">
                                        <label>Celular</label>
                                        <input type="text" 
                                            className="form-control" 
                                            placeholder="Celular"
                                            name="cellphone"
                                            value={data.cellphone}
                                            onChange={this.handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="row">
                                <div className="col-xs-12 col-sm-4">
                                    <div className="form-group">
                                        <label>Emails</label>
                                        <input type="text" 
                                            className="form-control" 
                                            placeholder="Email"
                                            name="emails[0]"
                                            value={data.emails[0].email}
                                            onChange={e=>this.handleEmailChange(0, e)} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-4">
                                        <div className="form-group">
                                        <label></label>
                                        <input type="text" 
                                            className="form-control" 
                                            placeholder="Email alternativo"
                                            name="emails[1]"
                                            value={data.emails[1].email}
                                            onChange={e=>this.handleEmailChange(1, e)} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-4">
                                        <div className="form-group">
                                        <label></label>
                                        <input type="text" 
                                            className="form-control" 
                                            placeholder="Email alternativo 2"
                                            name="emails[2]"
                                            value={data.emails[2].email}
                                            onChange={e=>this.handleEmailChange(2, e)} />
                                    </div>
                                </div>
                            </div>  

                            <input type="hidden" name="id" value={this.props.data.id} />                         
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