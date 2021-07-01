/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 *@Author Raja Rao DV
 */

//Zimlet Class
ZmArchiveZimlet = function() {
	this._msgMap = {};
};

//Make Zimlet class a subclass of ZmZimletBase class - this makes a Zimlet a Zimlet
ZmArchiveZimlet.prototype = new ZmZimletBase();
ZmArchiveZimlet.prototype.constructor = ZmArchiveZimlet;

ZmArchiveZimlet.OP_ARCHIVE = "ARCHIVE";
ZmArchiveZimlet.OP_SEND_ARCHIVE = "SEND_ARCHIVE";
ZmArchiveZimlet.view = "message";

ZmArchiveZimlet.prototype.init =
function() {
	this.metaData = appCtxt.getActiveAccount().metaData;
	this.metaData.get("archiveZimlet", null, new AjxCallback(this, this._handleGetMetaData));
};

/**
 * (Implemented w/in com_zimbra_archive Zimlet)
 * Add a new function to ZmListController that basically moves selected items to archive folder
 * @param archiveFolder ZmMailFolder Folder where mail items should be moved to Archive
 */
ZmListController.prototype._doArchiveViaZimlet =
function(archiveFolder, zimlet, skip) {
	var archiveFromCache = appCtxt.getById(zimlet._archiveFolderId);
	if (!archiveFolder || (!skip && !archiveFromCache)) {
		zimlet.resetArchiveFolder();
		this._archiveViaZimletListener(zimlet);
		return;
	}

	this._doMove(this._pendingActionData, archiveFolder);
};

/**
 * Listens to Archive Button  (Implemented w/in com_zimbra_archive Zimlet)
 * @param zimlet ZmZimlet This Zimlet or any Zimlet that implements getArchiveFolder method
 *							 getArchiveFolder function must return folder where we should Archive
 * @param ev
 **/
ZmListController.prototype._archiveViaZimletListener =
function(zimlet, ev) {
	this._pendingActionData = this.getSelection();
	var postCallback = this._doArchiveViaZimlet.bind(this);
	if (!zimlet._archiveFolder) {
		zimlet._chooseArchiveFolder(postCallback);
	}
	else {
		postCallback(zimlet._archiveFolder, zimlet, false);
	}
};

ZmArchiveZimlet.prototype.resetArchiveFolder = 
function() {
	this._archiveFolderId = null;
	this._archiveFolder = null;
};

ZmArchiveZimlet.prototype._chooseArchiveFolder =
function(postCallback) {
	var dialog = appCtxt.getChooseFolderDialog(ZmApp.MAIL);
	dialog.registerCallback(DwtDialog.OK_BUTTON, new AjxCallback(this, this._handleChooseFolder, postCallback));
	var params = {overviewId: dialog.getOverviewId(ZmApp.MAIL), appName:ZmApp.MAIL, skipReadOnly:true, skipRemote:false};
	dialog.popup(params);
};

/**
 * Return true if this folder is suitable to be an "archive" folder.
 * See mailarchive zimlet for usage
 */
ZmArchiveZimlet.prototype._canFolderArchive =
function(folder) {
	var id = Number(folder.nId);
	return id !== ZmFolder.ID_ROOT
			&& id !== ZmFolder.ID_DRAFTS
			&& !folder.isInTrash()
			&& !folder.isInSpam()
			&& !folder.isOutbound();
};


ZmArchiveZimlet.prototype._handleChooseFolder = 
function(postCallback, organizer) {
	if (!this._canFolderArchive(organizer)) {
		var dlg = appCtxt.getMsgDialog();
		dlg.reset();
		dlg.setMessage(this.getMessage("archiveInvalidFolder"), DwtMessageDialog.WARNING_STYLE);
		dlg.popup();
		return;
	}

	var dialog = appCtxt.getChooseFolderDialog();
	dialog.popdown();

	this._archiveFolder = organizer;
	this._archiveFolderId = organizer.id;
	var keyVal = this._getMetaKeyVal();
	this.metaData.set("archiveZimlet", keyVal, null, this._saveAccPrefsHandler.bind(this), null, true);

	if (postCallback) {
		postCallback(organizer, this, true);
	}
};

/**
 * Saves Account preferences.
 */
ZmArchiveZimlet.prototype._saveAccPrefsHandler =
function() {
	appCtxt.getAppController().setStatusMsg(this.getMessage("archiveZimletPrefsSaved"), ZmStatusView.LEVEL_INFO);
};

ZmArchiveZimlet.prototype.initializeToolbar =
function(app, toolbar, controller, viewId) {
	//conversation-list-view or conversation-view or traditional-view(aka message-view)
	if (appCtxt.isChildWindow) {
		return;
	}
	var viewType = appCtxt.getViewTypeFromId ? appCtxt.getViewTypeFromId(viewId) : appCtxt.getCurrentViewId();
	if (viewType == ZmId.VIEW_CONVLIST || viewType == ZmId.VIEW_CONV || viewType == ZmId.VIEW_TRAD || viewType == ZmId.VIEW_MSG) {
		var buttonIndex = 0;
		for (var i = 0, count = toolbar.opList.length; i < count; i++) {
			if (toolbar.opList[i] == ZmOperation.DELETE ||toolbar.opList[i] == ZmOperation.DELETE_MENU) {
				buttonIndex = i;
				break;
			}
		}
		var buttonArgs = {
			text	: this.getMessage("label"),
			tooltip: this.getMessage("archiveButtonToolTip"),
			index: buttonIndex,
			image: "archiveZimletIcon",
			showImageInToolbar: false,
			showTextInToolbar: true,
			enabled: false
		};
		if (!toolbar.getOp(ZmArchiveZimlet.OP_ARCHIVE)) {
			var button = toolbar.createOp(ZmArchiveZimlet.OP_ARCHIVE, buttonArgs);
			button.addSelectionListener(new AjxListener(controller, controller._archiveViaZimletListener, [this]));
			button.archiveZimlet = this;
			// override the function to reset the operations in the toolbar as there is no method to
			// set when to enable or disable buttons based on the selection in the button api
			var originalFunction = controller._resetOperations;
			controller._resetOperations = function(parent, num) {
				originalFunction.apply(controller, arguments);
				var button = parent.getOp(ZmArchiveZimlet.OP_ARCHIVE);
				if (!button) {
					return;
				}
				var zimlet = button.archiveZimlet;
				var archiveFolderId = zimlet._archiveFolderId;
				var archiveEnabled = zimlet._isArchiveEnabled(controller, archiveFolderId, num);
				parent.enable(ZmArchiveZimlet.OP_ARCHIVE, archiveEnabled);
			};
			
			//add listener to listview so that we can enable button when multiple items are selected
            var listView =  controller.getListView ? controller.getListView() : controller.getList();

			if (listView && listView.addSelectionListener) {
				listView.addSelectionListener(new AjxListener(this, this._listActionListener, button));
			}
		}
	}
	else if (viewId.indexOf("COMPOSE") >= 0 && this._archiveFolderId) {
		var visible = true;
		var msg = controller && controller.getMsg();
		if (!msg) {
			visible = false;
		}
		else if (msg.folderId == this._archiveFolderId || msg.folderId == ZmFolder.ID_SENT || msg.folderId == ZmFolder.ID_TRASH	|| msg.folderId == ZmFolder.ID_SPAM) { 
			visible = false; 
		}

		var tooltip = this.getMessage(this._isConvView() ? "sendAndArchiveToolTipConv" : "sendAndArchiveToolTip");

		var buttonArgs = {
			text: this.getMessage("sendAndArchiveButton"),
			tooltip: tooltip,
			index: 0,
			image: "archiveZimletIcon",
			showImageInToolbar: false,
			showTextInToolbar: true,
			enabled: true
		};
		if (!toolbar.getOp(ZmArchiveZimlet.OP_SEND_ARCHIVE) && this.isActionForArchive(controller._action) && this._showSendAndArchive && visible) {
			var button = toolbar.createOp(ZmArchiveZimlet.OP_SEND_ARCHIVE, buttonArgs);
			button.addSelectionListener(new AjxListener(this, this.sendAndArchiveListener, [button]));
		}
		else if (toolbar.getOp(ZmArchiveZimlet.OP_SEND_ARCHIVE)){
			var button = toolbar.getOp(ZmArchiveZimlet.OP_SEND_ARCHIVE);
			if (this._showSendAndArchive && visible) {
				visible = this.isActionForArchive(controller._action);
			}
			button.setEnabled(true);
			button.setVisible(visible);
			button.setToolTipContent(tooltip);
		}
	}
};


ZmArchiveZimlet.prototype._isArchiveEnabled =
function(controller, archiveFolderId, num) {
	if (!num) { //need to check, since in ZmBaseController.prototype._setup num is passed as 0 but selection still returns the previous one.
		return false;
	}
	var sel = controller.getSelection();
	for (var i = 0; i < sel.length; i++) {
		var item = sel[i];
		if (item.isZmConv) {
			var msgFolder = item.msgFolder;
			if (!msgFolder) {
				//this shouldn't happen, but just in case - don't disable the archive button.
				return true;
			}
			for (var msgId in msgFolder) {
				if (msgFolder[msgId] != archiveFolderId) {
					return true;
				}
			}
		}
		else if (item.folderId != archiveFolderId) { //ZmMailMsg
			return true;
		}
	}
	return false;
};

ZmArchiveZimlet.prototype.enableComposeToolbarButtons =
function(toolbar, enabled) {
	var button = toolbar.getOp(ZmArchiveZimlet.OP_SEND_ARCHIVE);
	//Note - button does not exist in case the compose is not a reply/forward/etc but a new compose - it's not archiveable so no send+archive button.
	if (button) {
		button.setEnabled(enabled);
	}
};

ZmArchiveZimlet.prototype.isActionForArchive = 
function(action) {
	if (!action) {
		return false;
	}
	
	if (action == ZmId.OP_REPLY || action == ZmId.OP_REPLY || action == ZmId.OP_REPLY_BY_EMAIL || action == ZmId.OP_REPLY_ALL || action == ZmId.OP_FORWARD ||
	    action == ZmId.OP_FORWARD_ATT  || action == ZmId.OP_FORWARD_INLINE || action == ZmId.OP_FORWARD_BY_EMAIL || action == ZmId.OP_FORWARD_INLINE) {
		return true;
	}
};

ZmArchiveZimlet.prototype._handleGetMetaData = 
function(result) {
	try {
		var response = result.getResponse().BatchResponse.GetMailboxMetadataResponse[0];
		if (response.meta && response.meta[0] && response.meta[0]._attrs ) {
			var hideDeletePref = response.meta[0]._attrs["hideDeleteButton"];
			if (!hideDeletePref) {
				this._hideDeletePref = false;
			}
			else if (hideDeletePref == "false") {
				this._hideDeletePref = false;
			}
			else {
				this._hideDeletePref = true;
			}
			this._hideDeleteButton(this._hideDeletePref);
			
			var showSendAndArchive = response.meta[0]._attrs["showSendAndArchive"];
			if (!showSendAndArchive) {
				this._showSendAndArchive = false;
			}
			else if (showSendAndArchive == "false") {
				this._showSendAndArchive = false;
			}
			else {
				this._showSendAndArchive = true;
			}
			
			this._archiveFolderId = response.meta[0]._attrs["archivedFolder"];
			if (this._archiveFolderId == -1) {
				this._archiveFolderId = null;
				return;
			}
			this._archiveFolder = appCtxt.getById(this._archiveFolderId);
			if (!this._archiveFolder) {
				this._clearArchivedFolder();
			}
		}	
	} catch(ex) {	
		return;
	}
};

ZmArchiveZimlet.prototype._setArchivedFolder = 
function(organizer) {
	this._archiveFolder = organizer;
};

ZmArchiveZimlet.prototype._clearArchivedFolder = 
function() {
	this._archiveFolder = null;
	this._achiveFolderId = null;
	var keyVal = this._getMetaKeyVal();
	keyVal["archivedFolder"] = -1;
	this.metaData.set("archiveZimlet", keyVal, null, new AjxCallback(this, this._handleClearArchivedFolder), null, true);
};

ZmArchiveZimlet.prototype._handleClearArchivedFolder = 
function() {
	return;	
};

ZmArchiveZimlet.prototype.singleClicked =
function() {
	this._showPreferenceDlg();
};

/**
 * Calls singleClicked when doubleClicked on panel item.
 *
 */
ZmArchiveZimlet.prototype.doubleClicked = function() {
	this.singleClicked();
};

/**
 * Called by the Zimbra framework when a menu item is selected
 */
ZmArchiveZimlet.prototype.menuItemSelected = function(itemId) {
	//Note - I do this as a switch for future use, if we add actions to the context menu, other than preferences. Also to be consistent with other zimlets.
	switch (itemId) {
		case "GENERAL_PREFERENCES":
			this._showPreferenceDlg();
			break;
	}
};


ZmArchiveZimlet.prototype._showPreferenceDlg =
function() {
	//if zimlet dialog already exists...
	if (this._preferenceDialog) {
		this._updatePrefView(this._archiveFolder, this);
		this._preferenceDialog.popup();
		return;
	}
	this._preferenceView = new DwtComposite(this.getShell());
	this._preferenceView.getHtmlElement().style.overflow = "auto";
	this._preferenceView.getHtmlElement().innerHTML = this._createPrefView();
	this._preferenceDialog = this._createDialog({title:this.getMessage("archivePrefsTitle"), view:this._preferenceView, standardButtons:[DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON]});
	this._preferenceDialog.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._okPreferenceBtnListener));

	var folderString = this.getMessage("archiveFolderBrowse");
	if (this._archiveFolder) {
		folderString = this._archiveFolder.getPath(false);
	}
	this._folderTxt = new DwtText({parent:appCtxt.getShell(), parentElement:document.getElementById("ARCHIVE_ZIMLET_FOLDER"), index:0, id:"ARCHIVE_ZIMLET_FOLDER_TEXT", className:"FakeAnchor"});
	this._folderTxt.isLinkText = true;
	this._folderTxt.setText(folderString);
	this._folderTxt.getHtmlElement().onclick = this._chooseArchiveFolder.bind(this, this._updatePrefView);
	this._preferenceDialog.popup();
};

ZmArchiveZimlet.prototype._createPrefView =
function() {
	var hideDelete = this._hideDeletePref ? "checked" : "";
	var noHideDelete = this._hideDeletePref ? "" : "checked";
	
	var hideSendAndArchive = this._showSendAndArchive ? "" : "checked";
	var showSendAndArchive = this._showSendAndArchive ? "checked" : "";

	return [
		"<div class='mailArchivePrefDialog'>",
		"<table class='ZPropertySheet' cellspacing='6'>",
		"<tr><td style='text-align:right;'>" + this.getMessage("archiveFolderPrefLabel") + ": </td><td id='ARCHIVE_ZIMLET_FOLDER'></td></tr>" +
		"<tr><td style='text-align:right;'>" + this.getMessage("archiveHideDeleteButton") + ": </td><td>",
		"<table class='ZRadioButtonTable'><tr>",
        "<td><input id='archiveHideDelete2' name='archiveHideDelete' value='false' " + noHideDelete + " type='radio'/></td>",
        "<td><label style='margin-right:1em;' for='archiveHideDelete2'>" + this.getMessage("archiveShow") + "</label></td>",
        "<td><input id='archiveHideDelete1' name='archiveHideDelete' value='true' " + hideDelete + " type='radio'/></td>",
        "<td><label for='archiveHideDelete1'>" + this.getMessage("archiveHide") + "</label></td>",
        "</tr></table>",
		"<tr><td style='text-align:right;'>" + this.getMessage("sendAndArchiveLabel") + ":</td><td>",
		"<table class='ZRadioButtonTable'><tr>",
		"<td><input id='sendAndArchive2' name='sendAndArchive' value='true' " + showSendAndArchive + " type='radio'/></td>",
		"<td><label style='margin-right:1em;' for='sendAndArchive1'>" + this.getMessage("archiveShow") + "</label></td>",
		"<td><input id='sendAndArchive1' name='sendAndArchive' value='false' " + hideSendAndArchive + " type='radio'/></td>",
		"<td><label for='sendAndArchive1'>" + this.getMessage("archiveHide") + "</label></td>",
		"</tr></table>",	
		"</td></tr>",
		"</table>",
		"</div>"
	].join("");
};
ZmArchiveZimlet.prototype._updatePrefView = 
function(organizer, zimlet) {
	if (organizer) {
		zimlet._folderTxt.setText(organizer.getPath(false));	
	}
};

ZmArchiveZimlet.prototype._okPreferenceBtnListener =
function() {
	if (!this._archiveFolderId) {
		var dlg = appCtxt.getMsgDialog();
		dlg.reset();
		dlg.setMessage(this.getMessage("archiveMustChooseFolder"), DwtMessageDialog.WARNING_STYLE);
		dlg.popup();
		return;
	}
	var origHideDelete = this._hideDeletePref;
	var origShowSendAndArchive = this._showSendAndArchive;
	var hideDelete = document.getElementById("archiveHideDelete1").checked;
	var noHideDelete = document.getElementById("archiveHideDelete2").checked;

	var showSendAndArchive = document.getElementById("sendAndArchive2").checked;
	var hideSendAndArchive = document.getElementById("sendAndArchive1").checked;

	
	this._preferenceDialog.popdown();
	
	this._hideDeletePref = hideDelete ? true : false;
	this._showSendAndArchive = showSendAndArchive ? true : false;
	
	if (origHideDelete == this._hideDeletePref && origShowSendAndArchive == this._showSendAndArchive) {
		return;
	}
	
	var keyVal = this._getMetaKeyVal();
	
	this.metaData.set("archiveZimlet", keyVal, null, new AjxCallback(this, this._handleSetArchivePrefs), null, true);

};

ZmArchiveZimlet.prototype._hideDeleteButton = 
function(hidden) {
	if (appCtxt.getCurrentAppName() !== ZmApp.MAIL) {
		return;
	}
	var app = appCtxt.getApp(ZmApp.MAIL);
	var mlc = app.getMailListController();
	var toolbar = mlc.getCurrentToolbar();
	if (!toolbar) {
		return;
	}
	var delButton = toolbar.getButton(ZmOperation.DELETE) || toolbar.getButton(ZmOperation.DELETE_MENU);
	if (!delButton) {
		return;
	}
	var delHtmlEl = delButton.getHtmlElement();
	if (this._savedDelButtonDisplayStyle === undefined) {
		//this is the first time this is called, so it's visible - cache the old display style. (could be "block", or "inline" or "inline-block" - we need to make sure to remember as to not mess it up.)
		this._savedDelButtonDisplayStyle = delHtmlEl.style.display;
	}
	//set it always since we might be switching from hidden to visible (if user changed the Zimlet pref of "show delete button")
	delHtmlEl.style.display = hidden ? "none" : this._savedDelButtonDisplayStyle;
};

ZmArchiveZimlet.prototype._handleSetArchivePrefs = 
function() {
	this._hideDeleteButton(this._hideDeletePref);
	appCtxt.getAppController().setStatusMsg(this.getMessage("archiveZimletPrefsSaved"), ZmStatusView.LEVEL_INFO);
};

ZmArchiveZimlet.prototype.onSelectApp = 
function(appId) {
	if (appId == ZmApp.MAIL && this._hideDeletePref != null && !this.mailAlreadyLoaded)  {
		this._hideDeleteButton(this._hideDeletePref);
		this.mailAlreadyLoaded = true;
	}
};

ZmArchiveZimlet.prototype.sendAndArchiveListener = 
function(button) {
	if (button) {
		button.setEnabled(false);
	}
	var cc = appCtxt.getApp(ZmApp.MAIL).getComposeController(appCtxt.getApp(ZmApp.MAIL).getCurrentSessionId(ZmId.VIEW_COMPOSE));
	//var callback = new AjxCallback (this,this._handleArchive);
	if (cc && cc._msg && cc._msg.id) {
		this._msgMap[cc._msg.id] = true;
	}
	cc.sendMsg();
	//cc.sendMsg(null, null, callback);
};

ZmArchiveZimlet.prototype._handleArchive = 
function(result) {
	//get the ID from the response
	if (result && result.Body && result.Body.SendMsgResponse && result.Body.SendMsgResponse.m) {
		var msgId = result.Body.SendMsgResponse.m[0].id;
		this._msgMap[msgId] = true;
	}
	
};

/**
 * the user clicked the regular "send" button - remove the id from the _msgMap so it does not archive.
 * The id might be there in the case the user clicked "send+archive" and the spell checker caught it (or any other error)
 * and then the user just clicks "send" (not "send+archive"). It's kind of a corner case I think. But we need to deal with it.
 * @param controller
 * @param msg
 */
ZmArchiveZimlet.prototype.onSendButtonClicked = function(controller, msg) {
	if (!msg) {
		return;
	}
	var id = msg.id || (msg._origMsg && msg._origMsg.id);
	delete this._msgMap[id];
};

ZmArchiveZimlet.prototype.onSendMsgSuccess = function(controller, msg) {

	var id = msg.origId;
	if (!id) {
		//nothing to archive, shouldn't happen from send+archive since it won't have "send+archive" for new message.
		return;
	}
	if (!this._msgMap[id]) {
		//note to self - _msgMap is weird - I don't think it could really have multiple items (so not sure need for a map rather than one item),
		// but keep it this way. Basically it's a way to check that the message sent also had the "send+archive" button clicked for.
		//I believe usually it's pretty immediate so it would only be one message there.
		return;
	}
	delete this._msgMap[id];

	var item = appCtxt.getById(id);
	var listController = appCtxt.getCurrentApp().getMailListController();
	if (this._isConvView()) {
		var cid = msg.cid || (msg._origMsg && msg._origMsg.cid);
		var conv = cid && appCtxt.getById(cid);
		item = conv || item;
	}
	listController._doMove([item], this._archiveFolder);

};

ZmArchiveZimlet.prototype._isConvView =
function() {
	return appCtxt.get(ZmSetting.GROUP_MAIL_BY) === ZmSetting.GROUP_BY_CONV;
};

ZmArchiveZimlet.prototype._getMetaKeyVal = 
function() {
	var keyVal = [];
	keyVal["hideDeleteButton"] = this._hideDeletePref ? "true" : "false";
	keyVal["showSendAndArchive"] = this._showSendAndArchive ? "true" : "false";
	keyVal["archivedFolder"] = this._archiveFolderId;
	return keyVal;
};
