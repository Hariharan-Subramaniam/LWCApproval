import { LightningElement, wire, api } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

const FIELDS = ['Opportunity.Owner.Name'];

export default class RecordOwnerName extends LightningElement {
    @api recordId;  
    ownerName;  
    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredData({ data, error }) {
        if (data) {
            console.log('Fetched Data:', JSON.stringify(data));
            this.ownerName = data.fields.Owner.displayValue;
        } else if (error) {
            console.log('Wired data error:', error);
        }
    }
}
