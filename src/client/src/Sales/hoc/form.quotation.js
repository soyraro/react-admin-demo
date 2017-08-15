import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import QuotationForm from '../components/form.quotation'
import { fetchCurrencies } from 'Commons/actions/currencies'
import { fetchProductList } from 'Products/actions'
import { updateQuotation, fetchShipmentTypesList, addProduct, saveProduct, removeProduct } from 'Sales/actions/quotations'
import withFlashMessages from 'FlashMessages/hoc/with-flash-messages'
import { mapForDropdownList } from 'Commons/utils/dropdownlists'

const mapStateToProps = (store, ownProps) => {  
   
    const product_types = [
        {id: 'producto', value: 'producto', label: 'Producto'},
        {id: 'repuesto', value: 'repuesto', label: 'Repuesto'}
    ]

    let products = store.products.list || [];
    if (products.length > 0) {
        products = mapForDropdownList(products, {extra: ['currency', 'price']});
    }  

    let currencies = store.currencies || [];
    if(currencies.length > 0) { 
        currencies = mapForDropdownList(currencies);
    }  

    let shipment_types = store.sales.selected.quotation.shipment_types || [];
    if(shipment_types.length > 0) { 
        shipment_types = mapForDropdownList(shipment_types);
    }  
    return {
        data: ownProps.data,
        shipment_types,
        product_types,
        products,
        currencies
    }
}

const mapDispatchToProps = dispatch => {
   
    return {
        getProducts: () => { return dispatch(fetchProductList()); },
        getCurrencies: () => { return dispatch(fetchCurrencies()); },
        getShipmentTypesList: () => { return dispatch(fetchShipmentTypesList()); },
        updateQuotation: (data) => { return dispatch(updateQuotation(data)); },
        addProduct: (data) => { return dispatch(addProduct(data)); },
        saveProduct: (data) => { return dispatch(saveProduct(data)); },
        removeProduct: (id) => { return dispatch(removeProduct(id)); }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withFlashMessages(QuotationForm))