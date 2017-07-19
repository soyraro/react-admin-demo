import React, {Component} from 'react'
import PropTypes from 'prop-types'
import config from '../../config/app.js'
import { Link } from 'react-router-dom'
import ProductsTable from './table'
import FlashMessages from '../../FlashMessages'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import Actions from './tableActions'
import _ from 'lodash'

import swal from 'sweetalert2'

class ProductsList extends Component {

    static propTypes = {
        products: PropTypes.array.isRequired,
        fetchProductList: PropTypes.func.isRequired,
        unselectProduct: PropTypes.func.isRequired,
        onRemoveProduct: PropTypes.func.isRequired
    }

    constructor(props) {
       super(props)
       
        // define table columns
        this.state = {
            
        }
    }

    componentWillMount() {

        // fetch data
        this.props.fetchProductList();

        this.props.unselectProduct(); // remove seleted item if any
    }

    /**
     * On delete action clicked
     * @param {int} id 
     */
    onDeleteClicked(id) {
      
        const self = this;

        swal({
            ... config.tables.onDeleteSwal,
            text: "Se eliminará el producto",
        }).then(function () {
            self.props.onRemoveProduct(id);
        }, function(dismiss) {  
            console.log("dismiss deleting");          
        })  
    }
 
    render() {
  
        return (
            <div className="row">
                <div className="col-md-12">

                    <div className="portlet light bordered">
                        <div className="portlet-title">
                            <div className="caption">
                                <i className="icon-social-dribbble font-dark hide"></i>
                                <span className="caption-subject font-dark bold uppercase">Productos</span>
                            </div>
                        </div>
                        <div className="portlet-body">
                            <div className="messages">
                                <FlashMessages />
                            </div>
                            <div className="table-toolbar">
                                <div className="row">
                                    <div className="col-md-12 text-right">
                                        <div className="btn-group">
                                            <Link to="/productos/alta" className='btn sbold green'>                                              
                                                <i className="fa fa-plus"></i> <span> Alta</span>                                
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {
                                (this.props.products) && 

                                <ProductsTable data={this.props.products} 
                                    onDeleteClicked={this.onDeleteClicked.bind(this)} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProductsList