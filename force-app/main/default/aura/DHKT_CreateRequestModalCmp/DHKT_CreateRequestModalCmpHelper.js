/**
 * @description       :
 * @author            : Ba Truong Nguyen
 * @group             :
 * @last modified on  : 03-25-2023
 * @last modified by  : Ba Truong Nguyen
 **/
({
  closeCompletely: function (cmp, event, helper) {
    helper.onClose(cmp, event, helper);
    if (!cmp.get("v.recordId")) {
      var urlEvent = $A.get("e.force:navigateToURL");
      urlEvent.setParams({
        url: "/lightning/o/DHKT_Request__c/home"
      });
      urlEvent.fire();
    } else {
      var urlEvent = $A.get("e.force:navigateToURL");
      urlEvent.setParams({
        url: "/lightning/r/DHKT_Request__c/" + cmp.get("v.recordId") + "/view"
      });
      urlEvent.fire();
    }
  },
  showToast: function (type, message) {
    var toastEvent = $A.get("e.force:showToast");
    toastEvent.setParams({
      type,
      message
    });
    toastEvent.fire();
  },
  validate: function (cmp) {
    var isValid = true;
    var inputFields = cmp.find("inputField");
    for (var i = 0; i < inputFields.length; i++) {
      isValid = inputFields[i].reportValidity() && isValid;
    }
    return isValid;
  },
  getCurrentUserData: function (cmp, event, helper) {
    var action = cmp.get("c.getCurrentUserData");
    action.setCallback(this, function (response) {
      var state = response.getState();
      console.log("currentUserData: ", response.getReturnValue());
      if (state === "SUCCESS") {
        var currentUserData = response.getReturnValue();
        cmp.set("v.currentUserData", currentUserData);
      } else {
        this.showToast("error", "Failed to get current data of User.");
      }
    });
    $A.enqueueAction(action);
  },
  onClose: function (cmp, event, helper) {
    var dismissActionPanel = $A.get("e.force:closeQuickAction");
    dismissActionPanel.fire();
    var modal = cmp.find("newModal");
    modal && modal.destroy();
    var modalHtml = cmp.find("newModalStyle");
    modalHtml && modalHtml.destroy();
  }
});
