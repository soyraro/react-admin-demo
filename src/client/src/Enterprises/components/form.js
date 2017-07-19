import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import Select from 'react-select'
import View from './form.view'

class Form extends Component {

    /**
     * Pre-declaring nested fields
     */
    static defaultProps = {
        data: {
            'id': '',
            'legal_name': '',
            'cuit': '',
            'town': '',
            'address': '',
            'zipcode': '',
            'phone': '',       
            'observations': '',
            'client_type': '',
            'country': {},
            'province': {},
            'bidding_web': {
                'link': '',
                'user': '',
                'password': ''
            },
            'invoice_web': {
                'link': '',
                'user': '',
                'password': ''
            }
        }
    };

    static propTypes = {
        data: PropTypes.object,
        countries: PropTypes.array.isRequired,
        provinces: PropTypes.array.isRequired,
        getEnterprise: PropTypes.func.isRequired,
        getCountries: PropTypes.func.isRequired,
        getProvinces: PropTypes.func.isRequired,
        onAddEnterprise: PropTypes.func.isRequired,
        onSaveEnterprise: PropTypes.func.isRequired,
        unselectEnterprise: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired
    }

    constructor(props) {

        super(props);

        this.state = Object.assign({}, Form.defaultProps, props, {
            isEdition: props.match.params.id ? true : false     
        });
      
        if(!this.state.isEdition) {
            // re assure we are creating from scratch
            this.props.unselectEnterprise();
        }

        // events
        this.handleCountryChange = this.handleCountryChange.bind(this);
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
            this.props.getEnterprise(this.props.match.params.id).then(_=>{
                this.fetchData();
            });
        }  else {            
            this.fetchData();
        }  
    }

    fetchData() {
         
        // fetch country/provinces list
        this.props.getCountries().then(()=> {
            // set predefined country
            const country = (this.state.isEdition) ? this.state.data.country : this.props.countries[1];
            this.handleCountryChange(country, this.state.data.province);
        });
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

    handleCountryChange(country, province = this.props.provinces[1]) {
       
        const self = this;
       
        this.props.getProvinces(country.id).then(_=> {

            // set predefined province
            self.setState({
                data: Object.assign({}, this.state.data, {
                    country,
                    province
                })
            });
        })
    }

    save(data) {
   
        if(!data.id) {
            this.props.onAddEnterprise(data).then(_=>{
                this.props.flashSuccess({
                    text: "Se ha guardado la empresa"
                })
                this.clear();
                this.backToList();
            }).catch(_=>{
                this.props.flashError({
                    text: "Hubo un error al guardar los datos"
                })
            });  
        } else {
            this.props.onSaveEnterprise(data).then(err=>{
                this.props.flashSuccess({
                    text: "Se ha guardado los datos"
                })
                this.clear();
                this.backToList();
            }).catch(_=>{
                this.props.flashError({
                    text: "Hubo un error al guardar los datos"
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
        this.props.unselectEnterprise(); // redux action
    }

    backToList() {
        this.props.history.goBack(); // redirect
    }

    render() {
       
        return ( 
            <View data={this.state.data} 
                isEdition={this.state.isEdition}
                countries={this.props.countries}
                provinces={this.props.provinces}
                handleCountryChange={this.handleCountryChange}
                save={this.save}
                cancel={this.cancel}
            /> 
        )
    }
}

export default Form