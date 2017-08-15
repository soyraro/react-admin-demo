import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import _ from 'lodash'
import { withRouter } from 'react-router'
import config from '../../config/app.js'
import queryString from 'query-string'
import classNames  from 'classnames'
import {Link} from 'react-router-dom'
import moment from 'moment'
import 'moment/locale/es'
import { formatDateVisualy, formatDateForStorage } from '../../Commons/utils/dates'
import FlashMessages from '../../FlashMessages'
import Comments from '../../Comments/components'

class Form extends Component {

    static propTypes = {
        data: PropTypes.object.isRequired,
        current_user: PropTypes.object.isRequired,
        getTask: PropTypes.func.isRequired,
        markViewed: PropTypes.func.isRequired,
        statuses: PropTypes.array.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,   
    }

    /**
     * Pre-declaring nested fields
     */
    static defaultProps = {
        data: { 
            author: {},
            receiver: {},
            contact: {},
            enterprise: {},
            sector: {},
        }
    }

    constructor(props) {

        super(props);
        
        this.state = {
            ...Form.defaultProps.data,
            ...props.data
        }
        // events
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
    }

    fetchTask() {
        this.props.getTask(this.props.match.params.id);
    }

    /**
     * Page is visited
     */
    componentDidMount() {
        this.fetchTask();
    }

    /**
     * Occurs when user switch tasks without leaving the page,
     * so id param changes but there's not a page "reload"
     */
    componentDidUpdate(prevProps, prevState) {

       if(prevProps.match.params.id !== this.props.match.params.id) {
            this.fetchTask();
       }
    }

    componentWillReceiveProps(newProps) {
      
        this.setState({                       
            ...newProps.data,
            status: _.find(newProps.statuses, {value: newProps.data.status})
        });

        /**
         * Mark as viewed
         */
        const viewed = newProps.data.viewed;
        const assignedToMe = (newProps.data.receiver.id == newProps.current_user.id);
        if( !viewed && assignedToMe) {
            newProps.markViewed(newProps.data.id);
        }
    }

    /**
     * Handle dropdowns & radio buttons 
     * @param {*} field name
     * @param {*} value 
     */
    handleOptionChange(field, value) {
        this.setState({ [field]: value });
    }

    save() {

        const data = {
            ...this.state
        };  

        // will redirect to filtered list after saving
        const redirection = {
            pathname: '/tareas',
            search: queryString.stringify({
                receiver_id: data.receiver.id,
                status: data.status.value
            })
        }     

        // update
        this.props.onSaveTask(data).then(_=>{
            this.props.flashSuccess({
                text: "Se ha actualizado la tarea"
            })
            this.clear();
            this.props.history.push(redirection);
        }).catch(_=>{
            this.props.flashError({
                text: "Hubo un error al actualizar la tarea"
            })
        });  
                
    }

    cancel() {
        this.clear();
        this.backToList();
    }

    clear() {
        this.setState({ data: this.props.data}); // reset state
    }

    backToList() {
        this.props.history.push({pathname: '/tareas'})
    }

    render() {

        const data = this.state;
        const contact = data.contact;
        const enterprise = data.enterprise;
        const sector = data.sector;
     
        const ribbonColor = data.priority == 'urgente' ? "danger" : "info"

        return (

            <div className="portlet light bordered">

                <div className="messages">
                    <FlashMessages />
                </div>

                <div className="portlet-title">
                    <div className="row">

                        <div className="col-xs-12 col-sm-6">
                            <div className="caption">
                                <i className="icon-bubble font-red-sunglo"></i>
                                <span className="caption-subject bold uppercase font-red-sunglo">  Tarea dirigida a </span>
                                <span className="caption-subject bold uppercase">{ data.receiver.fullname }</span>
                            </div> 
                        
                            <h4 className="narrow-title"><small>Creada por: </small>{ data.author.fullname }</h4>  
                            <p className="narrow-title"><small>Fecha: </small>{data.created_at}</p>   
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
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <div className="mt-element-ribbon bg-grey-steel">
                                        <div className={classNames("ribbon", "uppercase", "ribbon-color-"+ribbonColor)}>Prioridad { data.priority }</div>
                                        <div className="ribbon-content">
                                            
                                            <small>{ enterprise.client_type }</small>
                                            <h3 className="narrow-title"><Link to={"/empresas/"+enterprise.id+"/edicion"}>{ enterprise.legal_name }</Link> 
                                                <small> <Link to={"/empresas/contactos?enterprise_id="+enterprise.id+"&sector_id="+sector.id+"&state_id=1"}>{ sector.name }</Link></small></h3>
                                            <h4><Link to={"/empresas/"+enterprise.id+"/contactos/"+contact.id+"/edicion"}>{ contact.fullname }</Link></h4>
                                        </div>
                                    </div>                                    
                                </div>   
                            </div>

                            <div className="row">
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">                                  
                                      
                                        <div className="portlet light bg-inverse">
                                            <div className="portlet-title">
                                                <div className="caption">
                                                    <i className="icon-paper-plane font-yellow-casablanca"></i>
                                                    <span className="caption-subject bold font-yellow-casablanca uppercase"> Descripción</span>
                                                    <span className="caption-helper"></span>
                                                </div>                                               
                                            </div>
                                            <div className="portlet-body">
                                                <div dangerouslySetInnerHTML={{__html: this.state.description}}></div>
                                            </div>
                                        </div>
                                </div>
                            </div>

                            <div className="row">
                               
                                <div className="col-xs-12 col-sm-4 col-md-2">
                                    <div className="form-group">
                                        <label>Estado</label>
                                        { this.props.statuses.length > 0 && data.status &&
                                            <Select
                                                name="status"
                                                placeholder="Seleccione..."
                                                value={data.status.value}
                                                options={this.props.statuses}
                                                clearable={false}
                                                onChange={obj=>{this.handleOptionChange("status", obj)}}
                                                />
                                        } 
                                    </div>
                                </div>
                            </div>

                            <div className="row caption">
                                <div className="col-xs-12 col-sm-6">
                                    <div className="caption-desc font-grey-cascade">Ultima modificación: { data.updated_at }</div>
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

                {this.props.data.id &&
                    <Comments list={data.comments} id={this.props.data.id} />
                }
            </div>
        );
    }
}

export default Form