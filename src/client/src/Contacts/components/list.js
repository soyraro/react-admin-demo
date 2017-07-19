import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import config from '../../config/app.js'
import { withRouter } from 'react-router'
import queryString from 'query-string'
import Select from 'react-select'
import ContactsTable from './table'
import FlashMessages from '../../FlashMessages'
import swal from 'sweetalert2'
import _ from 'lodash'

class ContactsList extends Component {

    static propTypes = {
        contacts: PropTypes.array.isRequired,
        enterprises: PropTypes.array.isRequired,
        sectors: PropTypes.array.isRequired,
        states: PropTypes.array.isRequired,
        fetchEnterpriseContactList: PropTypes.func.isRequired,
        fetchEnterpriseList: PropTypes.func.isRequired,
        fetchSectorList: PropTypes.func.isRequired,
        fetchContactStates: PropTypes.func.isRequired,
        onRemoveContact: PropTypes.func.isRequired,
        onChangeContactState: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);

        // bind actions
        this.filterByEnterprise = this.filterByEnterprise.bind(this);
        this.filterBySector = this.filterBySector.bind(this);
        this.filterByState = this.filterByState.bind(this);
        this.onWithdrawClicked = this.onWithdrawClicked.bind(this);
        this.onDeleteClicked = this.onDeleteClicked.bind(this);

        // define default filters
        this.state = {   
            query: queryString.parse(location.search),
            filters: {
                enterprise: {},   
                sector: {},      
                contact_state: {}     
            },
        };
    }

    componentDidMount() {

        const self = this;
        const query = this.state.query;

        /**
         * Get all dropdownlists data befor fetching table data
         */
        this.props.fetchEnterpriseList()
        .then(()=>{
            // apply predefined filter     
            if(query.enterprise_id) {
                const enterprise = _.find(self.props.enterprises, {id: parseInt(query.enterprise_id)});
                return self.filterByEnterprise(enterprise, false);
            }             
        })
        .then(()=>{
            // fetch contact states ddl data
            return this.props.fetchContactStates().then(()=>{

                // defaults to Activo. Important!
                let contact_state = self.props.states[0];

                // apply predefined filter if present in URI  
                if(query.state_id) {
                    contact_state = _.find(self.props.states, {id: parseInt(query.state_id)});
                }

                self.filterByState(contact_state, false);
            });   
        })
        .then(_=>{
            // fetch table data
            self.filter();
        });        
    }

    /**
     * Sets filter in state.
     * Latelly, filter() method will reflect it in URL
     */
    setFilter(name, value, callback = null) {
        return this.setState({
            filters: Object.assign({}, this.state.filters, {
                [name]: value || {}
            })
        }, callback);
    }

    /**
     * Gathers all current filters and dispatchs an action
     */
    filter() { 
    
        const filters = {
            enterprise_id: this.state.filters.enterprise.id,
            sector_id: this.state.filters.sector.id,
            state_id: this.state.filters.contact_state.id
        };

        this.props.fetchEnterpriseContactList(filters);

        this.props.history.push({
            search: queryString.stringify(filters)
        });
    }

    filterByEnterprise(enterprise, fetch = true) {
             
        const self = this;
        const query = this.state.query;
        const lodash = _;

        // filter by selected enterprise
        if(enterprise !== null) {

            // set enterprise filter in state (& URI)
            self.setFilter('enterprise', enterprise);

            return new Promise( resolve => {
                // trigger combobox
                self.props.fetchSectorList(enterprise.id).then(_=>{

                    if(query.sector_id) {
                        const sector = lodash.find(self.props.sectors, {id: parseInt(query.sector_id)});
                        self.filterBySector(sector, false);
                    }
                   
                    // filter table
                    if (fetch) self.filter(); 

                    resolve();
                }); 
            });
        } else {
           
            // when enterprise filter is cleared
            this.props.fetchSectorList(null).then(_=>{
             
                // reset filters
                self.setState({
                    filters: Object.assign({}, this.state.filters, {
                        enterprise: {},
                        sector: {}
                    })
                }, _=> self.filter())
            });
        }
    }

    filterBySector(sector, fetch = true) {

        // set current sector 
        this.setFilter('sector', sector, _ => {
            // fetch data from server
            if (fetch) this.filter()
        });
    }

    filterByState(contact_state, fetch = true) {

        // set current state 
        this.setFilter('contact_state', contact_state, _ => {
            // fetch data from server
            if (fetch) this.filter()
        });
    }

    /**
     * On delete action clicked
     * @param {int} id 
     */
    onDeleteClicked(id) {
      
        const self = this;

        swal({
            ... config.tables.onDeleteSwal,
            text: "Se eliminará el contacto",
        }).then(function () {
            self.props.onRemoveContact(id).catch(_=>{
                Promise.reject(); // TODO: capture error 500 before global capture
            });
        }, function(dismiss) {  
            console.log("dismiss deleting");          
        })  
    }

    /**
     * On delete action clicked
     * @param {int} id 
     */
    onWithdrawClicked(data) {
      
        const self = this;

        const enterprise_id = data.enterprise_id;
        const contact_id = data.contact_id;
        const contact_state = _.find(this.props.states, {value: 'baja'});
      
        // payload
        const payload = {
            contact_id,
            state: {
                id: contact_state.id,
                keyname: contact_state.value,
                name: contact_state.label
            }
        };

        swal({
            ... config.tables.onDeleteSwal,
            title: "Baja",
            text: "Se marcará en estado Baja. Confirma?",
        }).then(function () {
            self.props.onChangeContactState(data.enterprise_id, contact_id, payload);
        }, function(dismiss) {  
            console.log("dismiss withdrawing");          
        })  
    }

    render() {
     
        const enterprise = this.state.filters.enterprise || {};
        const sector = this.state.filters.sector || {};
        const contact_state = this.state.filters.contact_state || {};

        return (
            <div className="row">
                <div className="col-md-12">

                    <div className="portlet light bordered">
                        <div className="portlet-title">
                            <div className="caption">
                                <i className="icon-social-dribbble font-dark hide"></i>
                                <span className="caption-subject font-dark bold uppercase">Contactos</span>
                            </div>
                        </div>
                        <div className="portlet-body">
                            <div className="messages">
                                <FlashMessages />
                            </div>
                            <div className="table-toolbar">
             
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="row">

                                            <div className="col-md-4">
                                                <Select
                                                name="enterprise"
                                                placeholder="Empresa..."
                                                value={enterprise.value}
                                                options={this.props.enterprises}
                                                onChange={this.filterByEnterprise}
                                                />
                                            </div>

                                            <div className="col-md-4">
                                                <Select
                                                name="sector"
                                                placeholder="Sector..."
                                                noResultsText="Sin resultados"
                                                value={sector.value}
                                                options={this.props.sectors}
                                                onChange={this.filterBySector}
                                                />
                                            </div>

                                            <div className="col-md-4">
                                                <Select
                                                name="contact_state"
                                                placeholder="Estado..."
                                                value={contact_state.value}
                                                options={this.props.states}
                                                onChange={this.filterByState}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 text-right">
                                        <div className="btn-group">
                                            <Link to="/empresas/contactos/alta" className='btn sbold green'>                                              
                                                <i className="fa fa-plus"></i> <span> Alta</span>                                
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {
                                (this.props.contacts) && 

                                <ContactsTable data={this.props.contacts} 
                                    onWithdrawClicked={this.onWithdrawClicked}
                                    onDeleteClicked={this.onDeleteClicked} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ContactsList