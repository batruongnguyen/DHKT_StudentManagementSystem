/**
 * @description       :
 * @author            : Ba Truong Nguyen
 * @group             :
 * @last modified on  : 04-02-2023
 * @last modified by  : Ba Truong Nguyen
 **/
({
  init: function (cmp, event, helper) {
    helper.getStudentRequests(cmp, event, helper);
  },
  onSelectChange: function (cmp, event, helper) {
    console.log("onSelectChange: ");
    var selected = cmp.find("records").get("v.value");
    var paginationList = [];
    var oppList = cmp.get("v.requests");
    for (var i = 0; i < selected; i++) {
      paginationList.push(oppList[i]);
    }
    cmp.set("v.paginationList", paginationList);
  },

  first: function (cmp, event, helper) {
    console.log("first: ");
    var oppList = cmp.get("v.requests");
    var pageSize = cmp.get("v.pageSize");
    var paginationList = [];
    for (var i = 0; i < pageSize; i++) {
      paginationList.push(oppList[i]);
    }
    cmp.set("v.paginationList", paginationList);
  },

  last: function (cmp, event, helper) {
    console.log("last: ");
    var oppList = cmp.get("v.requests");
    var pageSize = cmp.get("v.pageSize");
    var totalSize = cmp.get("v.totalSize");
    var paginationList = [];
    for (var i = totalSize - pageSize + 1; i < totalSize; i++) {
      paginationList.push(oppList[i]);
    }
    cmp.set("v.paginationList", paginationList);
  },

  next: function (cmp, event, helper) {
    console.log("next: ");
    var oppList = cmp.get("v.requests");
    var end = cmp.get("v.end");
    var start = cmp.get("v.start");
    var pageSize = cmp.get("v.pageSize");
    var paginationList = [];
    var counter = 0;
    for (var i = end + 1; i < end + pageSize + 1; i++) {
      if (oppList.length > end) {
        paginationList.push(oppList[i]);
        counter++;
      }
    }
    start = start + counter;
    end = end + counter;
    cmp.set("v.start", start);
    cmp.set("v.end", end);
    cmp.set("v.paginationList", paginationList);
  },

  previous: function (cmp, event, helper) {
    console.log("previous: ");
    var oppList = cmp.get("v.requests");
    var end = cmp.get("v.end");
    var start = cmp.get("v.start");
    var pageSize = cmp.get("v.pageSize");
    var paginationList = [];
    var counter = 0;
    for (var i = start - pageSize; i < start; i++) {
      if (i > -1) {
        paginationList.push(oppList[i]);
        counter++;
      } else {
        start++;
      }
    }
    start = start - counter;
    end = end - counter;
    cmp.set("v.start", start);
    cmp.set("v.end", end);
    cmp.set("v.paginationList", paginationList);
  }
});
