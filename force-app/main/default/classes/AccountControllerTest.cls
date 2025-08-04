@IsTest
private class AccountControllerTest {
    @IsTest
    static void testGetAccountData() {
        Account acc = new Account(Name = 'Test Account', AccountNumber = '12345', Industry = 'Technology');
        insert acc;

        Account result = AccountController.getAccountData(acc.Id);
        System.assertEquals(acc.Name, result.Name);
        System.assertEquals(acc.AccountNumber, result.AccountNumber);
        System.assertEquals(acc.Industry, result.Industry);
    }
}
