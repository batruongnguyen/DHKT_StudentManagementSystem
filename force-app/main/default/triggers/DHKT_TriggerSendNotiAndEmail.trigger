/**
 * @description       :
 * @author            : Ba Truong Nguyen
 * @group             :
 * @last modified on  : 03-28-2023
 * @last modified by  : Ba Truong Nguyen
 **/
trigger DHKT_TriggerSendNotiAndEmail on DHKT_Notification__c(
  after insert,
  before insert,
  before update
) {
  if (Trigger.isInsert && Trigger.isBefore || Trigger.isUpdate) {
    for (DHKT_Notification__c noti : Trigger.new) {
      String bodyPlainText;
      bodyPlainText = noti.Body__c;
      noti.Body_Plain_Text__c = bodyPlainText.replaceAll('<[^>]+>', '');
    }
  }
  if (Trigger.isAfter) {
    //Get the Notification__c record
    DHKT_Notification__c notification = [
      SELECT
        Id,
        Faculty__c,
        Activity_Class__c,
        Student__r.email__c,
        From__c,
        Title__c,
        Body_Plain_Text__c
      FROM DHKT_Notification__c
      WHERE Id = :Trigger.new[0].Id
    ];

    //Retrieve all email addresses associated with the Student__c object(s)
    Set<String> emailSet = new Set<String>();

    //Input Faculty__c
    if (notification.Faculty__c != null) {
      DHKT_Faculty__c faculty = [
        SELECT Id, (SELECT Email__c FROM Students__r)
        FROM DHKT_Faculty__c
        WHERE Id = :notification.Faculty__c
      ];
      for (DHKT_Student__c student : faculty.Students__r) {
        emailSet.add(student.email__c);
      }
    }

    //Input Activity_Class__c
    if (notification.Activity_Class__c != null) {
      DHKT_Activity_Class__c ac = [
        SELECT Id, (SELECT Email__c FROM Students__r)
        FROM DHKT_Activity_Class__c
        WHERE Id = :notification.Activity_Class__c
      ];
      for (DHKT_Student__c student : ac.Students__r) {
        emailSet.add(student.Email__c);
      }
    }

    //Input Student__c
    if (notification.Student__c != null) {
      DHKT_Student__c student = [
        SELECT Id, Email__c
        FROM DHKT_Student__c
        WHERE Id = :notification.Student__c
      ];
      emailSet.add(student.Email__c);
    }

    //Send email to all retrieved email addresses
    Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
    String emailBody =
      '<html><body><b>' +
      notification.Title__c +
      '</b><br/>' +
      notification.Body_Plain_Text__c +
      '<br/><br/>Best Regard, <br/>' +
      notification.From__c +
      '</body></html>';
    mail.setToAddresses(new List<String>(emailSet));
    mail.setSubject('This notification send by ' + notification.From__c);
    mail.setHtmlBody(emailBody);

    //Send notification to all users matching the email
    Set<User> matchingUsers = new Set<User>();
    for (User u : [SELECT Id, Name, Email FROM User WHERE IsActive = TRUE]) {
      if (emailSet.contains(u.Email)) {
        matchingUsers.add(u);
      }
    }

    //Send notification to all matching users
    Set<String> userIds = new Set<String>();
    for (User u : matchingUsers) {
      userIds.add(u.Id);
    }

    List<CustomNotificationType> notificationTypes = [
      SELECT Id, DeveloperName
      FROM CustomNotificationType
      WHERE DeveloperName = 'Sent_Notification'
    ];
    Messaging.CustomNotification noti = new Messaging.CustomNotification();
    noti.setTitle(notification.Title__c);
    noti.setBody(notification.Body_Plain_Text__c);
    noti.setNotificationTypeId(notificationTypes[0].Id);
    noti.setTargetId(notification.Id);

    try {
      // Send the noti
      noti.send(userIds);
      //Send the email
      Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{ mail });
    } catch (Exception e) {
      System.debug('Problem sending notification: ' + e.getMessage());
    }
  }
}
