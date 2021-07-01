/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 *@Author Raja Rao DV
 */


function com_zimbra_speak() {
}

com_zimbra_speak.prototype = new ZmZimletBase();
com_zimbra_speak.prototype.constructor = com_zimbra_speak;


com_zimbra_speak.SPEAK = "SPEAK_ZIMLET";


com_zimbra_speak.prototype.init =
function() {
};

com_zimbra_speak.prototype.initializeToolbar =
function(app, toolbar, controller, view) {
	if (view == ZmId.VIEW_CONVLIST ||
		view == ZmId.VIEW_CONV ||
		view == ZmId.VIEW_TRAD)
	{
		var buttonIndex = -1;
		for (var i = 0, count = toolbar.opList.length; i < count; i++) {
			if (toolbar.opList[i] == ZmOperation.PRINT) {
				buttonIndex = i + 1;
				break;
			}
		}
		var buttonArgs = {
			tooltip: "Converts the selected message's text to speech",
			index: buttonIndex,
			image: "PlayingMessage"
		};
		var button = toolbar.createOp(com_zimbra_speak.SPEAK, buttonArgs);
		button.addSelectionListener(new AjxListener(this, this._buttonListener, [controller]));
	}
};

com_zimbra_speak.prototype._buttonListener =
function(controller) {
	var message = controller.getMsg();
	if (message) {
		AjxDispatcher.require([ "BrowserPlus" ]);
		var serviceObj = { service: "TextToSpeech" };
		var callback = new AjxCallback(this, this._serviceCallback, [message]);
		ZmBrowserPlus.getInstance().require(serviceObj, callback);
	}
};

com_zimbra_speak.prototype._serviceCallback =
function(message, service) {
	message.load({ callback: new AjxCallback(this, this._doIt, [message, service]) }) ;
};

com_zimbra_speak.prototype._doIt =
function(message, service) {
	var textPart = message.getBodyPart(ZmMimeTable.TEXT_PLAIN);
	this._speak(textPart ? textPart.getContent() : "The message is empty", service);
};

com_zimbra_speak.prototype._speak =
function(text, service) {
	service.Say({ utterance: text }, function() {});
};

