/**
 * @description       :
 * @author            : Ba Truong Nguyen
 * @group             :
 * @last modified on  : 03-24-2023
 * @last modified by  : Ba Truong Nguyen
 **/
({
  doInit: function (component, event, helper) {
    console.log("recordId: ", component.get("v.recordId"));
    helper.getUploadedFiles(component, event);
  },

  previewFile: function (component, event, helper) {
    $A.get("e.lightning:openFiles").fire({
      recordIds: [event.currentTarget.id]
    });
  },

  uploadFinished: function (component, event, helper) {
    var uploadedFiles = event.getParam("files");
    console.log("uploadedFiles: " + uploadedFiles);
    var fileIds = component.get("v.fileIds");
    if (!fileIds) {
      fileIds = "";
    }
    //console.log('fileIds: ' + fileIds);
    for (var i = 0; i < uploadedFiles.length; i++) {
      console.log("uploadedFiles: " + JSON.stringify(uploadedFiles[i]));
      console.log(
        "uploadedFiles[i].documentId: " + uploadedFiles[i].documentId
      );
      fileIds += uploadedFiles[i].documentId + ",";
    }
    console.log("fileIds: " + fileIds);
    component.set("v.fileIds", fileIds);

    // var documentId = uploadedFiles[0].documentId;
    // var fileName = uploadedFiles[0].name;

    helper.saveFileIds(component, event);

    var toastEvent = $A.get("e.force:showToast");
    // show toast on file uploaded successfully
    toastEvent.setParams({
      message: "Files have been uploaded successfully!",
      type: "success",
      duration: 2000
    });
    toastEvent.fire();
  },

  deleteSelectedFile: function (component, event, helper) {
    if (confirm("Are you sure you want to delete this file?")) {
      component.set("v.showSpinner", true);
      helper.deleteUploadedFile(component, event);
    }
  },
  openDocumentModal: function (cmp, event, helper) {
    var recordId = cmp.get("v.recordId");
    console.log("recordId: ", recordId);
    cmp.set("v.isModalOpen", true);
  },
  reInit: function (cmp, event, helper) {
    console.log("refresh parent view...");
    cmp.set("v.isModalOpen", false);
    cmp.set("v.documentRecordId", null);
    helper.getUploadedFiles(cmp, event);
  },
  editDocument: function (cmp, event, helper) {
    var docId = event.currentTarget.id;
    console.log("docId: ", docId);
    cmp.set("v.documentRecordId", docId);
    cmp.set("v.isModalOpen", true);
  },
  deleteDocument: function (component, event, helper) {
    if (confirm("Are you sure you want to delete this file?")) {
      component.set("v.showSpinner", true);
      helper.deleteSelectedDocument(component, event);
    }
  }
});
