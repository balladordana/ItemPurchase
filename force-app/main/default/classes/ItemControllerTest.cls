@IsTest
private class ItemControllerTest {
    @IsTest
    static void testGetItemsAndUpdateImage() {
        Item__c item1 = new Item__c(
            Name = 'Test Item 1', 
            Description__c = 'Description 1', 
            Type__c = 'Smartphone',      // допустимое значение
            Family__c = 'Mobile Devices', // допустимое значение
            Price__c = 10
        );
        Item__c item2 = new Item__c(
            Name = 'Test Item 2', 
            Description__c = 'Description 2', 
            Type__c = 'Laptop',       // допустимое значение
            Family__c = 'Computing',   // допустимое значение
            Price__c = 20
        );
        insert new List<Item__c>{item1, item2};

        ItemController.Filters filters = new ItemController.Filters();
        filters.searchKey = 'Test';
        filters.types = new String[]{'Smartphone'};
        filters.families = new String[]{'Mobile Devices'};

        List<Item__c> items = ItemController.getItems(filters);
        System.assert(!items.isEmpty(), 'Items should be returned');
        System.assertEquals(1, items.size(), 'Only one item should match filter');

        // Test updateItemImage
        String newImageUrl = 'http://example.com/image.jpg';
        ItemController.updateItemImage(item1.Id, newImageUrl);
        Item__c updated = [SELECT Image__c FROM Item__c WHERE Id = :item1.Id];
        System.assertEquals(newImageUrl, updated.Image__c);
    }
}
