/**
 * @description       :
 * @author            : Ba Truong Nguyen
 * @group             :
 * @last modified on  : 04-02-2023
 * @last modified by  : Ba Truong Nguyen
 **/
({
  getStudentRequests: function (cmp, event, helper) {
    console.log("getStudentRequests: ");
    var pageSize = cmp.get("v.pageSize");
    console.log("pageSize: ", pageSize);
    var action = cmp.get("c.getStudentInfoForCurrentUser");
    action.setCallback(this, function (response) {
      var state = response.getState();
      console.log("state: ", state);
      console.log("response: ", response.getReturnValue());
      if (state === "SUCCESS") {
        var returnValue = response.getReturnValue();
        var studentInfo = JSON.parse(returnValue);
        console.log("studentInfo: ", studentInfo);
        if (returnValue) {
          var requests = studentInfo.Requests__r.records;
          cmp.set("v.studentInfo", studentInfo);
          cmp.set("v.requests", requests);
          console.log(
            'cmp.get("v.requests").length: ',
            cmp.get("v.requests").length
          );
          cmp.set("v.totalSize", cmp.get("v.requests").length);
          cmp.set("v.start", 0);
          cmp.set("v.end", pageSize - 1);
          var paginationList = [];
          for (var i = 0; i < pageSize; i++) {
            paginationList.push(requests[i]);
          }
          cmp.set("v.paginationList", paginationList);
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
