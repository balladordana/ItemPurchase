@IsTest
public class PurchaseControllerTest {
    @IsTest
    static void testCreatePurchaseWithLines() {
        // Создаем тестовые данные
        Account acc = new Account(Name = 'Test Account');
        insert acc;

        Item__c item = new Item__c(Name = 'Test Item', Price__c = 100);
        insert item;

        // Создаем объект CartItemInput и заполняем поля
        PurchaseController.CartItemInput cartItem = new PurchaseController.CartItemInput();
        cartItem.itemId = item.Id;
        cartItem.price = 100;
        cartItem.quantity = 2;

        List<PurchaseController.CartItemInput> cartItems = new List<PurchaseController.CartItemInput>{ cartItem };

        // Вызываем тестируемый метод
        Id purchaseId = PurchaseController.createPurchaseWithLines(cartItems, acc.Id);

        // Проверяем, что возвратился Id
        System.assertNotEquals(null, purchaseId);

        // Проверяем, что Purchase был создан с правильным Account
        Purchase__c purchase = [SELECT Id, ClientId__c FROM Purchase__c WHERE Id = :purchaseId];
        System.assertEquals(acc.Id, purchase.ClientId__c);

        // Проверяем строки покупки
        List<PurchaseLine__c> lines = [SELECT ItemId__c, Amount__c, UnitCost__c FROM PurchaseLine__c WHERE PurchaseId__c = :purchaseId];
        System.assertEquals(1, lines.size());
        System.assertEquals(item.Id, lines[0].ItemId__c);
        System.assertEquals(2, lines[0].Amount__c);
        System.assertEquals(100, lines[0].UnitCost__c);
    }
}
