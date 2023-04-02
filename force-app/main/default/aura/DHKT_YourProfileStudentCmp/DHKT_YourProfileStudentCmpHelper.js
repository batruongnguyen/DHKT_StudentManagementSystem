/**
 * @description       :
 * @author            : Ba Truong Nguyen
 * @group             :
 * @last modified on  : 04-02-2023
 * @last modified by  : Ba Truong Nguyen
 **/
({
  getStudentInfo: function (cmp, event, helper) {
    var action = cmp.get("c.getStudentInfo");
    action.setCallback(this, function (response) {
      var state = response.getState();
      if (state === "SUCCESS") {
        var returnValue = response.getReturnValue();
        var studentInfo = JSON.parse(returnValue);
        // console.log("studentInfo: ", studentInfo);
        if (returnValue) {
          cmp.set("v.studentInfo", studentInfo);
        }
      } else {
        var message = response.getError();
        if (message) {
          this.showToast("error", message);
        }
      }
    });
    $A.enqueueAction(action);
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
