import { LightningElement, api, wire } from 'lwc';

import { publish, subscribe, MessageContext } from 'lightning/messageService';
import PRODUCTS_FILTERED_MESSAGE from '@salesforce/messageChannel/ProductsFiltered__c';
import PRODUCTS_COUNT_MESSAGE from '@salesforce/messageChannel/ProductsCount__c';

import getItems from '@salesforce/apex/ItemController.getItems';

export default class ItemList extends LightningElement {
    searchKey = '';
    filters = {};
    items;      
    itemsError; 

    @wire(MessageContext) messageContext;

    productFilterSubscription;

    @wire(getItems, { filters: '$filters' })
    wiredItems({ data, error }) {
        if (data) {
            this.items = data;
            this.itemsError = undefined;

            publish(this.messageContext, PRODUCTS_COUNT_MESSAGE, {
                count: this.items.length
            });
        } else if (error) {
            this.items = undefined;
            this.itemsError = error;
            publish(this.messageContext, PRODUCTS_COUNT_MESSAGE, {
                count: 0
            });
        }
    }


    connectedCallback() {
        this.itemFilterSubscription = subscribe(
            this.messageContext,
            PRODUCTS_FILTERED_MESSAGE,
            (message) => this.handleFilterChange(message)
        );
    }

    handleSearchKeyChange(event) {
        this.searchKey = event.target.value.toLowerCase();

        this.filters = {
            ...this.filters,
            searchKey: this.searchKey
        };
    }

     handleFilterChange(message) {
        this.filters = {
            ...message.filters,
            searchKey: this.searchKey 
        };
    }

}
