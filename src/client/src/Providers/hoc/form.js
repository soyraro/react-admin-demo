import React, {Component} from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import ProvidersForm from '../components/form'
import { addProvider, saveProvider, getProvider, providerUnselected } from '../actions'
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
    if (countries.length) {
        countries = mapForDropdownList(countries);
    } 

    let provinces = store.countries.provinces;
    if (provinces.length) {
        provinces = mapForDropdownList(provinces);
    } 

    return {
        data: store.providers.selected,
        countries,
        provinces
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getProvider: (id) => { return dispatch(getProvider(id)); },
        getCountries: () => { return dispatch(fetchCountryList()); },
        getProvinces: (country_id) => { return dispatch(fetchProvinceList(country_id)); },
        unselectProvider: () => { dispatch(providerUnselected()) },
        onAddProvider: (data) => { dispatch(addProvider(data)) },
        onSaveProvider: (data) => { dispatch(saveProvider(data)) },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withFlashMessages(ProvidersForm))