import { LightningElement, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import CartModal from 'c/cartModal';
import { subscribe, MessageContext } from 'lightning/messageService';
import CART_MESSAGE from '@salesforce/messageChannel/CartMessage__c';
import isCurrentUserManager from '@salesforce/apex/UserController.isCurrentUserManager';
import { CurrentPageReference } from 'lightning/navigation';
import getAccountData from '@salesforce/apex/AccountController.getAccountData';



export default class HeaderLwc extends NavigationMixin(LightningElement) {
  result;
  error;
  cart = [];
  isManager = false;
  recordId;
  account;

  @wire(MessageContext) messageContext;

  @wire(CurrentPageReference)
  getStateParameters(currentPageReference) {
      if (currentPageReference) {
          this.recordId = currentPageReference.state?.c__recordId;
          console.log('Received recordId:', this.recordId);
      }
  }

  @wire(getAccountData, { accountId: '$recordId' })
  wiredAccount({ data, error }) {
      if (data) {
          this.account = data;
          console.log('Account data:', data);
      } else if (error) {
          console.error('Error loading account:', error);
      }
  }

  connectedCallback() {
      isCurrentUserManager()
            .then(result => {
                this.isManager = result;
            })
            .catch(error => {
                console.error('Error getting IsManager__c:', error);
            });
      this.subscription = subscribe(
          this.messageContext,
          CART_MESSAGE,
          (message) => {
              this.handleCartMessage(message);
          }
      );
  }

  handleCartMessage(message) {
    if (message.cartItems?.length) {
        this.cart = this.cart.concat(message.cartItems);
    }
  }


  handleCreate() {
    this[NavigationMixin.Navigate]({
      type: 'standard__objectPage',
      attributes: {
        objectApiName: 'Item__c',
        actionName: 'new'
      }
    });
  }

  async goToCart() {
    const result = await CartModal.open({
            size: 'medium',
            content: this.cart,
            recordId: this.recordId
        });
    if (result) {
      this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
          recordId: result,
          objectApiName: 'Purchase__c',
          actionName: 'view'
        }
      });
    }
  }
}