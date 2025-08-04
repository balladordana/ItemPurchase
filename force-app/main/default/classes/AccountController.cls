public with sharing class AccountController {
    @AuraEnabled(cacheable=true)
    public static Account getAccountData(Id accountId) {
        Account currentAccount = [
            SELECT Name, AccountNumber, Industry
            FROM Account
            WHERE Id = :accountId
            LIMIT 1
        ];
        return currentAccount;
    }
}