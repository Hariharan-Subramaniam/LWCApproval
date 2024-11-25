import { LightningElement, wire, track } from 'lwc';
import getApprovalPendingRecords from '@salesforce/apex/ApprovalProcess.getApprovalPendingRecords';
import{ ShowToastEvent } from 'lightning/platformShowToastEvent';
import{ NavigationMixin } from 'lightning/navigation';

export default class ApprovalProcess extends LightningElement {
    @track approvalList = [];
    @track selectedTab = 'Opportunity';
    actions = [
        { label: 'Show Details', name: 'view' },
        { label: 'Edit', name: 'edit' }
    ];
    get opportunityColumns() {
        return [
            { label: 'Name', fieldName: 'opportunityName', type: 'text' },
            { label: 'Amount', fieldName: 'amount', type: 'text' },
            { label: 'Stage', fieldName: 'stage', type: 'text' },
            { label: 'Status', fieldName: 'approvalStatus', type: 'text' },
            { label: 'Submitted By', fieldName: 'submittedBy', type: 'text' },
            { label : 'actions',
                type: 'action',
                typeAttributes: {
                    rowActions: this.actions,
                    menuAlignment: 'right'
                }
            }
        ]
    }

    @wire(getApprovalPendingRecords)
    wiredapprovalRecords({ data, error }) {
        if (data) {
            this.approvalList = data;
            console.log('Data is :' + JSON.stringify(data));
        } else if (error) {
            console.log('Error is :' + JSON.stringify(error));
        }
    }

    handleTabChange(event) {
        this.selectedTab = event.target.value;
        console.log('Selected Tab is :' + this.selectedTab);
    }

    get filteredApprovalListData() {
        return this.approvalList.filter(record => {
            if (this.selectedTab === 'Opportunity' && record.stage !== null) {
                return true;
            } else if (this.selectedTab === 'Account' && record.accountName !== null) {
                return true;
            } else if (this.selectedTab === 'Case' && record.subject !== null) {
                return true;
            }
            return false;
        })
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        alert(row);
        switch ( actionName ) {
            case 'view':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.recordId,
                        actionName: 'view'
                    }
                });
                break;
            case 'edit':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.recordId,
                        //objectApiName: 'Account',
                        actionName: 'edit'
                    }
                });
                break;
            default:
        }
    }
}