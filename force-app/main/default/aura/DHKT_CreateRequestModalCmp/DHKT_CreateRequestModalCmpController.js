/**
 * @description       :
 * @author            : Ba Truong Nguyen
 * @group             :
 * @last modified on  : 03-25-2023
 * @last modified by  : Ba Truong Nguyen
 **/
({
  init: function (cmp, event, helper) {
    var recordId = cmp.get("v.recordId");
    if (!recordId) {
      helper.getCurrentUserData(cmp, event, helper);
    }
  },
  requestRecordUpdated: function (component, event, helper) {
    console.log("requestRecordUpdated...");
    var recordUpdated = cmp.get("v.requestRecords");
    console.log("recordUpdated; ", recordUpdated);
  },
  onRecordLoad: function (cmp, event, helper) {
    console.log("onRecordLoad...");
    var fields = event.getParam("recordUi").record.fields;
  },
  onCreateSuccess: function (cmp, event, helper) {
    var msg = "Submit Request successfully.";
    helper.showToast("success", msg);
    $A.get("e.force:refreshView").fire();
  },
  onCreateError: function (cmp, event, helper) {
    // Get the error message
    var errorMsg = event.getParam("message");
    helper.showToast("error", errorMsg);
    $A.get("e.force:refreshView").fire();
  },
  onSave: function (cmp, event, helper) {
    console.log("onSave...");
    event.preventDefault();
    const fields = event.getParam("fields");
    // helper.validate(cmp) &&
    cmp.find("recordEditForm").submit();
    cmp.find("recordForm").submit(fields);
  },
  onCancel: function (cmp, event, helper) {
    helper.closeCompletely(cmp, event, helper);
  },
  onCreateSuccess: function (cmp, event, helper) {
    var msg = "Create new request successfully.";
    var recordId = cmp.get("v.recordId");
    var detailedURL = "";
    if (recordId) {
      msg = "Save work request successfully.";
      detailedURL = "/lightning/r/CM_Work_Request__c/" + recordId + "/view";
      console.log("detailedURL: ", detailedURL);
    } else {
      var payload = event.getParams().response;
      detailedURL = "/lightning/r/CM_Work_Request__c/" + payload.id + "/view";
      console.log("detailedURL: ", detailedURL);
    }
    var toastEvent = $A.get("e.force:showToast");
    toastEvent.setParams({
      type: "success",
      message: msg
    });
    toastEvent.fire();
    var urlEvent = $A.get("e.force:navigateToURL");
    urlEvent.setParams({
      url: detailedURL
    });
    urlEvent.fire();
  }
});
