/**
 * @description       :
 * @author            : Ba Truong Nguyen
 * @group             :
 * @last modified on  : 03-24-2023
 * @last modified by  : Ba Truong Nguyen
 **/
({
  getUploadedFiles: function (component, event) {
    console.log("getUploadedFiles Begin");
    var action = component.get("c.getFiles");
    action.setParams({
      relatedFieldApiName: component.get("v.relatedFieldApiName"),
      recordId: component.get("v.recordId"),
      documentType: component.get("v.documentType")
    });
    action.setCallback(this, function (response) {
      var state = response.getState();
      console.log("getUploadedFiles 444: " + JSON.stringify(state));
      if (state == "SUCCESS") {
        var result = response.getReturnValue();
        var fileIds = [];
        if (result) {
          result.forEach((item) => {
            if (item.FileType != "URL") {
              item.detailsUrl =
                "/lightning/r/ContentDocument/" + item.Id + "/view";
              component.set("v.idObj", item.DocumentId);
              fileIds.push(item.Id);
            } else {
              item.detailsUrl =
                "/lightning/r/DHKT_Related_Documents__c/" + item.Id + "/view";
              component.set("v.idObj", null);
            }
          });
        }
        console.log("result: ", result);
        component.set("v.files", result);
        console.log("fileIds: ", fileIds);
        if (fileIds.length > 0) {
          var strfileIds = fileIds.join(",");
          strfileIds += ",";
          console.log("strfileIds: ", strfileIds);
          component.set("v.fileIds", strfileIds);
        } else {
          component.set("v.fileIds", "");
        }
      } else {
        console.log(
          "------getUploadedFiles: " + JSON.stringify(response.getError())
        );
      }
    });
    $A.enqueueAction(action);
  },

  deleteUploadedFile: function (component, event) {
    var action = component.get("c.deleteFile");
    var deleteId = event.currentTarget.id;
    action.setParams({
      contentDocumentId: deleteId
    });
    action.setCallback(this, function (response) {
      var state = response.getState();
      if (state == "SUCCESS") {
        var fileIds = component.get("v.fileIds");
        console.log("fileIds: " + fileIds);
        console.log('event.currentTarget.id + ",": ' + deleteId + ",");
        fileIds = fileIds.replace(deleteId + ",", "");
        console.log("fileIds: " + fileIds);
        component.set("v.fileIds", fileIds);
        this.saveFileIds(component, event);
        component.set("v.showSpinner", false);
        // show toast on file deleted successfully
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
          message: "File has been deleted successfully!",
          type: "success",
          duration: 2000
        });
        toastEvent.fire();
      }
    });
    $A.enqueueAction(action);
  },

  saveFileIds: function (component, event) {
    console.log("--- saveFileIds begin");
    var relatedFieldApiName = component.get("v.relatedFieldApiName");
    var recordId = component.get("v.recordId");
    var documentType = component.get("v.documentType");
    var fileIds = component.get("v.fileIds");
    console.log("relatedFieldApiName: ", relatedFieldApiName);
    console.log("recordId: ", recordId);
    var action = component.get("c.saveFileIds");
    action.setParams({
      relatedFieldApiName: relatedFieldApiName,
      recordId: recordId,
      idObj: component.get("v.idObj"),
      documentType: documentType,
      fileIds: fileIds
    });
    action.setCallback(this, function (response) {
      var state = response.getState();
      if (state === "SUCCESS") {
        console.log("------ Save saveFileIds success");
        this.getUploadedFiles(component, event);
        console.log("--- saveFileIds End");
      } else if (state === "ERROR") {
        console.log(
          "------ Save saveFileIds ERROR: " +
            JSON.stringify(response.getError())
        );
      }
    });
    $A.enqueueAction(action);
  },

  deleteSelectedDocument: function (component, event) {
    console.log("deleteSelectedDocument...");
    var action = component.get("c.deleteDocumentURLItem");
    var deleteId = event.currentTarget.id;
    action.setParams({
      documentId: deleteId
    });
    action.setCallback(this, function (response) {
      var state = response.getState();
      if (state == "SUCCESS") {
        this.saveFileIds(component, event);
        component.set("v.showSpinner", false);
        // show toast on file deleted successfully
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
          message: "File has been deleted successfully!",
          type: "success",
          duration: 2000
        });
        toastEvent.fire();
      }
    });
    $A.enqueueAction(action);
  }
});
