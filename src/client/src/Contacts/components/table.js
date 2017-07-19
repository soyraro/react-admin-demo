import React, {Component} from 'react'
import PropTypes from 'prop-types'
import config from '../../config/app.js'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import Actions from './tableActions'
import _ from 'lodash'

class ContactsTable extends Component {

    static propTypes = {
        data: PropTypes.array.isRequired,     
        onDeleteClicked: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);

        // bind actions
        this.formatTableActions = this.formatTableActions.bind(this);
      
        // define table columns
        this.state = {
            columns: [
                {
                    title: "Nombre",
                    field: "fullname",
                    width: "120"
                }, {
                    title: "Cargo",
                    field: "position",
                    isKey: true,
                    width: "120"
                }, {
                    title: "Teléfonos",
                    field: "phones",
                    width: "190"
                }, {
                    title: "Celular",
                    field: "cellphone",
                    width: "80"
                }, {
                    title: "Email",
                    field: "emails.[0].email",
                    formatter: this.formatEmailfield,
                    width: "120"
                }, {
                    title: "Estado",
                    field: "state.name",
                    formatter: this.formatStatefield,
                    width: "90"
                }, {
                    title: "Acciones",
                    formatter: this.formatTableActions, // already binded 
                    sort: false,
                    width: "180"
                }
            ]
        };      
    }

    /**
     * Extract data from child fields
     */
    formatStatefield = (cell, row, extra) => {
        const value = _.get(row, extra.field);
        let style = "label label-sm label-";
        style+= (row.state.key !== 'activo') ? 'danger' : 'success';
        return <span className={style}> {value} </span>
    };

    /**
     * Extract data from child fields
     */
    formatEmailfield = (cell, row, extra) => {
        const value = _.get(row, extra.field);
        return <div>{value}</div>;
    };

    /**
     * Table actions column
     * 
     * @param {*} cell 
     * @param {*} row 
     */
    formatTableActions(cell, row) {     
        const actions = <Actions onWithdraw={this.onWithdrawClicked.bind(this)} onDelete={this.onDeleteClicked.bind(this)} />;
        return React.cloneElement(actions, {
            enterprise_id: row.enterprise, 
            contact_id: row.id
        });
    }

    /**
     * On delete action clicked
     * @param {int} id 
     */
    onDeleteClicked(id) {
        this.props.onDeleteClicked(id);
    }

    /**
     * On delete action clicked
     * @param {int} id 
     */
    onWithdrawClicked(enterprise_id, contact_id) {
        this.props.onWithdrawClicked({
            enterprise_id,
            contact_id
        });
    }

    render() {
            
        const options = {
            sizePerPage: config.tables.sizePerPage
        };

        return (
                      
            <BootstrapTable data={this.props.data} 
                options={options}
                striped={true} hover={true} 
                search searchPlaceholder='Buscar...' pagination>                                    
                {                                        
                    this.state.columns.map((col, index)=>{
                        
                        return <TableHeaderColumn 
                            key={index}
                            dataField={col.field} 
                            isKey={col.isKey}
                            width={col.width}
                            dataSort={_.isNil(col.sort) ? true : col.sort}
                            dataFormat={col.formatter}
                            formatExtraData={col}
                            >{col.title}</TableHeaderColumn>
                    })
                }
            </BootstrapTable>           
        );
    }
}

export default ContactsTable