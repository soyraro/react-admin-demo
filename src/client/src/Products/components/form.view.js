import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { Link } from 'react-router-dom'
import FlashMessages from '../../FlashMessages'

class Form extends Component {

    static propTypes = {
        data: PropTypes.object,
        types: PropTypes.array.isRequired,
        providers: PropTypes.array.isRequired,
        families: PropTypes.array.isRequired,
        groups: PropTypes.array.isRequired,
        currencies: PropTypes.array.isRequired,
        handleInputChange: PropTypes.func.isRequired,  
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
            type: this.state.type.value
        }
        this.props.save(data);
    }

    cancel() {
        this.props.cancel();  
    }

    render() {
     
        return (

            <div className="portlet light bordered">
                <div className="portlet-title">
                    <div className="row">
                        <div className="col-xs-12 col-sm-6">
                            <div className="caption font-red-sunglo">
                                <span className="fa fa-circles font-red-sunglo"></span>
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
                                        <Select
                                            name="type"
                                            clearable={false}
                                            value={this.state.type.value}
                                            options={this.props.types}
                                            onChange={obj=>{this.props.handleOptionChange("type", obj)}}
                                            />
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
                                                value={this.state.code}
                                                onChange={this.props.handleInputChange}
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
                                                value={this.state.name}
                                                onChange={this.props.handleInputChange}
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
                                        { this.props.providers.length > 0 && this.state && this.state.provider &&                                         
                                            <Select
                                                name="provider"
                                                placeholder="Seleccione..."
                                                value={this.state.provider.id}
                                                options={this.props.providers}
                                                onChange={obj=>{this.props.handleOptionChange("provider", obj)}}
                                                />
                                        }
                                    </div>         
                                </div>

                                <div className="col-xs-12 col-md-3">
                                    <div className="form-group">
                                        <label>Familia</label>
                                        { this.props.families.length > 0 && this.state && this.state.family &&    
                                            <Select
                                                name="family"
                                                placeholder="Seleccione..."
                                                value={this.state.family.id}
                                                options={this.props.families}
                                                onChange={obj=>{this.props.handleFamilyChange(obj)}}
                                                />
                                        }
                                    </div>         
                                </div>

                                <div className="col-xs-12 col-md-3">
                                    <div className="form-group">
                                        <label>Grupo</label>
                                        { this.props.groups.length > 0 && this.state && this.state.group &&    
                                            <Select
                                                name="group"
                                                placeholder="Seleccione..."
                                                noResultsText="Sin resultados"
                                                value={this.state.group.id}
                                                options={this.props.groups}
                                                onChange={obj=>{this.props.handleOptionChange("group", obj)}}
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
                                        { this.props.currencies.length > 0 && this.state && this.state.currency &&    
                                            <Select
                                                name="currency"
                                                clearable={false}
                                                value={this.state.currency.id}
                                                options={this.props.currencies}
                                                onChange={obj=>{this.props.handleOptionChange("currency", obj)}}
                                                />
                                        }
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
                                                value={this.state.price}
                                                onChange={this.props.handleInputChange}
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