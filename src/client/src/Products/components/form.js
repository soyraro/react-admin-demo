import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import FlashMessages from '../../FlashMessages'
import Select from 'react-select'
import _ from 'lodash'

class Form extends Component {

    static defaultProps = {
        data: {
            provider: {},
            family: {},
            group: {}
        }
    };

    static PropsType = {
        data: PropTypes.array,
        providers: PropTypes.array.isRequired,
        families: PropTypes.array.isRequired,
        groups: PropTypes.array.isRequired,
        getProduct: PropTypes.func.isRequired,
        getProviders: PropTypes.func.isRequired,
        getFamilies: PropTypes.func.isRequired,
        getGroups: PropTypes.func.isRequired,
        onSaveProduct: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,        
        history: PropTypes.object.isRequired
    }

    constructor(props = {}) {

        super(props)

        this.state = Object.assign({}, props, {
            isEdition: props.match.params.id ? true : false     
        });

        // events
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    /**
     * Get data
     */
    componentDidMount() {

        // fetch data under edition
        if(this.state.isEdition) {
            this.props.getProduct(this.props.match.params.id).then(_=>{
                this.fetchData();
            });
        } else {
            this.fetchData();
        }  
    }

    fetchData() {

        const self = this;

        // fulfill dropdowns
        this.props.getProviders().then(_=>{ 
            // apply predefined item
            const provider = (self.state.isEdition && self.state.data) ? self.state.data.provider : self.props.providers[1];
            self.setState({ data: Object.assign(self.state.data, { provider })});
        });     

        this.props.getFamilies().then(()=>{ 
            // apply predefined item
            const family = (self.state.isEdition && self.state.data) ? self.state.data.family : self.props.families[1];
            self.handleFamilyChange(family, self.state.data.group);
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
            providers: nextProps.providers,
            families: nextProps.families,
            groups: nextProps.groups
        };       

        this.setState(newState);
    }

    /**
     * Handle form interactions
     * @param {*} event 
     */
    handleInputChange(event) {

        const target = event.target;
        const value = target.value;
        const name = target.name;

        const data = Object.assign({}, this.state.data, {
            [name]: value
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

    handleFamilyChange(family, group = this.props.groups[1]) {

        const self = this;
        this.props.getGroups(family.id).then(_=> {

            // set predefined group
            self.setState({ data: Object.assign(this.state.data, {
                family,
                group
            }) });
        })
    }

    save() {
        const data = this.state.data;        
        this.props.onSaveProduct(data);  
    }

    cancel() {
        this.props.unselectProduct();  
    }

    render() {
     
        return (

            <div className="portlet light bordered">
                <div className="portlet-title">
                    <div className="row">
                        <div className="col-xs-12 col-sm-6">
                            <div className="caption font-red-sunglo">
                                <span className="icon-settings font-red-sunglo"></span>
                                <span className="caption-subject bold uppercase">
                                    { this.props.data.id ? ' Edición' : ' Alta producto' }</span>
                            </div>     
                        </div>

                        <div className="col-xs-12 col-sm-6">
                            <Link to='/productos' className="btn green pull-right">
                                <span className="fa fa-arrow-left" /> Volver
                            </Link>
                        </div>
                    </div>                
                </div>
                <div className="portlet-body form">
                    <form role="form">
                        <div className="form-body">
                            <div className="messages">
                                <FlashMessages />
                            </div>
                            <div className="row">
                                <div className="col-xs-12 col-sm-2">
                                    <div className="form-group">
                                        <label>Tipo</label>
                                        <select className="form-control" name="type">
                                            <option value="producto">Producto</option>
                                            <option value="repuesto">Repuesto</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-xs-12 col-md-2">
                                    <div className="form-group">
                                        <label htmlFor="code">Código</label>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                name="code"     
                                                className="form-control"
                                                placeholder="Código"
                                                value={this.state.data.code}
                                                />
                                            <span className="input-group-addon">
                                                <span className="icon-tag"></span>
                                            </span>
                                        </div>
                                    </div>             
                                </div>
                                <div className="col-xs-12 col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="name">Nombre</label>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                name="name"     
                                                className="form-control"
                                                placeholder="Nombre"
                                                value={this.state.data.name}
                                                />
                                            <span className="input-group-addon">
                                                <span className="icon-tag"></span>
                                            </span>
                                        </div>
                                    </div>             
                                </div>
                                <div className="col-xs-12 col-md-4"></div>
                            </div>

                             <div className="row">                     
                                <div className="col-xs-12 col-md-4">
                                    <div className="form-group">
                                        <label>Proveedor</label>
                                        { this.props.providers.length > 0 && this.state.data && this.state.data.provider &&                                         
                                            <Select
                                                name="provider"
                                                placeholder="Seleccione..."
                                                value={this.state.data.provider.id}
                                                options={this.props.providers}
                                                onChange={obj=>{this.handleOptionChange("provider", obj)}}
                                                />
                                        }
                                    </div>         
                                </div>

                                <div className="col-xs-12 col-md-3">
                                    <div className="form-group">
                                        <label>Familia</label>
                                        { this.props.families.length > 0 && this.state.data && this.state.data.family &&    
                                            <Select
                                                name="family"
                                                placeholder="Seleccione..."
                                                value={this.state.data.family.id}
                                                options={this.props.families}
                                                onChange={obj=>{this.handleFamilyChange(obj)}}
                                                />
                                        }
                                    </div>         
                                </div>

                                <div className="col-xs-12 col-md-3">
                                    <div className="form-group">
                                        <label>Grupo</label>
                                        { this.props.groups.length > 0 && this.state.data && this.state.data.group &&    
                                            <Select
                                                name="group"
                                                placeholder="Seleccione..."
                                                noResultsText="Sin resultados"
                                                value={this.state.data.group.id}
                                                options={this.props.groups}
                                                onChange={obj=>{this.handleOptionChange("group", obj)}}
                                                />
                                        }
                                    </div>         
                                </div>
                                
                                <div className="col-xs-12 col-md-2"></div>
                            </div>

                            <div className="row">                     
                                <div className="col-xs-4 col-md-1">
                                    <div className="form-group">
                                        <label>Moneda</label>
                                        <select className="form-control" name="type">
                                            <option value="ars">AR$</option>
                                            <option value="usd">U$D</option>
                                        </select>
                                    </div>         
                                </div>
                                <div className="col-xs-8 col-md-2">
                                    <div className="form-group">
                                        <label htmlFor="price">Precio</label>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                name="price"     
                                                className="form-control"
                                                placeholder="Precio"
                                                value={this.state.data.price}
                                                />
                                            <span className="input-group-addon">
                                                <span className="fa fa-usd"></span>
                                            </span>
                                        </div>
                                    </div>             
                                </div>
                                <div className="col-xs-12 col-md-9"></div>
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