/**
 * @description       :
 * @author            : Ba Truong Nguyen
 * @group             :
 * @last modified on  : 03-25-2023
 * @last modified by  : Ba Truong Nguyen
 **/
({
  onClose: function (cmp, event, helper) {
    var dismissActionPanel = $A.get("e.force:closeQuickAction");
    dismissActionPanel.fire();
  },
  validate: function (cmp) {
    var requiredFields = cmp.find("reason");
    var isValid = true;
    for (var i = 0; i < requiredFields.length; i++) {
      isValid = requiredFields[i].reportValidity() && isValid;
    }
    return isValid;
  },
  showToast: function (type, message) {
    var toastEvent = $A.get("e.force:showToast");
    toastEvent.setParams({
      type,
      message
    });
    toastEvent.fire();
  }
});
