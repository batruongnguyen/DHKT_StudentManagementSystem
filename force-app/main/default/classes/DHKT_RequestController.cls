/**
 * @description       :
 * @author            : Ba Truong Nguyen
 * @group             :
 * @last modified on  : 04-02-2023
 * @last modified by  : Ba Truong Nguyen
 **/
public with sharing class DHKT_RequestController {
  @AuraEnabled
  public static List<DHKT_Request__c> getRequest(String recordId) {
    try {
      return [
        SELECT
          Id,
          Name,
          Major__c,
          Faculty__c,
          Student__c,
          Due_date__c,
          Note__c,
          Reject_Reason__c,
          Return_Date__c,
          Submitting_Date__c,
          Request_Header__c,
          Request_Type__c,
          Request_Status__c,
          (
            SELECT
              Id,
              Name,
              Facility_Name__c,
              Zone_Area__c,
              Classroom__c,
              Facility_Code__c
            FROM Facilities__r
          )
        FROM DHKT_Request__c
        WHERE Id = :recordId
      ];
    } catch (Exception e) {
      throw new AuraHandledException(
        'Can not get request data: ' + e.getMessage()
      );
    }
  }

  @AuraEnabled
  public static List<DHKT_Facility__c> getFacilityRecords(String requestId) {
    try {
      return [
        SELECT
          Id,
          Name,
          Facility_Name__c,
          Zone_Area__c,
          Classroom__c,
          Facility_Code__c
        FROM DHKT_Facility__c
        WHERE Request__c = :requestId
      ];
    } catch (Exception e) {
      throw new AuraHandledException(
        'Can not get facility data: ' + e.getMessage()
      );
    }
  }

  @AuraEnabled
  public static List<DHKT_Facility__c> getFacilityOptions(String requestId) {
    try {
      return [
        SELECT Facility_Code__c
        FROM DHKT_Facility__c
        WHERE
          Request__c = :requestId
          OR Request__c = NULL
          OR Request__r.Request_Status__c = 'Finalized'
      ];
    } catch (Exception e) {
      throw new AuraHandledException(
        'Can not get facility options: ' + e.getMessage()
      );
    }
  }

  @AuraEnabled
  public static DHKT_Student__c getCurrentUserData() {
    try {
      String currentUserId = UserInfo.getUserId();
      User currentUser = [
        SELECT Id, Name, Profile.Name, Email
        FROM User
        WHERE Id = :currentUserId
      ];
      String studentName = '%' + currentUser?.Name + '%';

      DHKT_Student__c student = [
        SELECT
          Id,
          Name,
          Activity_Class__c,
          Class_Name__c,
          Faculty__c,
          Faculty_Name__c,
          Major__c,
          Major_Name__c,
          Date_of_Birth__c,
          Phone_Number__c,
          Email__c,
          Student_Name__c,
          Subject__c
        FROM DHKT_Student__c
        WHERE Email__c = :currentUser.Email
        ORDER BY CreatedDate DESC
        LIMIT 1
      ];
      return student;
    } catch (Exception e) {
      System.debug('Fail to get Student Information: ' + e.getMessage());
      return null;
    }
  }

  @AuraEnabled
  public static Boolean saveFacilityOptions(
    String facilitiesArray,
    String requestId
  ) {
    System.debug('facilitiesArray: ' + facilitiesArray);
    System.debug('requestId: ' + requestId);

    try {
      List<Facility> facilities = (List<Facility>) JSON.deserialize(
        facilitiesArray,
        List<Facility>.class
      );
      System.debug('facilities: ' + facilities);

      for (Facility facility : facilities) {
        DHKT_Facility__c f = [
          SELECT
            Id,
            Name,
            Facility_Name__c,
            Zone_Area__c,
            Classroom__c,
            Request__c,
            Facility_Code__c
          FROM DHKT_Facility__c
          WHERE Facility_Code__c = :facility.facilityCode
        ];
        f.Facility_Name__c = facility.facilityName;
        f.Zone_Area__c = facility.zoneArea;
        f.Classroom__c = facility.classroom;
        f.Request__c = requestId;
        update f;
      }
      return true;
    } catch (Exception e) {
      System.debug('Fail to save this Request: ' + e.getMessage());
      return false;
    }
  }

  public class Facility {
    public String facilityCode { get; set; }
    public String facilityName { get; set; }
    public String zoneArea { get; set; }
    public String classroom { get; set; }
  }
}
