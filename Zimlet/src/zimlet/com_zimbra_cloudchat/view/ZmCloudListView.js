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
function ZmCloudListView(zimlet, model, controller) {
	this.zimlet = zimlet;
	this.model = model;
	this.controller = controller;

	if(controller) {
		this.routingKey = controller.routingKey ? controller.routingKey : "";
	}
	this.isRendered = false;
	this._oldIsTypingCharCount = 0;
}

ZmCloudListView.prototype.setCloudChatFolder = function(folder) {
	this.folder = folder;
};

ZmCloudListView.prototype.setSendBtnAndInputField = function(sendBtn, inputFieldId) {
	this.inputField = document.getElementById(inputFieldId);
	var callback = AjxCallback.simpleClosure(this._inputFieldKeyHdlr, this);
	Dwt.setHandler(this.inputField , DwtEvent.ONKEYUP, callback);

	sendBtn.addSelectionListener(new AjxListener(this,
			this._handleSendBtn));
};

ZmCloudListView.prototype._inputFieldKeyHdlr =
function(ev) {
	var event = ev || window.event;
	if (event.keyCode == undefined) {
		return;
	}
	if (event.keyCode != 13) {//if not enter key
		this._sendIsTyping();
		return;
	}
	this._oldIsTypingCharCount = 0;//reset
	this._handleSendBtn();
};

ZmCloudListView.prototype._sendIsTyping = function() {
	if(this._oldIsTypingCharCount == 0
			|| (this.inputField.value.length - this._oldIsTypingCharCount) > 10
			|| (this.inputField.value.length - this._oldIsTypingCharCount) < 0) {
		this._oldIsTypingCharCount = this.inputField.value.length;
		this.controller.sendUserIsTyping(this.routingKey);
	}

};

ZmCloudListView.prototype._handleSendBtn = function() {
	if(this.inputField.value == "") {
		return;
	}
	this.controller.sendMessage(JSON.stringify({"action":"PUBLISH",routingKey: this.routingKey, data: this.inputField.value}));
	this.inputField.value = "";
};

//override this !
ZmCloudListView.prototype.createView = function() {

};