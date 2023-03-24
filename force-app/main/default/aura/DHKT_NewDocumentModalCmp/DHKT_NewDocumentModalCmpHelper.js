/**
 * @description       :
 * @author            : Ba Truong Nguyen
 * @group             :
 * @last modified on  : 03-24-2023
 * @last modified by  : Ba Truong Nguyen
 **/
({
  onClose: function (cmp, event, helper) {
    var dismissActionPanel = $A.get("e.force:closeQuickAction");
    dismissActionPanel.fire();
    var modal = cmp.find("newModal");
    modal && modal.destroy();
    var modalHtml = cmp.find("landModalStyle");
    modalHtml && modalHtml.destroy();
  },
  validate: function (cmp) {
    var isValid = true;
    var requiredFields = cmp.find("requiredField");
    // var isValid = true;
    for (var i = 0; i < requiredFields.length; i++) {
      isValid = requiredFields[i].reportValidity() && isValid;
    }
    if (!cmp.get("v.documentURL")) {
      isValid = false;
    }
    console.log(isValid);
    return isValid;
  }
});
