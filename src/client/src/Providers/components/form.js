import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import FlashMessages from '../../FlashMessages'
import ReactQuill from 'react-quill'
import Select from 'react-select'

class Form extends Component {

    static defaultProps = {
        data: {
            country: {},
            province: {}
        }
    };

    static propTypes = {
        data: PropTypes.object,
        countries: PropTypes.array.isRequired,
        provinces: PropTypes.array.isRequired,
        getProvider: PropTypes.func.isRequired,
        getCountries: PropTypes.func.isRequired,
        getProvinces: PropTypes.func.isRequired,
        onSaveProvider: PropTypes.func.isRequired,
        unselectProvider: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
    }

    constructor(props) {

        super(props);

        this.state = Object.assign({}, props, {
            isEdition: props.match.params.id ? true : false     
        });

        // events
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleQuillChange = this.handleQuillChange.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    /**
     * Get data
     */
    componentDidMount() {

        const self = this;

        // fetch data under edition
        if(this.state.isEdition) {
            this.props.getProvider(this.props.match.params.id).then(_=>{
                this.fetchData();
            });
        } else {
            this.fetchData();
        }   
    }

    fetchData() {

        const self = this;

        // fetch country/provinces list
        this.props.getCountries().then(()=> {
            // set predefined country
            const country = (self.state.isEdition) ? self.state.data.country : self.props.countries[1];
            self.handleCountryChange(country, self.state.data.province);
        });
    }

    /**
     * Form data received for edition
     * 
     * @param {obj} nextProps 
     */
    componentWillReceiveProps(nextProps) {

        let newState = {
            data: nextProps.data,
            countries: nextProps.countries,
            provinces: nextProps.provinces
        };  

        this.setState(newState);
    }

    handleCountryChange(country, province = null) {
      
        const self = this;

        this.props.getProvinces(country.id).then(_=> {

            // set predefined province
            const province = province ? province : this.props.provinces[1]; 
           
            self.setState({ data: Object.assign(this.state.data, {
                country,
                province
            }) });
        })
    }

    /**
     * Handle form interactions
     * @param {*} event 
     */
    handleInputChange(event) {

        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        const data = Object.assign({}, this.state.data, {
            [name]: value
        })

        this.setState({ data });
    }

    /**
     * Handle Quill wysiwyg
     * @param {*} event 
     */
    handleQuillChange(field, value) {

        const data = Object.assign({}, this.state.data, {
            [field]: value
        })

        this.setState({ data });
    }

    /**
     * Handle dropdowns changes 
     * @param {*} field name
     * @param {*} value 
     */
    handleOptionChange(field, value) {

        const data = Object.assign({}, this.state.data, {
            [field]: value
        })

        this.setState({ data });
    }

    save() {
        const data = this.state;        
        this.props.onSaveProvider(data);  
    }

    cancel() {
        this.props.unselectProvider();  
    }   

    render() {
        
        const { history } = this.props

        return (

            <div className="portlet light bordered">
                <div className="portlet-title">

                    <div className="messages">
                        <FlashMessages />
                    </div>

                    <div className="row">
                        <div className="col-xs-12 col-sm-6">
                            <div className="caption font-red-sunglo">
                                <i className="icon-settings font-red-sunglo"></i>
                                <span className="caption-subject bold uppercase">
                                    { this.props.data.id ? ' Edición' : ' Alta proveedor' }</span>
                            </div>     
                        </div>

                        <div className="col-xs-12 col-sm-6">
                            <button className="btn green pull-right" onClick={()=>{history.goBack()}} >
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
                                        <div className="input-group full-width">                                   
                                            <input type="text" 
                                                className="form-control" 
                                                placeholder="Razón Social"
                                                name="legal_name"
                                                value={this.state.data.legal_name}
                                                onChange={this.handleInputChange} />                                            
                                        </div>
                                    </div>
                                </div>

                                <div className="col-xs-12 col-sm-3 col-md-2">
                                    <div className="form-group">
                                        <label>CUIT</label>
                                        <div className="input-group">                                   
                                            <input type="text" 
                                                className="form-control" 
                                                placeholder="CUIT"
                                                name="cuit"
                                                value={this.state.data.cuit}
                                                onChange={this.handleInputChange}  />
                                        </div>
                                    </div>
                                </div>                                
                            </div>

                            <div className="row">
                                <div className="col-xs-6 col-sm-3">
                                    <div className="form-group">
                                        <label>País</label>
                                        { this.props.countries.length > 0 && this.state.data.country &&
                                            <Select
                                                name="country"
                                                placeholder="Seleccione..."
                                                value={this.state.data.country.id}
                                                options={this.props.countries}
                                                onChange={obj=>{this.handleCountryChange(obj)}}
                                                />
                                        }                                  
                                    </div>
                                </div>

                                <div className="col-xs-6 col-sm-3">
                                    <div className="form-group">
                                        <label>Provincia</label>
                                        { this.props.provinces.length > 0 && this.state.data.province &&
                                            <Select
                                                name="province"
                                                placeholder="Seleccione..."
                                                noResultsText="Sin resultados"
                                                value={this.state.data.province.id}
                                                options={this.props.provinces}
                                                onChange={obj=>{this.handleOptionChange("province", obj)}}
                                                />
                                        }
                                    </div>
                                </div>

                                <div className="col-xs-6 col-sm-3">
                                    <div className="input-group  full-width">
                                        <label>Localidad</label>
                                        <input type="text" 
                                            className="form-control" 
                                            placeholder="Localidad" 
                                            name="town"
                                            value={this.state.data.town}
                                            onChange={this.handleInputChange} />
                                    </div>
                                </div>

                                <div className="col-xs-6 col-sm-1">
                                    <div className="input-group">
                                        <label>Código Postal</label>
                                        <input type="text" 
                                            className="form-control" 
                                            placeholder="Código Postal" 
                                            name="zipcode"
                                            value={this.state.data.zipcode}
                                            onChange={this.handleInputChange} />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Teléfonos</label>
                                <input type="text" 
                                    className="form-control" 
                                    placeholder="Teléfonos"
                                    name="phone"
                                    value={this.state.data.phone}
                                    onChange={this.handleInputChange} />
                            </div>

                            <div className="form-group">
                                <label>Observaciones</label>
                                <ReactQuill className="form-control" 
                                    name="observations"
                                    value={this.state.data.observations}
                                    onChange={value=>this.handleQuillChange("observations", value)} ></ReactQuill>
                            </div>       
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