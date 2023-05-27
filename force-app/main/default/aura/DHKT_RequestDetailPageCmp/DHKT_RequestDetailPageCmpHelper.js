/**
 * @description       :
 * @author            : Ba Truong Nguyen
 * @group             :
 * @last modified on  : 05-27-2023
 * @last modified by  : Ba Truong Nguyen
 **/
({
  fetchData: function (cmp, event) {
    let recordId = cmp.get("v.recordId");
    if (recordId) {
      var action = cmp.get("c.getRequest");
      action.setParams({recordId});

      action.setCallback(this, function (response) {
        var state = response.getState();
        var responseData = response.getReturnValue()[0];
        if (state === "SUCCESS") {
          cmp.set("v.responseData", responseData);
          if (responseData && responseData.Request_Status__c == "New") {
            this.validateEditRecord(cmp);
          }
          cmp.set(
            "v.isShowRequestInfo",
            responseData.Request_Header__c != "Return to Study" ? true : false
          );
          cmp.set(
            "v.isGraduateInternship",
            responseData.Request_Header__c == "Graduate Internship"
              ? true
              : false
          );
        } else {
          var message = response.getReturnValue();
          if (message) {
            this.showToast("error", message);
          }
        }
      });
      $A.enqueueAction(action);
    }
  },
  getFacilities: function (cmp, event) {
    var action = cmp.get("c.getFacilityRecords");
    let recordId = cmp.get("v.recordId");
    if (recordId) {
      action.setParams({
        requestId: recordId
      });
      action.setCallback(this, function (response) {
        var state = response.getState();
        var facilities = response.getReturnValue();
        if (state === "SUCCESS") {
          cmp.set("v.facilities", facilities);
        } else {
          var message = response.getReturnValue();
          if (message) {
            this.showToast("error", message);
          }
        }
      });
      $A.enqueueAction(action);
    }
  },
  fetchFacilityOptions: function (cmp, event) {
    var action = cmp.get("c.getFacilityOptions");
    let recordId = cmp.get("v.recordId");
    action.setParams({
      requestId: recordId
    });
    action.setCallback(this, function (response) {
      var state = response.getState();
      if (state === "SUCCESS") {
        cmp.set(
          "v.facilityOptions",
          this.handlePickListValues(response.getReturnValue())
        );
        // this.setFacilityOptions(cmp, event);
      } else {
        var message = response.getReturnValue();
        if (message) {
          this.showToast("error", message);
        }
      }
    });
    $A.enqueueAction(action);
  },
  validateEditRecord: function (cmp) {
    var action = cmp.get("c.validateEditRequest");
    let recordId = cmp.get("v.recordId");
    action.setParams({
      requestId: recordId
    });
    action.setCallback(this, function (response) {
      var state = response.getState();
      if (state === "SUCCESS") {
        cmp.set("v.isEditPage", response.getReturnValue());
      } else {
        var message = response.getReturnValue();
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
  },
  validate: function (cmp) {
    var inputFields = cmp.find("inputField");
    var isValid = true;
    for (var i = 0; i < inputFields.length; i++) {
      isValid = inputFields[i].reportValidity() && isValid;
      if (!inputFields[i].reportValidity()) {
        this.showToast("error", "Please fulfill required fields.");
        return;
      }
    }
    return isValid;
  },
  handlePickListValues: function (facilityOptions) {
    var items = [];
    for (var i = 0; i < facilityOptions.length; i++) {
      if (facilityOptions[i] != null) {
        var item = {
          label: facilityOptions[i].Facility_Code__c,
          value: facilityOptions[i].Facility_Code__c
        };
        items.push(item);
      }
    }
    return items;
  },
  callSaveReqFacility: function (cmp, event) {
    var facilities = cmp.get("v.facilities");
    let facilityCodes = [];

    for (let i = 0; i < facilities.length; i++) {
      if (facilityCodes.includes(facilities[i].Facility_Code__c)) {
        this.showToast("error", "Do not choose duplicate Facility Code");
        return false;
        // Do something if a duplicate is found, like removing the object from the list
      } else {
        facilityCodes.push(facilities[i].Facility_Code__c);
      }
    }
    this.callSaveMethod(cmp, facilities);
  },
  callSaveMethod: function (cmp, facilities) {
    var facilitiesJson = JSON.parse(JSON.stringify(facilities));
    var facilitiesArray = [];
    for (let i = 0; i < facilitiesJson.length; i++) {
      let facility = facilitiesJson[i];
      facilitiesArray.push({
        facilityCode: facility.Facility_Code__c,
        facilityName: facility.Facility_Name__c,
        zoneArea: facility.Zone_Area__c,
        classroom: facility.Classroom__c
      });
    }

    var action = cmp.get("c.saveFacilityOptions");

    action.setParams({
      facilitiesArray: JSON.stringify(facilitiesArray),
      requestId: cmp.get("v.recordId")
    });
    action.setCallback(this, function (response) {
      var state = response.getState();
      if (state === "SUCCESS") {
        this.showToast("success", "Save successfully.");
      } else {
        var message = response.getReturnValue();
        if (message) {
          this.showToast("error", message);
        }
      }
    });
    $A.enqueueAction(action);
  }
});
