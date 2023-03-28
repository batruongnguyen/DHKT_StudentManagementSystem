/**
 * @description       :
 * @author            : Ba Truong Nguyen
 * @group             :
 * @last modified on  : 03-25-2023
 * @last modified by  : Ba Truong Nguyen
 **/
public with sharing class DHKT_ActionRequestController {
  @AuraEnabled
  public static String handleSubmitRequest(Id requestId) {
    String error = null;

    try {
      DHKT_Request__c req = [
        SELECT Id, Name, Request_Status__c, Submitting_Date__c
        FROM DHKT_Request__c
        WHERE Id = :requestId
      ];

      if (req != null) {
        Date todaysDate = System.Today();
        req.Request_Status__c = 'Submitted';
        req.Submitting_Date__c = todaysDate;

        update req;
      }
    } catch (Exception e) {
      error = 'Failed to submit Request. Error: ' + e.getMessage();
    }
    return error;
  }

  @AuraEnabled
  public static String handleApproveRequest(Id requestId, String note) {
    String error = null;

    try {
      DHKT_Request__c req = [
        SELECT Id, Name, Request_Status__c, Note__c
        FROM DHKT_Request__c
        WHERE Id = :requestId
      ];

      if (req != null) {
        req.Request_Status__c = 'Approved';
        req.Note__c = note;

        update req;
      }
    } catch (Exception e) {
      error = 'Failed to approve Request. Error: ' + e.getMessage();
    }
    return error;
  }

  @AuraEnabled
  public static String handleRejectRequest(Id requestId, String reason) {
    String error = null;

    try {
      DHKT_Request__c req = [
        SELECT Id, Name, Request_Status__c, Reject_Reason__c
        FROM DHKT_Request__c
        WHERE Id = :requestId
      ];

      if (req != null) {
        req.Request_Status__c = 'Rejected';
        req.Reject_Reason__c = reason;

        update req;
      }
    } catch (Exception e) {
      error = 'Failed to reject Request. Error: ' + e.getMessage();
    }
    return error;
  }
}
