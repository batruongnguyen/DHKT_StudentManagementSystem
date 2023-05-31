/**
 * @description       :
 * @author            : Ba Truong Nguyen
 * @group             :
 * @last modified on  : 05-31-2023
 * @last modified by  : Ba Truong Nguyen
 **/
({
  init: function (cmp, event, helper) {
    var recordId = cmp.get("v.recordId");
    console.log("recordId: ", recordId);
  },
  handleReject: function (cmp, event, helper) {
    const valid = [cmp.find("required_field")].flat().reduce(function(validSoFar, inputCmp) {
      inputCmp.showHelpMessageIfInvalid();
      return validSoFar && inputCmp.get("v.validity").valid;
    }, true);

    valid && helper.callRejectRequest(cmp, event);
  },
  handleExit: function (cmp, event, helper) {
    helper.onClose(cmp, event, helper);
  }
});
