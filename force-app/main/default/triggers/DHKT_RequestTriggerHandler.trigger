/**
 * @description       :
 * @author            : Ba Truong Nguyen
 * @group             :
 * @last modified on  : 04-01-2023
 * @last modified by  : Ba Truong Nguyen
 **/
trigger DHKT_RequestTriggerHandler on DHKT_Request__c(after update) {
  if (Trigger.isUpdate) {
    DHKT_Request__c reqs = [
      SELECT CreatedById, LastModifiedById
      FROM DHKT_Request__c
      WHERE Id = :Trigger.new[0].Id
    ];
    Set<String> userIds = new Set<String>();
    userIds.add(reqs.CreatedById);

    for (DHKT_Request__c req : Trigger.new) {
      if (
        req.Request_Status__c == 'Approved' ||
        req.Request_Status__c == 'Rejected' ||
        req.Request_Status__c == 'Finalized'
      ) {
        String currentUser =
          UserInfo.getFirstName() +
          ' ' +
          UserInfo.getLastName();
        String status = req.Request_Status__c;
        String body =
          'Request ' +
          req.Name +
          ' was ' +
          status.toLowerCase() +
          ' by ' +
          currentUser;

        List<CustomNotificationType> notificationTypes = [
          SELECT Id, DeveloperName
          FROM CustomNotificationType
          WHERE DeveloperName = 'Request_Notification'
        ];
        Messaging.CustomNotification notification = new Messaging.CustomNotification();
        notification.setTitle('Your request was updated');
        notification.setBody(body);
        notification.setNotificationTypeId(notificationTypes[0].Id);
        notification.setTargetId(req.Id);

        try {
          notification.send(userIds);
        } catch (Exception e) {
          System.debug('Problem sending notification: ' + e.getMessage());
        }
      }
    }
  }
}
