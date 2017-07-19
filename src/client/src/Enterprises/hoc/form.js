import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import EnterprisesForm from '../components/form'
import { addEnterprise, saveEnterprise, getEnterprise, enterpriseUnselected } from '../actions'
import { fetchCountryList, fetchProvinceList } from '../../Commons/actions/countries'
import withFlashMessages from '../../FlashMessages/hoc/with-flash-messages'

function mapForDropdownList(list, params) {

    // merge default with params
    const objectKeys = Object.assign({
        id: 'id',
        label: 'name',
        value: 'id'        
    }, params)

    return Object.values(list).map((item)=>{

        const data = {
            id: item[objectKeys.id],
            label: item[objectKeys.label],
            value: item[objectKeys.value]
        }

        if(typeof objectKeys.extra != 'undefined') {
            data[objectKeys.extra] = item[objectKeys.extra]; // arbitrary data
        }
            
        return data;
    })
}

const mapStateToProps = (store, ownProps) => {  
   
     // fetch countries and format data for dropdownlist
    let countries = store.countries.list;
    if (countries.length > 0) {
        countries = mapForDropdownList(countries);
    }  

    let provinces = store.countries.provinces;
    if (provinces.length > 0) {
        provinces = mapForDropdownList(provinces);
    }  
  
    return {
        data: store.enterprises.selected,
        countries,
        provinces
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getEnterprise: (id) => { return dispatch(getEnterprise(id)); },
        getCountries: () => { return dispatch(fetchCountryList()); },
        getProvinces: (country_id) => { return dispatch(fetchProvinceList(country_id)); },
        unselectEnterprise: () => { dispatch(enterpriseUnselected()) },
        onAddEnterprise: (data) => { return dispatch(addEnterprise(data)) },
        onSaveEnterprise: (data) => { return dispatch(saveEnterprise(data)) },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withFlashMessages(EnterprisesForm))