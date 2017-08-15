import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import ReactQuill from 'react-quill'
import FlashMessages from '../../FlashMessages'

class Form extends Component {

    static propTypes = {
        data: PropTypes.object,
        countries: PropTypes.array.isRequired,
        provinces: PropTypes.array.isRequired,  
        handleCountryChange: PropTypes.func.isRequired,  
        handleInputChange: PropTypes.func.isRequired,  
        handleQuillChange: PropTypes.func.isRequired,  
        handleOptionChange: PropTypes.func.isRequired,  
        save: PropTypes.func.isRequired,  
        cancel: PropTypes.func.isRequired,  
    }

    constructor(props) {

        super(props);

        this.state = props.data;
      
        // events
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    componentWillReceiveProps(newProps) {
        this.setState(newProps.data);
    }

    save() {

        const data = {
            ...this.state,
            country: this.state.country.id,
            province: this.state.province.id
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
                                <i className="fa fa-circles font-red-sunglo"></i>
                                <span className="caption-subject bold uppercase">
                                   { this.props.data.id ? ' Edición' : ' Alta proveedores' }</span>
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
                                <div className="col-xs-12 col-sm-4">
                                    <div className="form-group">
                                        <label>Razón Social</label>
                                        <input type="text" 
                                            className="form-control" 
                                            placeholder="Razón Social"
                                            name="legal_name"
                                            value={data.legal_name}
                                            onChange={this.props.handleInputChange} />                                            
                                    </div>
                                </div>

                                <div className="col-xs-12 col-sm-3 col-md-2">
                                    <div className="form-group">
                                        <label>CUIT</label>
                                        <input type="text" 
                                            className="form-control" 
                                            placeholder="CUIT"
                                            name="cuit"
                                            value={data.cuit}
                                            onChange={this.props.handleInputChange} />
                                    </div>
                                </div>                                 
                            </div>

                            <div className="row">
                                <div className="col-xs-12 col-sm-3">
                                    <div className="form-group">
                                        <label>País</label>
                                        { this.props.countries.length > 0 && data.country &&
                                            <Select
                                                name="country"
                                                placeholder="Seleccione..."
                                                value={data.country.id}
                                                options={this.props.countries}
                                                onChange={obj=>{this.props.handleCountryChange(obj)}}
                                                />
                                        }                                  
                                    </div>
                                </div>

                                <div className="col-xs-12 col-sm-3">
                                    <div className="form-group">
                                        <label>Provincia</label>
                                        { this.props.provinces.length > 0 && data.province &&
                                            <Select
                                                name="province"
                                                placeholder="Seleccione..."
                                                noResultsText="Sin resultados"
                                                value={data.province.id}
                                                options={this.props.provinces}
                                                onChange={obj=>{this.props.handleOptionChange("province", obj)}}
                                                />
                                        }    
                                    </div>
                                </div>

                                <div className="col-xs-12 col-sm-3">
                                    <div className="form-group">
                                        <label>Localidad</label>
                                        <input type="text" 
                                            className="form-control" 
                                            placeholder="Localidad" 
                                            name="town"
                                            value={data.town}
                                            onChange={this.props.handleInputChange} />
                                    </div>
                                </div>

                            </div>

                             <div className="row">
                                <div className="col-xs-6 col-sm-1">
                                    <div className="form-group">
                                        <label>Código Postal</label>
                                        <input type="text" 
                                            className="form-control" 
                                            placeholder="Cód. Postal" 
                                            name="zipcode"
                                            value={data.zipcode}
                                            onChange={this.props.handleInputChange} />
                                    </div>
                                </div>

                                <div className="col-xs-12 col-sm-4">
                                    <div className="form-group">
                                        <label>Dirección</label>
                                        <input type="text" 
                                            className="form-control" 
                                            placeholder="Dirección" 
                                            name="address"
                                            value={data.address}
                                            onChange={this.props.handleInputChange} />
                                    </div>
                                </div>
                            </div>    

                            <div className="form-group">
                                <label>Teléfonos</label>
                                <input type="text" 
                                    className="form-control" 
                                    placeholder="Teléfonos"
                                    name="phone"
                                    value={data.phone}
                                    onChange={this.props.handleInputChange} />
                            </div>

                            <div className="row">
                                <div className="col-xs-12 col-sm-3">
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input type="text" 
                                            className="form-control" 
                                            placeholder="Email" 
                                            name="email"
                                            value={data.email}
                                            onChange={this.props.handleInputChange} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6">
                                    <div className="form-group">
                                        <label>Web</label>
                                        <input type="text" 
                                            className="form-control" 
                                            placeholder="Web" 
                                            name="web"
                                            value={data.web}
                                            onChange={this.props.handleInputChange} />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Observaciones</label>
                                <ReactQuill className="form-control" 
                                    name="observations"
                                    value={data.observations}
                                    onChange={value=>this.props.handleQuillChange("observations", value)} ></ReactQuill>
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