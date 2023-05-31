/**
 * @description       :
 * @author            : Ba Truong Nguyen
 * @group             :
 * @last modified on  : 05-31-2023
 * @last modified by  : Ba Truong Nguyen
 **/
({
  callRejectRequest: function (cmp, event) {
    const requestId = cmp.get("v.recordId");
    const reason = cmp.get("v.reason");

    const action = cmp.get("c.handleRejectRequest");
    action.setParams({ requestId, reason });
    action.setCallback(this, function (response) {
      var state = response.getState();
      if (state === "SUCCESS") {
        this.showToast("success", response.getReturnValue());
      } else {
        var message = response.getReturnValue();
        if (message) {
          this.showToast("error", message);
        }
      }
    });

    $A.enqueueAction(action);
    location.reload();
  },

  onClose: function (cmp, event) {
    var dismissActionPanel = $A.get("e.force:closeQuickAction");
    dismissActionPanel.fire();
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
