/**
 * @description       :
 * @author            : Ba Truong Nguyen
 * @group             :
 * @last modified on  : 04-01-2023
 * @last modified by  : Ba Truong Nguyen
 **/
({
  init: function (cmp, event, helper) {
    console.log("init...");
    helper.fetchData(cmp, event);
    helper.getFacilities(cmp, event);
    helper.fetchFacilityOptions(cmp, event);
  },
  onRecordLoad: function (cmp, event, helper) {
    console.log("onRecordLoad...");
  },
  onSaveClick: function (cmp, event, helper) {
    var reqType = cmp.get("v.responseData").Request_Type__c;
    console.log("reqType: ", reqType);
    if (reqType != "Facility Request") {
      cmp.find("recordEditForm").submit() &&
        helper.showToast("success", "Save successfully.");
    } else {
      helper.callSaveReqFacility(cmp, event);
    }
  },
  onCancelClick: function (cmp, event, helper) {
    $A.get("e.force:refreshView").fire();
    cmp.set("v.isEditPage", false);
  },
  onAddFacility: function (cmp, event) {
    let facilities = cmp.get("v.facilities");
    facilities.push({
      Facility_Code__c: null,
      Facility_Name__c: null,
      Zone_Area__c: null,
      Classroom__c: null
    });
    cmp.set("v.facilities", facilities);
  },
  onRemoveFacility: function (cmp, event) {
    let facilities = cmp.get("v.facilities");
    let itemIndex = event.getSource().get("v.value");
    let removedValue = event.getParam("value");
    console.log("removedValue: ", removedValue);
    facilities.splice(itemIndex, 1);
    cmp.set("v.facilities", facilities);
  },
  onChangeFacilityCode: function (cmp, event) {
    const facilities = cmp.get("v.facilities");
    for (const facility of facilities) {
      const facilityCode = facility.Facility_Code__c;
      const parts = facilityCode.split(" - ");
      facility.Facility_Name__c = parts[0];
      facility.Zone_Area__c = parts[1][0];
      facility.Classroom__c = parts[1];
    }
    cmp.set("v.facilities", facilities);
  },
  requestRecordUpdated: function (cmp, event, helper) {
    console.log("requestRecordUpdated...");
  },
  onCreateSuccess: function (cmp, event, helper) {
    helper.showToast("success", "Save successfully.");
  },
  onCreateError: function (cmp, event, helper) {
    var error = event.getParams();
    helper.showToast("error", error.detail || error.message);
  }
});
