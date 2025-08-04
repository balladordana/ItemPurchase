import { LightningElement, api } from 'lwc';
import LightningModal from 'lightning/modal';
import { NavigationMixin } from 'lightning/navigation';
import createPurchaseWithLines from '@salesforce/apex/PurchaseController.createPurchaseWithLines';

export default class CartModal extends NavigationMixin(LightningModal) {
    @api content;

    get groupedCart() {
        const map = new Map();
        this.content.forEach(item => {
            if (map.has(item.Id)) {
                map.get(item.Id).quantity += 1;
            } else {
                map.set(item.Id, { ...item, quantity: 1 });
            }
        });
        return Array.from(map.values());
    }

    handleCheckout() {
        const itemsWithQuantities = this.groupedCart.map(group => ({
            itemId: group.Id,
            price: group.Price__c,
            quantity: group.quantity
        }));

        createPurchaseWithLines({ cartItems: itemsWithQuantities })
            .then(result => {
                this.close(result);
            })
            .catch(error => {
                console.error('Ошибка создания покупки', error);
            });
    }

}