import { LightningElement, wire } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';

// Lightning Message Service and a message channel
import { publish, subscribe, MessageContext } from 'lightning/messageService';
import PRODUCTS_FILTERED_MESSAGE from '@salesforce/messageChannel/ProductsFiltered__c';
import PRODUCTS_COUNT_MESSAGE from '@salesforce/messageChannel/ProductsCount__c';

// Product schema
import TYPE_FIELD from '@salesforce/schema/Item__c.Type__c';
import FAMILY_FIELD from '@salesforce/schema/Item__c.Family__c';

export default class ItemFilter extends LightningElement {
    count = 0;
    @wire(MessageContext) messageContext;

    filters = {
        searchKey: ''
    };

    @wire(getPicklistValues, {
        recordTypeId: '012000000000000AAA',
        fieldApiName: TYPE_FIELD
    })
    types;

    @wire(getPicklistValues, {
        recordTypeId: '012000000000000AAA',
        fieldApiName: FAMILY_FIELD
    })
    families;

    connectedCallback() {
        // Subscribe to ProductsFiltered message
        this.itemFilterSubscription = subscribe(
            this.messageContext,
            PRODUCTS_COUNT_MESSAGE,
            (message) => this.handleFilterChange(message)
        );
    }

    handleFilterChange(message) {
        console.error('Count', message.count);
        if (message.count !== undefined) {
            this.count = message.count;
        }
    }


    handleCheckboxChange(event) {
        if (!this.filters.types) {
            // Lazy initialize filters with all values initially set
            this.filters.types = this.types.data.values.map(
                (item) => item.value
            );
            this.filters.families = this.families.data.values.map(
                (item) => item.value
            );
        }
        const value = event.target.dataset.value;
        const filterArray = this.filters[event.target.dataset.filter];
        if (event.target.checked) {
            if (!filterArray.includes(value)) {
                filterArray.push(value);
            }
        } else {
            this.filters[event.target.dataset.filter] = filterArray.filter(
                (item) => item !== value
            );
        }

        publish(this.messageContext, PRODUCTS_FILTERED_MESSAGE, {
            filters: this.filters
        });
    }

}
