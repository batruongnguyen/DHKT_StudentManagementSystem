/**
 * @description       :
 * @author            : Ba Truong Nguyen
 * @group             :
 * @last modified on  : 06-16-2023
 * @last modified by  : Ba Truong Nguyen
 **/
public without sharing class DHKT_StudentAppController {
  @AuraEnabled
  public static String getStudentInfoForCurrentUser() {
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
          CreatedDate,
          Activity_Class__c,
          Faculty__c,
          Major__c,
          Date_of_Birth__c,
          Phone_Number__c,
          Email__c,
          Student_Name__c,
          CreatedById,
          (
            SELECT
              Id,
              Name,
              CreatedDate,
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
              Faculty_Name__c,
              Day_of_Birth__c,
              Class_Name__c,
              Student_Name__c,
              Phone_Number__c,
              Email__c,
              Reason__c,
              Cumulative_Credits__c,
              Report_Registration_Method__c,
              Is_My_Request__c
            FROM Requests__r
            ORDER BY CreatedDate DESC
          )
        FROM DHKT_Student__c
        WHERE Email__c = :currentUser.Email
        ORDER BY Id DESC
        LIMIT 1
      ];
      return JSON.serialize(student);
    } catch (Exception e) {
      System.debug('Cannot get student infomation: ' + e.getMessage());
      return null;
    }
  }

  @AuraEnabled
  public static string getNotifications() {
    try {
      DHKT_Student__c student = DHKT_RequestController.getCurrentUserData();

      Notification notifications = new Notification();
      List<DHKT_Notification__c> notificationQueries = [
        SELECT
          Id,
          Name,
          CreatedDate,
          Student__c,
          Teacher__c,
          Faculty__c,
          Body__c,
          From__c,
          Title__c,
          Activity_Class__c,
          Body_Plain_Text__c
        FROM DHKT_Notification__c
        WHERE
          Faculty__c = :student.Faculty__c
          OR Activity_Class__c = :student.Activity_Class__c
          OR Student__c = :student.Id
        ORDER BY CreatedDate DESC
      ];
      List<DHKT_Notification__c> facultyNotifications = new List<DHKT_Notification__c>();
      List<DHKT_Notification__c> classNotifications = new List<DHKT_Notification__c>();
      List<DHKT_Notification__c> personalNotifications = new List<DHKT_Notification__c>();
      for (DHKT_Notification__c noti : notificationQueries) {
        if (noti.Faculty__c == student.Faculty__c) {
          facultyNotifications.add(noti);
        } else if (noti.Activity_Class__c == student.Activity_Class__c) {
          classNotifications.add(noti);
        } else if (noti.Student__c == student.Id) {
          personalNotifications.add(noti);
        }
      }
      notifications.facultyNotifications = facultyNotifications;
      notifications.classNotifications = classNotifications;
      notifications.personalNotifications = personalNotifications;
      System.debug('List Notifications: ' + notifications);
      return JSON.serialize(notifications);
    } catch (Exception e) {
      System.debug('Error getting notification: ' + e.getMessage());
      return null;
    }
  }

  @AuraEnabled
  public static string getStudentInfo() {
    try {
      DHKT_Student__c student = DHKT_RequestController.getCurrentUserData();
      return JSON.serialize(student);
    } catch (Exception e) {
      System.debug('Cannot get student infomation: ' + e.getMessage());
      return null;
    }
  }

  public class Notification {
    public List<DHKT_Notification__c> facultyNotifications;
    public List<DHKT_Notification__c> classNotifications;
    public List<DHKT_Notification__c> personalNotifications;
  }
  public class Request {
    public List<DHKT_Request__c> requests;
  }
}
