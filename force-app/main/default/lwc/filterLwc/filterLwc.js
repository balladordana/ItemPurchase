import { LightningElement, wire } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';

// Product schema
import TYPE_FIELD from '@salesforce/schema/Item__c.Type__c';
import FAMILY_FIELD from '@salesforce/schema/Item__c.Family__c';

// Lightning Message Service and a message channel
import { publish, MessageContext } from 'lightning/messageService';
import PRODUCTS_FILTERED_MESSAGE from '@salesforce/messageChannel/ProductsFiltered__c';

// The delay used when debouncing event handlers before firing the event
const DELAY = 350;

/**
 * Displays a filter panel to search for Product__c[].
 */
export default class ItemFilter extends LightningElement {
    searchKey = '';

    filters = {
        searchKey: ''
    };

    @wire(MessageContext)
    messageContext;

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

    handleSearchKeyChange(event) {
        this.filters.searchKey = event.target.value;
        this.delayedFireFilterChangeEvent();
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
        // Published ProductsFiltered message
        // publish(this.messageContext, PRODUCTS_FILTERED_MESSAGE, {
        //     filters: this.filters
        // });
    }

    // delayedFireFilterChangeEvent() {
    //     // Debouncing this method: Do not actually fire the event as long as this function is
    //     // being called within a delay of DELAY. This is to avoid a very large number of Apex
    //     // method calls in components listening to this event.
    //     window.clearTimeout(this.delayTimeout);
    //     // eslint-disable-next-line @lwc/lwc/no-async-operation
    //     this.delayTimeout = setTimeout(() => {
    //         // Published ProductsFiltered message
    //         publish(this.messageContext, PRODUCTS_FILTERED_MESSAGE, {
    //             filters: this.filters
    //         });
    //     }, DELAY);
    // }
}
