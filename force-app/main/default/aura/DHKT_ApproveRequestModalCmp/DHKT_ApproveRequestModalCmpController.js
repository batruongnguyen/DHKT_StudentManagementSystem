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
    console.log("recordId: ", recordId);
  },
  handleApprove: function (cmp, event, helper) {
    var recordId = cmp.get("v.recordId");
    var note = cmp.get("v.note");
    var action = cmp.get("c.handleApproveRequest");
    action.setParams({
      requestId: recordId,
      note: note
    });
    action.setCallback(this, function (response) {
      var state = response.getState();
      console.log("getReturnValue: ", response.getReturnValue());
      if (state === "SUCCESS") {
        helper.showToast("success", response.getReturnValue());
      } else {
        var message = response.getReturnValue();
        if (message) {
          helper.showToast("error", message);
        }
      }
    });

    $A.enqueueAction(action);
    location.reload();
  },
  handleExit: function (cmp, event, helper) {
    helper.onClose(cmp, event, helper);
  }
});
