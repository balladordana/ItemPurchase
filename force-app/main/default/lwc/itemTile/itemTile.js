import { LightningElement, api, wire } from 'lwc';
import LightningToast from "lightning/toast";
import ItemModal from 'c/itemModal';
import { publish, MessageContext } from 'lightning/messageService';
import CART_MESSAGE from '@salesforce/messageChannel/CartMessage__c';
import updateItemImage from '@salesforce/apex/ItemController.updateItemImage';
import fetchImageUrl from '@salesforce/apex/UnsplashImageService.fetchImageUrl';


export default class ItemTile extends LightningElement {
    @wire(MessageContext) messageContext;
    _item;
    
    @api
    get item() {
        return this._item;
    }
    set item(value) {
        this._item = value;
        this.name = value.Name;
        this.desc = value.Description__c;
    }

    pictureUrl;
    name;
    desc;

    async handleViewDetails(){
        const result = await ItemModal.open({
            size: 'medium',
            content: this._item,
        });
    }

    handleAddToCart() {
        LightningToast.show(
            {
                label: 'Success',
                message: `Item added to cart`,
                mode: "dismissible",
                variant: "success",
            },
            this,
        );
        publish(this.messageContext, CART_MESSAGE, {
            cartItems: [this._item]  // отправляем 1 товар (можно сделать массив накопительным в другом компоненте)
        });
        console.log(this._item);
    }

    connectedCallback() {
        if (this._item && !this.pictureUrl) {
            fetchImageUrl({ query: this._item.Name })
                .then(url => {
                    this.pictureUrl = url;
                    updateItemImage({ itemId: this._item.Id, imageUrl: url })
                    .then(() => {
                        console.log('Image__c обновлено успешно.');
                    })
                    .catch(error => {
                        console.error('Ошибка при обновлении Image__c:', error);
                    });
                })
                .catch(error => {
                    console.error('Ошибка получения изображения:', error);
                });
        }
    }

}