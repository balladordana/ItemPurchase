public with sharing class PurchaseController {
    public class CartItemInput {
        @AuraEnabled public String itemId { get; set; }
        @AuraEnabled public Decimal price { get; set; }
        @AuraEnabled public Integer quantity { get; set; }
    }

    @AuraEnabled
    public static Id createPurchaseWithLines(List<CartItemInput> cartItems, Id accountId) {
        if (cartItems == null || cartItems.isEmpty()) {
            throw new AuraHandledException('Cart is empty');
        }

        Purchase__c purchase = new Purchase__c();
        purchase.ClientId__c = accountId;
        insert purchase;

        List<PurchaseLine__c> lines = new List<PurchaseLine__c>();
        for (CartItemInput ci : cartItems) {
            lines.add(new PurchaseLine__c(
                PurchaseId__c = purchase.Id,
                ItemId__c = ci.itemId,
                Amount__c = ci.quantity,
                UnitCost__c = ci.price
            ));
        }
        insert lines;

        return purchase.Id;
    }

}