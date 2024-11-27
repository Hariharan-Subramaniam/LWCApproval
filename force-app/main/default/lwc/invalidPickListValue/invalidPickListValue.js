import { LightningElement, api, wire } from 'lwc';
import { getRecord} from 'lightning/uiRecordApi';
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity';
import TEST_FIELD from '@salesforce/schema/Opportunity.Test_Filed__c';
//import { getObjectInfo } from 'lightning/uiObjectInfoApi';

const FIELDS = ['Opportunity.Test_Filed__c'];
export default class InvalidPickListValue extends LightningElement {
    @api recordId;
    assignedValue;
    recordTypeId;
    picklistValues;
    
    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredRecord({ data, error }) {
        if (data) {
            this.assignedValue = data.fields.Test_Filed__c.value;
            this.recordTypeId = data.recordTypeId;
            console.log('this.recordTypeId :', this.recordTypeId);
            console.log('fetched data : ', JSON.stringify(data));
            console.log('fetched data : ', JSON.stringify(data.fields.Test_Filed__c.value));
        }else if (error) {
                 console.log('error in fetching data : ', error);
             }
         }
     
      @wire(getPicklistValues, { recordTypeId: '$recordTypeId', fieldApiName: TEST_FIELD })
wiredPicklist({ data, error }) {
    if (data) {
        console.log('Fetched Picklist Data:', JSON.stringify(data));

        // Map to extract labels
        this.picklistValues = data.values.map(item => {
            console.log('Mapping Item:', item);
            return item.label;
        });

        this.picklistValues = JSON.stringify(this.picklistValues);
        console.log('Picklist Values as JSON:',this.picklistValues);
    } else if (error) {
        console.error('Error fetching picklist values:', error);
    }
}

    }
