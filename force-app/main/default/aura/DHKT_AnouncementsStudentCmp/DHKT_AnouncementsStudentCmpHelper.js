/**
 * @description       :
 * @author            : Ba Truong Nguyen
 * @group             :
 * @last modified on  : 04-02-2023
 * @last modified by  : Ba Truong Nguyen
 **/
({
  getNotifications: function (cmp, event) {
    var action = cmp.get("c.getNotifications");
    action.setCallback(this, function (response) {
      var state = response.getState();
      if (state === "SUCCESS") {
        var returnValue = response.getReturnValue();
        var notifications = JSON.parse(returnValue);
        // console.log("notifications: ", notifications);
        if (notifications) {
          for (var i = 0; i < notifications.classNotifications.length; i++) {
            notifications.classNotifications[i].CreatedDate =
              notifications.classNotifications[i].CreatedDate.substring(0, 10);
          }
          for (var j = 0; j < notifications.facultyNotifications.length; j++) {
            notifications.facultyNotifications[j].CreatedDate =
              notifications.facultyNotifications[j].CreatedDate.substring(
                0,
                10
              );
          }
          for (var k = 0; k < notifications.personalNotifications.length; k++) {
            notifications.personalNotifications[k].CreatedDate =
              notifications.personalNotifications[k].CreatedDate.substring(
                0,
                10
              );
          }
          // console.log("notifications: ", notifications);
          cmp.set("v.notifications", notifications);
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
