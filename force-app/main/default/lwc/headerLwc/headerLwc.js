import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class HeaderLwc extends NavigationMixin(LightningElement) {
  handleCreate() {
    this[NavigationMixin.Navigate]({
      type: 'standard__objectPage',
      attributes: {
        objectApiName: 'Item__c',
        actionName: 'new'
      }
    });
  }

  goToCart() {
    // логика перехода в кастомную корзину (если есть)
  }
}