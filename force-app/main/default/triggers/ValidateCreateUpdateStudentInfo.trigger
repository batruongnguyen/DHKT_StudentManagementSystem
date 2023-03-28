/**
 * @description       :
 * @author            : Ba Truong Nguyen
 * @group             :
 * @last modified on  : 03-26-2023
 * @last modified by  : Ba Truong Nguyen
 **/
trigger ValidateCreateUpdateStudentInfo on DHKT_Student__c(
  before insert,
  before update
) {
  for (DHKT_Student__c student : Trigger.new) {
    if (student.Major__c != null) {
      DHKT_Major__c major = [
        SELECT Id, Faculty__c
        FROM DHKT_Major__c
        WHERE Id = :student.Major__c
      ];
      if (
        major != null &&
        student.Faculty__c != null &&
        student.Faculty__c != major.Faculty__c
      ) {
        student.Faculty__c.addError('This major is not in faculty.');
      }
    }

    if (student.Activity_Class__c != null) {
      DHKT_Activity_Class__c activityClass = [
        SELECT Id, Faculty__c
        FROM DHKT_Activity_Class__c
        WHERE Id = :student.Activity_Class__c
      ];
      if (
        activityClass != null &&
        activityClass.Faculty__c != null &&
        student.Faculty__c != null &&
        student.Faculty__c != activityClass.Faculty__c
      ) {
        student.Activity_Class__c.addError('This class is not in faculty.');
      }
    } else {
      student.Activity_Class__c.addError('Please choose your class.');
    }
  }
}
