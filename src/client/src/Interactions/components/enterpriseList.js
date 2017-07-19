import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import config from '../../config/app.js'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import moment from 'moment'
import FlashMessages from '../../FlashMessages'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import Actions from './tableActions'
import swal from 'sweetalert2'

class EnterpriseInteractions extends Component {

    static propTypes = {
        interactions: PropTypes.array.isRequired,
        contact: PropTypes.object,
        fetchEnterpriseInteractionList: PropTypes.func.isRequired,
        onRemoveInteraction: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired
    }
    
    constructor(props) {

        super(props);

        // bind actions
        this.formatTableActions = this.formatTableActions.bind(this);
        this.onDeleteClicked = this.onDeleteClicked.bind(this);
        
        // table columns
        this.state = {
            contactIdProvided: props.location.pathname.indexOf('contactos') !== -1,
            enterprise_id: parseInt(props.match.params.enterprise_id),
            contact: {}, // if any
            columns: [
            {
                title: "ID",
                field: "id",
                isKey: true,
                sort: false,
                width: '70',
            }, {
                title: "Fecha",
                field: "date",    
                sort: true,    
                sortFunc: this.orderByDate,       
                width: '100',
            }, {
                title: "Contacto",
                field: "contact.fullname",
                formatter: this.formatChildfield,
                sort: false,
                width: '140',
            }, {
                title: "Interacción",
                field: "description",
                formatter: this.formatRichTextToPlain,
                sort: false,
                width: '400',
            }, {
                title: "Acciones",
                formatter: this.formatTableActions, // already binded 
                sort: false,
                dataAlign: "center",
                width: '90'
            }
        ]}   
       
        if(this.state.contactIdProvided) {
            // remove contacts column
            this.state.columns = this.state.columns.filter(x=>{ return x.title !== 'Contacto' });
        }

        // fetch data
        const enterprise_id = this.state.enterprise_id;
        const contact_id = props.match.params.contact_id;
        this.props.fetchEnterpriseInteractionList(enterprise_id, contact_id);
    }

    componentDidMount() {
        if(this.state.contactIdProvided) {
            this.props.getContact(this.state.enterprise_id, this.props.match.params.contact_id);
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.state.contactIdProvided && nextProps.contact) {
            this.state.contact = nextProps.contact;
        }
    }

    /**
     * Table actions column
     * 
     * @param {*} cell 
     * @param {*} row 
     */
    formatTableActions(cell, row) {     
        const actions = <Actions enterprise_id={this.state.enterprise_id} interaction_id={row.id} onDelete={this.onDeleteClicked} />;
        return React.cloneElement(actions, {id: row.id});
    }

    /**
     * Extract data from child fields
     */
    formatChildfield = (cell, row, extra) => {
        const value = _.get(row, extra.field);
        return <div>{value}</div>;
    };

    /**
     * Strip html tags from str
     */
    formatRichTextToPlain(content) {
        return content.replace(/(<([^>]+)>)/ig,"");
    }

    orderByDate(row1, row2) { 
        return moment(row1.date, 'DD-MM-YYYY') - moment(row2.date, 'DD-MM-YYYY')
    }

    /**
     * On delete button clicked
     * @param  id 
     */
    onDeleteClicked(id) {
       
        const self = this;

        swal({
            ... config.tables.onDeleteSwal,
            text: "Se eliminará la interacción",
        }).then(function () {
            self.props.onRemoveInteraction(id);
        }, function(dismiss) { 
            console.log("dismiss deleting");          
        })   
    }

    render() {
     
        const options = {
            sizePerPage: config.tables.sizePerPage
        };

        // predefined contact
        const query = this.state.contact.id ? "contact_id=this.state.contact.id" : '';

        return (
            <div className="row">
                <div className="col-md-12">

                    <div className="portlet light bordered">
                        <div className="portlet-title">
                            <div className="caption">
                                <i className="icon-social-dribbble font-dark hide"></i>
                                <span className="caption-subject font-dark bold uppercase">Interacciones con la empresa</span>
                                <h4>{this.state.contact.fullname}</h4>
                            </div>
                        </div>
                        <div className="portlet-body">
                            <div className="messages">
                                <FlashMessages />
                            </div>

                            <div className="table-toolbar">

                                <div className="row">
                                    <div className="col-md-6">                                       
                                    </div>
                                    <div className="col-md-6 text-right">
                                        <div className="btn-group">
                                            <Link to={"/empresas/"+this.state.enterprise_id+"/interacciones/alta?"+query} className='btn sbold green'>                                              
                                                <i className="fa fa-plus"></i> <span> Alta</span>                                
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {
                                (this.props.interactions) && 

                                <BootstrapTable data={this.props.interactions} striped={true} hover={true} 
                                    options={options} search searchPlaceholder='Buscar...' pagination>                                    
                                    {                                        
                                        this.state.columns.map((col, index)=>{
                                           
                                            return <TableHeaderColumn 
                                                key={index}
                                                dataField={col.field} 
                                                isKey={col.isKey}
                                                width={col.width}
                                                dataAlign={col.dataAlign}
                                                dataSort={_.isNil(col.sort) ? true : col.sort}
                                                dataFormat={col.formatter}
                                                sortFunc={col.sortFunc}
                                                formatExtraData={col}
                                                >{col.title}</TableHeaderColumn>
                                        })
                                    }
                                </BootstrapTable>
                            }
                        </div>
                    </div>
                </div>                
            </div>
        );
    }
}

export default withRouter(EnterpriseInteractions)
