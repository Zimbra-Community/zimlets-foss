/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2014, 2015, 2016 Synacor, Inc.
 *
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at: https://www.zimbra.com/license
 * The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15
 * have been added to cover use of software over a computer network and provide for limited attribution
 * for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied.
 * See the License for the specific language governing rights and limitations under the License.
 * The Original Code is Zimbra Open Source Web Client.
 * The Initial Developer of the Original Code is Zimbra, Inc.  All rights to the Original Code were
 * transferred by Zimbra, Inc. to Synacor, Inc. on September 14, 2015.
 *
 * All portions of the code are Copyright (C) 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Extends the mail client fuctionality to allow the user to insert links to sync and share files into a message body and 
 * save attachments to a sync znd share folder.
 *
 * REQUIRES: AjxStringUtil, AjxCallback, AjxListener, AjxPackage, AjxMsg, AjxDispatcher, AjxMessageFormat
 */

//Zimlet Class
function com_zimbra_zss_HandlerObject() {
	
}

//Make Zimlet class a subclass of ZmZimletBase class - this is what makes a JS class a Zimlet
com_zimbra_zss_HandlerObject.prototype = new ZmZimletBase();
com_zimbra_zss_HandlerObject.prototype.constructor = com_zimbra_zss_HandlerObject;


var ZssZimlet = com_zimbra_zss_HandlerObject;

ZssZimlet.prototype.init = function(){
	this.vaultPath = this.getUserProperty("zss_url");
	
	this.messages = {
		menuItemTxt: this.getMessage('menuItem'),
		attachBtnText: this.getMessage('attachBtnText'),
		noFilesFound: this.getMessage('noFilesFound'),
		fetchingContentMsg: this.getMessage('fetchingContent'),
		addFilesAsSecureLink: this.getMessage('addFileAsSecureLink'),
		attachingFileNotification : this.getMessage('attachingFileNotification'),
		selectFilesDialogTitle : this.getMessage('selectFilesDialogTitle'),
		chooseFolderDialogTitle : this.getMessage('chooseFolderDialogTitle'),
		fileSavedToVault: this.getMessage('fileSavedToVault'),
		saveToVaultLink: this.getMessage('saveToVaultLink'),
		unprovisionedAccountMsg: this.getMessage('unprovisionedAccount'),
		serviceUnavailableMsg: this.getMessage('serviceUnavailable'),
		serviceTimedOutMsg: this.getMessage('serviceTimedOut'),
		genericFailureMsg: this.getMessage('genericFailure'),
		duplicateFileMessage: this.getMessage('duplicateFileMessage')
	};
	
	this._viewIdToZssHeaderMap = {};
	// Add Save Attachment to Vault options in email
	if (appCtxt.get(ZmSetting.MAIL_ENABLED)) {
		AjxPackage.require({name:"MailCore", callback:new AjxCallback(this, this.addAttachmentHandler)});
	}
}

/*
	Add Zimbra Sync and Share option to attach menu
*/
ZssZimlet.prototype.initializeAttachPopup =
function(menu, controller) {
	var mi = controller._createAttachMenuItem(menu,this.messages.menuItemTxt,
			new AjxListener(this, this.showVaultFileChooser));
	mi.setEnabled(!appCtxt.isWebClientOffline());
};




/*
	ADD VAULT FILE AS AN ATTACHMENT
*/

// code for showing Vault file chooser in a dialog and 
// providing user the ability to select file.
// provide ability to select whether to save vault file as an attachment or a link?
// call -> processSelectedVaultFile
ZssZimlet.prototype.showVaultFileChooser =
function() {
	if(this.dialog){
		this.fileExplorer.reload();
		this.addFilesAsSecureLink.setSelected(true);
		this.dialog.popup();
		return;
	}	

	this.dialogView = new DwtComposite(this.getShell());
	this.dialogView.setSize(560, 320); //set width and height
	this.dialogView.getHtmlElement().style.overflow = "hidden"; //adds scrollbar
	var attachButton = new DwtDialog_ButtonDescriptor(DwtDialog.OK_BUTTON, this.messages.attachBtnText , DwtDialog.ALIGN_RIGHT);
	var cancelButton = new DwtDialog_ButtonDescriptor(DwtDialog.CANCEL_BUTTON, AjxMsg[DwtDialog.MSG_KEY[DwtDialog.CANCEL_BUTTON]] , DwtDialog.ALIGN_RIGHT);
	
	this.dialog = this._createDialog({
							title: this.messages.selectFilesDialogTitle,
							view:this.dialogView,
							standardButtons: DwtDialog.NO_BUTTONS,
							extraButtons:[
								attachButton,
								cancelButton
							]
					});

	this.dialog.setButtonListener(attachButton.id, new AjxListener(this, this._processSelectedVaultFile));

	if(!this.fileExplorer){
		this.fileExplorer = new com_zimbra_zss_Explorer({
			rootContainer : this.dialogView,
			vaultPath: this.vaultPath,
			dialog: this.dialog,
			noFilesMsg: this.messages.noFilesFound,
			fetchingContentMsg: this.messages.fetchingContentMsg,
			unprovisionedAccountMsg: this.messages.unprovisionedAccountMsg,
			serviceUnavailableMsg: this.messages.serviceUnavailableMsg,
			serviceTimedOutMsg: this.messages.serviceTimedOutMsg,
			genericFailureMsg: this.messages.genericFailureMsg
		});
	}
	
	this.addFilesAsSecureLink = new DwtCheckbox({
		parent: this.dialogView,
		style: DwtCheckbox.TEXT_RIGHT,
		className: 'zss_secure_link',
		name: 'zss_secure_link',
		checked: true,
		id: Dwt.getNextId()
	});
	this.addFilesAsSecureLink.setText(this.messages.addFilesAsSecureLink);
	
	//show the dialog
	this.dialog.popup();
};

// Get the info of the file selected by the user 
// addFileAsAttachment == true? (addFilesAsAttachment)
// else add the link to the message. (addFilesAsLinkInMsg)
ZssZimlet.prototype._processSelectedVaultFile =
function() {
	this.dialog.popdown();
	var selectedFiles = this.fileExplorer.getSelection();
	if( selectedFiles.length ) {
		var addFilesAsSecureLink = this.addFilesAsSecureLink.isSelected();
		
		var insertAsAttachment = false;
		if(insertAsAttachment) {
			this.addFilesAsAttachment(selectedFiles);
		}
		else {
			this.addFilesAsLinkInMsg(selectedFiles, addFilesAsSecureLink);
		}
	}
};

// add the file path as a link
ZssZimlet.prototype.addFilesAsLinkInMsg =
function(files, addFilesAsSecureLink) {
	var self = this;
	var view = appCtxt.getCurrentView();
	var editor = view.getHtmlEditor();
	var editorContent =  editor.getContent();

	var isHtml = view.getComposeMode() === "text/html";
	if (isHtml) {

		var html = "";
		for (var i = 0; i < files.length; i++) {
			html += generateHTML(files[i]);
			//tinymce modifies the source when using mceInsertContent
		}
		if (files.length) {
			var ed = editor.getEditor();
			var origPasteImageFlag = ed.settings.paste_data_images;
			ed.settings.paste_data_images = true;
			ed.execCommand('mceInsertRawHTML', false, html, {skip_undo : 1});
			ed.settings.paste_data_images = origPasteImageFlag;
		}
	} else {
		var textArea = document.getElementById(editor.getEditor().id);
		var content = "";

		for (var i = 0; i < files.length; i++) {
			content += "\n[ " + files[i].path + " | " +  files[i].content.file.name + " ] \n";
		}
		// IE Support
		if (document.selection) {
			textArea.focus();
			sel = document.selection.createRange();
			sel.text = myValue;
		}
		// others
		else if (textArea.selectionStart || textArea.selectionStart == '0') {
			var startPos = textArea.selectionStart;
			var endPos = textArea.selectionEnd;
			var currentContent = textArea.value;
			// create a string with new text inserted at the caret position.
			var updatedContent = currentContent.substring(0, startPos)
								+ content
								+ currentContent.substring(endPos, currentContent.length);
			
			editor.setContent(updatedContent);
		}
	}	

	this.addGeneratedLinksToMsgMetadata(files, addFilesAsSecureLink);
	
	function generateHTML(file){
		var thumbnail = file.content.file.thumbnail.uri;
		var fileName = AjxStringUtil.htmlEncode(file.content.file.name);
		var filePath = file.content.file.content.uri;
		var fileTypeInfo = ZmMimeTable.getInfo(file.content.file.mime_type, true);
		var fileIcon = fileTypeInfo.dataUri;
		// var fileIcon = self.getFileTypeIcon(file.content.file.name);

		return '<a href="' + filePath + '/inline/" target="_blank" title="' + fileName + '"'
				+ ' style="padding: 10px 0px; margin-right: 10px; color: rgb(0, 90, 149); display: inline-block; margin-left: 10px; font-family: arial; font-style: normal; font-weight: normal; font-size: 13px; cursor: default; border: 1px solid rgb(221, 221, 221); text-align: center; max-width: 105px; text-decoration: underline; background-color: rgb(245, 245, 245); word-break: break-all; word-wrap: break-word;">'
				+ '<img style="margin:0 20px 7px; border:none;" height="64" src="' + fileIcon + '"/>'
				+ fileName
				+ '</a>';
	}
};

//save metadata info about the links to message draft
ZssZimlet.prototype.addGeneratedLinksToMsgMetadata = 
function(files, addFilesAsSecureLink) {
	//hang an object off of this view so that when a draft is saved or the message is sent, we can add ZSS URLs to custom mime headers
	var currentViewId = appCtxt.getCurrentViewId();
	var attachmentHeader = this._viewIdToZssHeaderMap[currentViewId] || 
							{	
								_needToAddZSSHeaders: true,
								_zss_metadata : {secureFiles: [], publicFiles: []}
							}; 

	for(var i = 0, len = files.length; i < len; i++) {
		if(files[i] && files[i].path && files[i].content && files[i].content.file && files[i].content.file.name) {
			if ( addFilesAsSecureLink ) {
				attachmentHeader._zss_metadata.secureFiles.push(files[i].path);
			} else {
				attachmentHeader._zss_metadata.publicFiles.push(files[i].path);
			}
		}
	}
	this._viewIdToZssHeaderMap[currentViewId] = attachmentHeader;
}

// send file details to the server to download it and create an attachmentId.
ZssZimlet.prototype.addFilesAsAttachment =
function(selectedFiles) {
	if(selectedFiles.length) {
		//Get the collection of Attachment Requests
		var requests = this._createAttachmentRequests(selectedFiles);
		var jsonObj = {
			BatchRequest: {
				_jsns: "urn:zimbra",
				AttachMezeoFileRequest: requests
			}
		}
	   var params = {
	        jsonObj: jsonObj,
	        asyncMode: true,
	        callback: (new AjxCallback(this, this._addGeneratedAttachmentIdsToMsg)),
	        errorCallback: (new AjxCallback(this, this._addGeneratedAttachmentIdsToMsgError))
	    };
		appCtxt.getAppController().setStatusMsg(this.messages.attachingFileNotification, ZmStatusView.LEVEL_INFO);
		appCtxt.getAppController().sendRequest(params);
		
	}
};

// Create Individual Attachment requests and return the array of requests
ZssZimlet.prototype._createAttachmentRequests = 
function (files) {
	var requests = [];

	for (var i = files.length - 1; i >= 0; i--) {
		var file = files[i];
		var AttachMezeoFileRequest = {
			"_jsns" : "urn:zimbraMail",
			attach : { 
				uri: file.path
			}
		};
		
		requests.push(AttachMezeoFileRequest);
	};
	return requests;
}

ZssZimlet.prototype._addGeneratedAttachmentIdsToMsg =
function(response) {
	response = response.getResponse();

	//To save multiple attachments in a draft we require a comma separated string of attachment ids.
	var attachmentIds = this._getAttachmentIdsFromResponse(response);
	var view = appCtxt.getCurrentView();
	var callback = new AjxCallback(this, this._handleSaveDraftCallback);
	
	// Need to save the msg as draft to add the attachment
	view._controller.saveDraft(ZmComposeController.DRAFT_TYPE_MANUAL, attachmentIds, null, callback, null);
};

// Returns a string of comma separated attachment ids
ZssZimlet.prototype._getAttachmentIdsFromResponse = 
function (response) {
	var attachmentIds = [];
	var attachMezeoFileResponse = response.BatchResponse.AttachMezeoFileResponse;
	for(var i = 0, len = attachMezeoFileResponse.length; i < len; i++) {
		var attachResponse = attachMezeoFileResponse[i];
		attachmentIds.push(attachResponse.attach.aid);
	}
	return attachmentIds.join(",");
}

ZssZimlet.prototype._addGeneratedAttachmentIdsToMsgError =
function(response) {
	// handle server errors if any while creating the attachment using mezeo path.
	appCtxt.getAppController().setStatusMsg(response.msg, ZmStatusView.LEVEL_WARNING);
};






/*
	SAVE ATTACHMENT FROM EMAIL TO VAULT
*/
ZssZimlet.prototype.addAttachmentHandler = function()
{
	this._msgController = AjxDispatcher.run("GetMsgController");
	var viewType = appCtxt.getViewTypeFromId(ZmId.VIEW_MSG);
	this._msgController._initializeView(viewType);

	for (var mimeType in ZmMimeTable._table ) {
		this._msgController._listView[viewType].addAttachmentLinkHandler(mimeType,"Vault",this.addVaultLink);
	}
	
};
ZssZimlet.prototype.addVaultLink = 
function(attachment) {
	if (appCtxt.isWebClientOffline()) {
		return null;
	}

	var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_zimbra_zss').handlerObject;
	var html =
			"<a href='#' class='AttLink' style='text-decoration:underline;' " +
					"onClick=\"ZssZimlet.saveAttachmentToVault('" + attachment.mid + "','" + attachment.part + "','" + attachment.label+ "', '" + attachment.ct + "')\">"+
					zimletInstance.messages.saveToVaultLink +
					"</a>";
	
	return html;
};

ZssZimlet.saveAttachmentToVault =
function(attachmentId, part, name) {
	var attachment = {
		id: attachmentId,
		part: part,
		name: name
	}
	var self = appCtxt._zimletMgr.getZimletByName('com_zimbra_zss').handlerObject;
 	
 	if(self.folderChooserDialog){
		self.folderChooserDialog.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(self, self._useSelectedVaultContainer, attachment));
		self.folderExplorer.reload();
		self.folderExplorer.setAttachmentToBeSaved(attachment);
		self.folderChooserDialog.popup();
		return;
	}	

	self.dialogFolderView = new DwtComposite(self.getShell());
	self.dialogFolderView.setSize(560, 320); //set width and height
	self.dialogFolderView.getHtmlElement().style.overflow = "hidden"; //adds scrollbar
	
	
	self.folderChooserDialog = self._createDialog({
							title: self.messages.chooseFolderDialogTitle,
							view:self.dialogFolderView, 	
							standardButtons:[
								DwtDialog.OK_BUTTON, 
								DwtDialog.CANCEL_BUTTON
							]
						});

	self.folderChooserDialog.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(self, self._useSelectedVaultContainer, attachment));

	if(!self.folderExplorer){
		self.folderExplorer = new com_zimbra_zss_Explorer({
			rootContainer : self.dialogFolderView,
			vaultPath: self.vaultPath,
			dialog: self.folderChooserDialog,
			isFolderExplorer: true,
			noFilesMsg: self.messages.noFilesFound,
			fetchingContentMsg: self.messages.fetchingContentMsg,
			unprovisionedAccountMsg: self.messages.unprovisionedAccountMsg,
			serviceUnavailableMsg: self.messages.serviceUnavailableMsg,
			serviceTimedOutMsg: self.messages.serviceTimedOutMsg,
			genericFailureMsg: self.messages.genericFailureMsg
		});
	}

	self.folderExplorer.setAttachmentToBeSaved(attachment);
	self.folderChooserDialog.popup();
};

ZssZimlet.prototype._useSelectedVaultContainer =
function(attachment) {
	var selectedContainer = this.folderExplorer.getSelection();
	if (selectedContainer.length) {
		if (this.folderExplorer.selectedFolderHasDuplicateFile) {
			var confirmDialog = appCtxt.getConfirmationDialog();
			var containerName = selectedContainer[0].content.name || selectedContainer[0].content.container.name;
			var msg = AjxMessageFormat.format(this.messages.duplicateFileMessage,[attachment.name, containerName]);
			var callback = this._saveAttachmentToVault.bind(this, selectedContainer, attachment);
			confirmDialog.popup(msg, callback);
		}
		else {
			this._saveAttachmentToVault(selectedContainer, attachment)
		}
	}	
};

ZssZimlet.prototype._saveAttachmentToVault =
function(selectedContainer, attachment) {
	this.folderChooserDialog.popdown();
	if(selectedContainer.length) {
		// Send the details to the server to save the attachment to the selected vault container.
		var jsonObj = {SaveAttachmentToMezeoRequest: {"_jsns": "urn:zimbraMail"}};
		var request = jsonObj.SaveAttachmentToMezeoRequest;
		
		request.attach = {
							mid: attachment.id,
							part: attachment.part,
							name: attachment.name,
							uri: selectedContainer[0].path
						};

	    var params = {
	        jsonObj: jsonObj,
	        asyncMode: true,
	        callback: (new AjxCallback(this, this._handleSaveAttachmentToVaultResponse)),
	        errorCallback: (new AjxCallback(this, this._addGeneratedAttachmentIdsToMsgError))
	    };
	    appCtxt.getAppController().sendRequest(params);
	}
};

ZssZimlet.prototype._handleSaveAttachmentToVaultResponse =
function(response) {
	response = response.getResponse();
	// make this more robust
	if(response.SaveAttachmentToMezeoResponse.attach.uri) {
		appCtxt.getAppController().setStatusMsg(this.messages.fileSavedToVault, ZmStatusView.LEVEL_INFO);
	}
};
ZssZimlet.prototype._handleSaveAttachmentToVaultError =
function(error) {
	//handle save to vault error
	console.log(error);
};

/**
 * Called by the framework just before the email is sent or saved to drafts.
 * @param {array} customMimeHeaders An array of custom-header objects.
 * 				  Each item in the array MUST be an object that has "name" and "_content" properties.
 */
ZssZimlet.prototype.addCustomMimeHeaders =
function(customMimeHeaders) {
	var viewRefId,
		headerContents,
		undoSendInstance = appCtxt._zimletMgr.getZimletByName('com_zimbra_undosend');

	if (undoSendInstance) {
		//Check if the undosend zimlet has triggered the send message operation, if yes, then fetch the viewId from undosend zimlet (stored as _sendMailComposeViewId on send)
		viewRefId = undoSendInstance.handlerObject._sendMailViewId;
		headerContents = viewRefId ? this._viewIdToZssHeaderMap[viewRefId] : null;
	}
	//If the undosend zimlet is not responsible for the message send operation then get the current View id.
	if (!headerContents) {
		viewRefId = appCtxt.getCurrentViewId();
		headerContents = this._viewIdToZssHeaderMap[viewRefId];
	}

	if (headerContents && headerContents._needToAddZSSHeaders) {
		customMimeHeaders.push({name:"X-Zimbra-Presend", _content:"zss"});
		if (headerContents._zss_metadata.secureFiles) {
			for(var i = 0; i < headerContents._zss_metadata.secureFiles.length; i++) {
				customMimeHeaders.push({name:"X-ZSS-SecureFile", _content:headerContents._zss_metadata.secureFiles[i]});
			}
		}
		if (headerContents._zss_metadata.publicFiles) {
			for(var i = 0; i < headerContents._zss_metadata.publicFiles.length; i++) {
				customMimeHeaders.push({name:"X-ZSS-PublicFile", _content:headerContents._zss_metadata.publicFiles[i]});
			}
		}
	}
};

ZssZimlet.prototype.onSendMsgSuccess = function(controller, msg, draftType) {
	if ((draftType && draftType === ZmComposeController.DRAFT_TYPE_NONE) 
		|| (!msg.flags || msg.flags.indexOf('d') === -1)) {
		delete this._viewIdToZssHeaderMap[controller.viewId];
	}
}