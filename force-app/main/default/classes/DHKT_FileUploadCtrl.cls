/**
 * @description       :
 * @author            : Ba Truong Nguyen
 * @group             :
 * @last modified on  : 03-24-2023
 * @last modified by  : Ba Truong Nguyen
 **/
public with sharing class DHKT_FileUploadCtrl {
  public class CustomDocumentAttachment {
    @AuraEnabled
    public String DocumentId { get; set; }
    @AuraEnabled
    public String Id { get; set; }
    @AuraEnabled
    public String Title { get; set; }
    @AuraEnabled
    public String FileType { get; set; }
    @AuraEnabled
    public String DocumentURL { get; set; }
  }

  @AuraEnabled
  public static List<CustomDocumentAttachment> getFiles(
    String recordId,
    String relatedFieldApiName,
    String documentType
  ) {
    List<CustomDocumentAttachment> results = new List<CustomDocumentAttachment>();
    List<Id> lsFileIds = new List<Id>();
    String sQuery = 'SELECT Id, Name, Uploaded_File__c, Uploaded_File_URLs__c, Document_URL__c, Title__c FROM DHKT_Related_Document__c WHERE ';
    sQuery += relatedFieldApiName;
    sQuery += ' = :recordId AND Type__c = :documentType';
    System.debug('sQuery: ' + sQuery);
    List<DHKT_Related_Document__c> ls = Database.query(sQuery);
    String documentIdForFiles = '';
    // Get domain URL
    String strDomainURL = System.URL.getOrgDomainUrl().toExternalForm();
    System.debug('Domain URL is ' + strDomainURL);
    for (DHKT_Related_Document__c item : ls) {
      String fileIds = item.Uploaded_File__c;
      System.debug('fileIds: ' + fileIds);
      if (!String.isBlank(fileIds)) {
        documentIdForFiles = item.Id;
        List<Id> recordIds = fileIds.split(',');
        lsFileIds.addAll(recordIds);
        if (lsFileIds.size() > 0) {
          List<String> lsUrls = new List<String>();
          for (Id fileId : lsFileIds) {
            lsUrls.add(
              strDomainURL + '/lightning/r/ContentDocument/' + fileId + '/view'
            );
          }
          item.Uploaded_File_URLs__c = String.join(lsUrls, ',');
        }
      } else {
        CustomDocumentAttachment itemDoc = new CustomDocumentAttachment();
        itemDoc.DocumentId = item.Id;
        itemDoc.Id = item.Id;
        itemDoc.Title = item.Title__c;
        itemDoc.FileType = 'URL';
        itemDoc.DocumentURL = item.Document_URL__c;
        results.add(itemDoc);
      }
    }

    if (ls.size() > 0) {
      upsert ls;
    }

    if (lsFileIds.size() > 0) {
      List<ContentDocument> lsContentDocs = [
        SELECT Id, Title, FileType
        FROM ContentDocument
        WHERE Id IN :lsFileIds
      ];
      for (ContentDocument item : lsContentDocs) {
        CustomDocumentAttachment itemDoc = new CustomDocumentAttachment();
        itemDoc.DocumentId = documentIdForFiles;
        itemDoc.Id = item.Id;
        itemDoc.Title = item.Title;
        itemDoc.FileType = item.FileType;
        results.add(itemDoc);
      }
    }

    return results;
  }

  @AuraEnabled
  public static void deleteFile(String contentDocumentId) {
    delete [SELECT Id FROM ContentDocument WHERE Id = :contentDocumentId];
  }

  @AuraEnabled
  public static void deleteDocumentURLItem(String documentId) {
    try {
      delete [SELECT Id FROM DHKT_Related_Document__c WHERE Id = :documentId];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled
  public static void saveFileIds(
    String recordId,
    String idObj,
    String relatedFieldApiName,
    String fileIds,
    String documentType
  ) {
    DHKT_Related_Document__c fileDataRec = new DHKT_Related_Document__c();
    fileDataRec.Id = idObj;
    fileDataRec.Type__c = documentType;
    fileDataRec.put(relatedFieldApiName, recordId);
    fileDataRec.put('Uploaded_File__c', fileIds);
    if (!String.isBlank(fileIds)) {
      List<Id> lsFileIds = fileIds.split(',');
      if (lsFileIds.size() > 0) {
        List<String> lsUrls = new List<String>();
        // Get domain URL
        String strDomainURL = System.URL.getOrgDomainUrl().toExternalForm();
        for (Id fileId : lsFileIds) {
          lsUrls.add(
            strDomainURL + '/lightning/r/ContentDocument/' + fileId + '/view'
          );
        }
        fileDataRec.Uploaded_File_URLs__c = String.join(lsUrls, ',');
      }
    }
    upsert fileDataRec;
  }

  @AuraEnabled
  public static string getOrgDomainUrl() {
    return System.URL.getOrgDomainUrl().toExternalForm();
  }
}
