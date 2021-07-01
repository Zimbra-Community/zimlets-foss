/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2011, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2011, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
function ZmCloudChatAddUsersDlg(buddyListController) {
	if(!buddyListController) {
		return;
	}
	this.buddyListController = buddyListController;
    this.zimlet = buddyListController.app.zimlet;

    this._dialogView = new DwtComposite(appCtxt.getShell());
    this._dialogView.setSize("500px", "30px");
	var addBtn = new DwtDialog_ButtonDescriptor(ZmCloudChatAddUsersDlg.ADD_BTN_ID, this.zimlet.getMessage("add"), DwtDialog.ALIGN_RIGHT);

    var params = {
        parent: appCtxt.getShell(),
        title: "Enter one or more email(s) to add",
        view: this._dialogView,
        standardButtons: [DwtDialog.CANCEL_BUTTON],
		extraButtons : [addBtn]
    };
    DwtDialog.call(this, params);
	this._createView();
	this._addUsersField = document.getElementById("cloudChatZimlet_add_user_field");
	this.setButtonListener(ZmCloudChatAddUsersDlg.ADD_BTN_ID, new AjxListener(this, this._addBtnHandler));
}

ZmCloudChatAddUsersDlg.prototype = new DwtDialog;
ZmCloudChatAddUsersDlg.prototype.constructor = ZmCloudChatAddUsersDlg;

ZmCloudChatAddUsersDlg.ADD_BTN_ID = "cloudChat_add_user_dlg_add_btn_id";

ZmCloudChatAddUsersDlg.prototype.popup = function() {
	this._addUsersField.value = "";
	DwtDialog.prototype.popup.apply(this);
	if(!this._isInitialized) {
		this._addAutoCompleteHandler();
		this._isInitialized = true;
	}
	this._addUsersField.focus();
};

ZmCloudChatAddUsersDlg.prototype._addAutoCompleteHandler =
function() {
	if (appCtxt.get(ZmSetting.CONTACTS_ENABLED) || appCtxt.get(ZmSetting.GAL_ENABLED)) {
		var params = {
			dataClass:		appCtxt.getAutocompleter(),
			matchValue:		ZmAutocomplete.AC_VALUE_EMAIL
		};
		this._acAddrSelectList = new ZmAutocompleteListView(params);
		this._acAddrSelectList.handle(this._addUsersField);
	}
};

ZmCloudChatAddUsersDlg.prototype._createView =
function() {
	var html = [];
	html.push("<div><input id='cloudChatZimlet_add_user_field' style='width:500px'></div>");
	this._dialogView.getHtmlElement().innerHTML = html.join("");
};

ZmCloudChatAddUsersDlg.prototype._addBtnHandler =
function() {
	var participants = [];
	var emails = this._addUsersField.value;
	emails = AjxEmailAddress.parseEmailString(emails);
	if(emails.good) {
		var arry = emails.good.getArray();
		for(var i = 0; i < arry.length; i++) {
			participants.push({email: arry[i].address});
		}
	}
	if(participants.length == 0){
		return;
	}
	this.popdown();
	this.buddyListController.addNewUsers(participants);
};
