@IsTest
private class UserControllerTest {
    @IsTest
    static void testIsCurrentUserManager() {
        User testUser = [SELECT Id, IsManager__c FROM User WHERE Id = :UserInfo.getUserId()];
        Boolean result = UserController.isCurrentUserManager();
        System.assertEquals(testUser.IsManager__c, result);
    }
}
