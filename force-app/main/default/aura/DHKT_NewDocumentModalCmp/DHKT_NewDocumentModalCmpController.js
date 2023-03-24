/**
 * @description       :
 * @author            : Ba Truong Nguyen
 * @group             :
 * @last modified on  : 03-24-2023
 * @last modified by  : Ba Truong Nguyen
 **/
({
  onSave: function (cmp, event, helper) {
    event.preventDefault();
    if (helper.validate(cmp)) {
      cmp.find("recordEditForm").submit();
    } else {
      var toastEvent = $A.get("e.force:showToast");
      toastEvent.setParams({
        type: "error",
        message: "Please fill in all required fields."
      });
      toastEvent.fire();
    }
  },
  onSaveAndNew: function (cmp, event, helper) {
    event.preventDefault();
    if (helper.validate(cmp)) {
      cmp.set("v.isSaveAndNew", true);
      cmp.find("recordEditForm").submit();
    }
  },
  onCancel: function (cmp, event, helper) {
    cmp.set("v.isModalOpen", false);
    helper.onClose(cmp, event, helper);
  },
  onCreateSuccess: function (cmp, event, helper) {
    var msg = "Add Document successfully.";
    if (cmp.get("v.recordId")) {
      msg = "Save Document successfully.";
    }
    var toastEvent = $A.get("e.force:showToast");
    toastEvent.setParams({
      type: "success",
      message: msg
    });
    toastEvent.fire();
    var isSaveAndNew = cmp.get("v.isSaveAndNew");
    cmp.set("v.isSaveAndNew", false);
    var parent = cmp.get("v.parent");
    if (parent != undefined) {
      parent.refreshParentView();
    }
    if (!isSaveAndNew) {
      cmp.set("v.isModalOpen", false);
      helper.onClose(cmp, event, helper);
    } else {
      console.log("save and new");
      // reset fields
      cmp.set("v.documentURL", null);
      cmp.set("v.documentDescription", null);
    }
  },
  onCreateError: function (cmp, event, helper) {
    var error = event.getParams();
    console.log("error: ", JSON.stringify(error));

    var toastEvent = $A.get("e.force:showToast");
    toastEvent.setParams({
      type: "error",
      message: error.message
    });
    toastEvent.fire();
  },
  onRecordLoad: function (cmp, event, helper) {
    var fields = event.getParam("recordUi").record.fields;
    if (fields) {
      if (!cmp.get("v.documentType")) {
        cmp.set("v.documentType", fields.Type__c.value);
      }
      console.log("documentType: ", JSON.stringify(cmp.get("v.documentType")));
      cmp.set("v.documentURL", fields.Document_URL__c.value);
      cmp.set("v.documentDescription", fields.Description__c.value);
    }
  }
});
