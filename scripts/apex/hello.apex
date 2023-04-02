String currentUserId = UserInfo.getUserId();
      User currentUser = [
        SELECT Id, Name, Profile.Name, Email
        FROM User
        WHERE Id = '0052w00000DPPGjAAP'
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
          Subject__c,
          CreatedById,
          (SELECT Id, Name, CreatedDate, Student__c FROM Student_Cards__r),
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
              Subject__c,
              Reason__c,
              Cumulative_Credits__c,
              Report_Registration_Method__c,
              Is_My_Request__c
            FROM Requests__r
          )
        FROM DHKT_Student__c
        WHERE Email__c = :currentUser.Email
      ];
      String a = JSON.serialize(student);

      System.debug('student: ' + a );