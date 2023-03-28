/**
 * @description       :
 * @author            : Ba Truong Nguyen
 * @group             :
 * @last modified on  : 03-25-2023
 * @last modified by  : Ba Truong Nguyen
 **/
trigger DHKT_RequestTriggerHandler on DHKT_Request__c(after update) {
  if (Trigger.isUpdate) {
    List<User> systemUsers = [
      SELECT id
      FROM User
      WHERE Profile.UserLicense.Name = 'Salesforce' AND IsActive = TRUE
    ];
    Set<String> userIds = new Set<String>();
    for (User user : systemUsers) {
      userIds.add(user.Id);
    }

    for (DHKT_Request__c req : Trigger.new) {
      if (
        req.Request_Status__c == 'Approved' ||
        req.Request_Status__c == 'Rejected'
      ) {
        String currentUser =
          UserInfo.getFirstName() +
          ' ' +
          UserInfo.getLastName();
        String status = req.Request_Status__c == 'Approved'
          ? 'approved'
          : 'rejected';
        String body =
          'Request ' +
          req.Name +
          ' was ' +
          status +
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
