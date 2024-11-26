import { LightningElement, wire, track } from 'lwc';
import getApprovalPendingRecords from '@salesforce/apex/ApprovalProcess.getApprovalPendingRecords';
import{ ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

//define row actions
const actions = [
{ label: 'Show Details', name: 'view'},
{ label: 'Delete', name: 'delete'}
];
export default class ApprovalProcess extends NavigationMixin(LightningElement) {
    @track approvalList = [];
    @track selectedTab = 'Opportunity';
   /* actions = [
        { label: 'Show Details', name: 'view' },
        { label: 'Edit', name: 'edit' }
    ]; */
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
                    rowActions: actions,
                    menuAlignment: 'auto'
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
        //const actionName = event.detail.action.name;
        const actionName = event.detail.action.name;
        console.log('Action Name => :', actionName);
        //alert('Action Name => :', actionName);
        const recordId = event.detail.row.recordId;
        alert(recordId);
        switch(actionName) {
            case'view':
                console.log('inside view case');
                this[NavigationMixin.Navigate]({
                    type: "standard__recordPage",
                    attributes: {
                        recordId: recordId,
                        objectApiName: "Opportunity", // objectApiName is optional
                        actionName: "view",
                    },
                    });
                break;
            case 'delete':
                console.log('inside delete case');
                /*this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: recordId,
                        objectApiName: "Opportunity",
                        actionName: 'edit'
                    }
                }); */
                break;
            default:
                alert('no action');
                break;
        }
    }
}