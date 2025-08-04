public with sharing class ItemController {
        
    public class Filters {
        @AuraEnabled
        public String searchKey { get; set; }
        @AuraEnabled
        public String[] types { get; set; }
        @AuraEnabled
        public String[] families { get; set; }
    }

    @AuraEnabled(cacheable=true)
    public static List<Item__c> getItems(Filters filters) {
        List<String> criteria = new List<String>();
        
        if (filters != null) {
            if (!String.isEmpty(filters.searchKey)) {
                String escapedKey = '%' + String.escapeSingleQuotes(filters.searchKey) + '%';
                criteria.add('(Name LIKE \'' + escapedKey + '\' OR Description__c LIKE \'' + escapedKey + '\')');
            }
            
            if (filters.types != null && !filters.types.isEmpty()) {
                List<String> escapedTypes = new List<String>();
                for (String t : filters.types) {
                    escapedTypes.add('\'' + String.escapeSingleQuotes(t) + '\'');
                }
                criteria.add('Type__c IN (' + String.join(escapedTypes, ',') + ')');
            }
            
            if (filters.families != null && !filters.families.isEmpty()) {
                List<String> escapedFamilies = new List<String>();
                for (String f : filters.families) {
                    escapedFamilies.add('\'' + String.escapeSingleQuotes(f) + '\'');
                }
                criteria.add('Family__c IN (' + String.join(escapedFamilies, ',') + ')');
            }
        }
        
        String whereClause = '';
        if (!criteria.isEmpty()) {
            whereClause = ' WHERE ' + String.join(criteria, ' AND ');
        }
        
        String query = 'SELECT Id, Name, Description__c, Type__c, Family__c, Image__c, Price__c FROM Item__c' +
                    whereClause +
                    ' WITH USER_MODE ORDER BY Name';
        
        return Database.query(query);
    }

    @AuraEnabled
    public static void updateItemImage(Id itemId, String imageUrl) {
        if (String.isBlank(itemId) || String.isBlank(imageUrl)) return;

        Item__c item = [SELECT Id, Image__c FROM Item__c WHERE Id = :itemId LIMIT 1];
        item.Image__c = imageUrl;
        update item;
    }

}