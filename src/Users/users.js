import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios'
import Spinner from '../spinner/Spinner'
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import {Messages} from 'primereact/messages';
import {Message} from 'primereact/message';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './users.css'

class Users extends Component {
    state = {
        users: [],
        error: false,
        loading: true,
        selectedRows: []
    }
    componentDidMount() {
        axios.get('https://evolent-test.firebaseio.com/users.json').then(res => {
            console.log(res);
            this.setState({ users: res.data, error: false, loading: false })

        }).catch(err => {
            console.log(err);
            this.setState({ users: [], error: true, loading: false })
        })

    }

    fNameEditor = (props) => {
        return <InputText type="text"
            value={props.rowData.firstName}
            onChange={(e) => {
                let newData = this.state.users;
                newData[props.rowIndex].firstName = e.target.value;
                this.setState({ users: newData });
            }} />;
    }

    lNameEditor = (props) => {
        return <InputText type="text"
            value={props.rowData.lastName}
            onChange={(e) => {
                let newData = this.state.users;
                newData[props.rowIndex].lastName = e.target.value;
                this.setState({ users: newData });
            }} />;
    }

    emailEditor = (props) => {
        return <InputText type="text"
            value={props.rowData.email}
            onChange={(e) => {
                let newData = this.state.users;
                newData[props.rowIndex].email = e.target.value;
                this.setState({ users: newData });
            }} />;
    }

    phoneEditor = (props) => {
        return <InputText type="number"
            value={props.rowData.phNo}
            onChange={(e) => {
                let newData = this.state.users;
                newData[props.rowIndex].phNo = e.target.value;
                this.setState({ users: newData });
            }} />;
    }

    addRows = () => {
        let newData = this.state.users;
        let temp = {
            id: newData[newData.length - 1].id + 1,
            firstName: '',
            lastName: '',
            email: '',
            phNo: '',
            status: ''
        }

        newData.push(temp);
        this.setState({ users: newData });

    }

    deleteRows = () => {
        let newData = this.state.users;
        console.log(this.state.selectedRows)
        for (let j = 0; j < this.state.selectedRows.length; j++) {
            newData.splice(newData.indexOf(this.state.selectedRows[j]), 1)
        }
        console.log(newData)
        this.setState({ users: newData, selectedRows: [] });
    }

    updateTable = () => {
        this.setState({ loading: true });
        axios.put('https://evolent-test.firebaseio.com/users.json', this.state.users).then(res => {
            if (res.status === 200) {
                this.setState({ loading: false, users: res.data })
                this.messages.show({severity: 'success', summary: 'Success Message', detail: 'User submitted'});
            } else {
                this.setState({ loading: false, error: true })
                this.messages.show({severity: 'error', summary: 'Error Message', detail: 'Update failed'})
            }
            console.log(res)
        }).catch(err => {
            this.setState({ loading: false, error: true })
            this.messages.show({severity: 'error', summary: 'Error Message', detail: 'Update failed'})
            console.log(err)
        })
    }

    statusEditor = (props) => {
        let statusArr = [
            { label: 'Active', value: 'Active' },
            { label: 'Inactive', value: 'Inactive' }
        ];

        return <Dropdown
            value={props.rowData.status}
            options={statusArr}
            onChange={(e) => {
                let newData = this.state.users;
                newData[props.rowIndex].status = e.target.value;
                this.setState({ users: newData });
            }}
            style={{ width: '100%' }} placeholder="Status" />
    }
    render() {
        let content;
        if (this.state.loading) {
            content = <Spinner />
        }
        if (this.state.error) {
            content = <h3>Something went wrong!</h3>
        }
        if (this.state.users.length > 0) {
            content = (
                <React.Fragment>
                    <div>
                        <span className='btnclass'>
                            <Button label="Add" icon="pi pi-plus" onClick={this.addRows} />
                        </span>
                        <span className='btnclass'>
                            <Button label="Delete" icon="pi pi-trash" onClick={this.deleteRows}
                                className="p-button-danger" />
                        </span>
                        <span className='btnclass'>
                            <Button label="Update" icon="pi pi-pencil" onClick={this.updateTable}
                                className="p-button-success" />
                        </span>
                    </div>
                    
                    <DataTable value={this.state.users} editable={true}
                        selection={this.state.selectedRows}
                        onSelectionChange={e => this.setState({ selectedRows: e.value })}>
                        <Column selectionMode="multiple" style={{ width: '3em' }} />

                        <Column field="firstName" header="First Name"
                            editor={this.fNameEditor} style={{ height: '2.5em', width: '20%' }} />

                        <Column field="lastName" header="Last Name"
                            editor={this.lNameEditor} style={{ height: '2.5em', width: '20%' }} />

                        <Column field="email" header="emailId" editor={this.emailEditor}
                            style={{ height: '2.5em', width: '25%' }} />

                        <Column field="phNo" header="Phone"
                            editor={this.phoneEditor} style={{ height: '2.5em', width: '20%' }} />

                        <Column field="status" header="Status"
                            editor={this.statusEditor} style={{ height: '2.5em', width: '10%' }} />

                    </DataTable>
                </React.Fragment>
            )
        }
        return (
            <div className="content">
                <Messages ref={(el) => this.messages = el}></Messages>
                {content}
            </div>
        )
    }
}

export default Users;
