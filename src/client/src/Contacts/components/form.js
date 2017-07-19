import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import queryString from 'query-string'
import Select from 'react-select'
import ReactQuill from 'react-quill'
import View from './form.view'
import _ from 'lodash'

class Form extends Component {

    static defaultProps = {
        data: {           
        }
    };
    static propTypes = {
        data: PropTypes.object,
        enterprises: PropTypes.array.isRequired,
        sectors: PropTypes.array.isRequired,
        states: PropTypes.array.isRequired,
        getEnterpriseContact: PropTypes.func.isRequired,
        getEnterprises: PropTypes.func.isRequired,
        getSectors: PropTypes.func.isRequired,
        getContactStates: PropTypes.func.isRequired,
        onAddContact: PropTypes.func.isRequired,
        onSaveContact: PropTypes.func.isRequired,
        unselectContact: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,  
        flashSuccess: PropTypes.func.isRequired
    }

    constructor(props) {

        super(props);

        this.state = Object.assign({}, Form.defaultProps, props, {
            isEdition: props.match.params.contact_id ? true : false     
        });
      
        if(!this.state.isEdition) {
            // re assure we are creating from scratch
            this.props.unselectContact();
        }

        // events
        this.handleEnterpriseChange = this.handleEnterpriseChange.bind(this);
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
           
            this.props.getEnterpriseContact(this.props.match.params.enterprise_id, this.props.match.params.contact_id).then(_=>{
                this.fetchData(); // fetch dropdowns data
            });
        }  else {            
            this.fetchData();
        }  
    }

    fetchData() {
         
        const self = this;

        // fetch enterprise/sectors list
        this.props.getEnterprises().then(()=> {
            // set predefined enterprise
            const enterprise = (self.state.isEdition) ? self.state.data.enterprise : self.props.enterprises[1];
            self.handleEnterpriseChange(enterprise);
        });

        this.props.getContactStates().then(()=> {

            const contact_state = (self.state.isEdition) ? 
                _.find(self.props.states, {id: self.state.data.enterprise.state_id}) 
                : self.props.states[0];
            // set predefined sector
            self.setState({
                data: Object.assign({}, self.state.data, {
                    contact_state
                })
            });
        })
    }

    /**
     * Form data received for edition
     * 
     * @param {obj} nextProps 
     */
    componentWillReceiveProps(nextProps) {
       
        this.setState({
            data: nextProps.data,
        });
    }

    handleEnterpriseChange(enterprise) {
       
        const self = this;
       
        this.props.getSectors(enterprise.id).then(_=> {

            const sector = (self.state.isEdition) ? self.state.data.sector : self.props.sectors[0];

            // set predefined sector
            self.setState({
                data: Object.assign({}, self.state.data, {
                    enterprise,
                    sector
                })
            });
        })
    }

    save(data) {

        const enterprise_id = data.enterprise;
        const contact_id = data.id;

        // will redirect to filtered list after saving
        const redirection = {
            pathname: '/empresas/contactos',
            search: queryString.stringify({
                enterprise_id,
                sector_id: data.sector,
                state_id: data.contact_state
            })
        }     

        if(!data.id) {
            // new
            this.props.onAddContact(enterprise_id, data).then(_=>{
                this.props.flashSuccess({
                    text: "Se ha guardado los datos"
                })
                this.clear();
                this.props.history.push(redirection);
            }).catch(_=>{
                this.props.flashError({
                    text: "Hubo un error al guardar los datos"
                })
            }); 
        } else {
            // update
            this.props.onSaveContact(enterprise_id, contact_id, data).then(_=>{
                this.props.flashSuccess({
                    text: "Se ha guardado el registro"
                })
                this.clear();
                this.props.history.push(redirection);
            }).catch(_=>{
                this.props.flashError({
                    text: "Hubo un error al guardar el registro"
                })
            });  
        }        
    }

    cancel() {
        this.clear();
        this.backToList();
    }

    clear() {
        this.setState({ data: Form.defaultProps.data}); // reset state
        this.props.unselectContact(); // redux action
    }

    backToList() {
        this.props.history.goBack(); // redirect
    }

    render() {
       
        return ( 
            <View data={this.state.data} 
                isEdition={this.state.isEdition}
                enterprises={this.props.enterprises}
                sectors={this.props.sectors}
                contact_states={this.props.states}
                handleEnterpriseChange={this.handleEnterpriseChange}
                save={this.save}
                cancel={this.cancel}
            /> 
        )
    }
}

export default Form