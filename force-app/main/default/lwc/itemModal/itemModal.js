import { LightningElement, api } from 'lwc';
import LightningModal from 'lightning/modal';

import NAME_FIELD from '@salesforce/schema/Item__c.Name';
import TYPE_FIELD from '@salesforce/schema/Item__c.Type__c';
import FAMILY_FIELD from '@salesforce/schema/Item__c.Family__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Item__c.Description__c';
import PRICE_FIELD from '@salesforce/schema/Item__c.Price__c';
import IMAGE_FIELD from '@salesforce/schema/Item__c.Image__c';

export default class ItemModal extends LightningModal {
    @api content;

    nameField = NAME_FIELD;
    typeField = TYPE_FIELD;
    familyField = FAMILY_FIELD;
    descriptionField = DESCRIPTION_FIELD;
    priceField = PRICE_FIELD;
    imageField = IMAGE_FIELD;

    handleClose() {
        this.close('close');
    }
}