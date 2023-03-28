/**
 * @description       :
 * @author            : Ba Truong Nguyen
 * @group             :
 * @last modified on  : 03-26-2023
 * @last modified by  : Ba Truong Nguyen
 **/
public with sharing class DHKT_RequestController {
  @AuraEnabled
  public static List<DHKT_Request__c> getRequest() {
    try {
      return [SELECT Id, Name FROM DHKT_Request__c WITH SECURITY_ENFORCED];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled
  public static DHKT_Student__c getCurrentUserData() {
    try {
      String currentUserId = UserInfo.getUserId();
      User currentUser = [
        SELECT Id, Name, Profile.Name
        FROM User
        WHERE Id = :currentUserId
        WITH SECURITY_ENFORCED
      ];
      String studentName = '%' + currentUser?.Name + '%';

      DHKT_Student__c student = [
        SELECT
          Id,
          Name,
          Student_Name__c,
          Date_of_Birth__c,
          // Class__c,
          Phone_Number__c,
          Email__c
        FROM DHKT_Student__c
        WHERE Student_Name__c LIKE :studentName
        ORDER BY CreatedDate DESC
        LIMIT 1
      ];
      return student;
    } catch (Exception e) {
      System.debug('Fail to get Student Information: ' + e.getMessage());
      return null;
    }
  }
}
