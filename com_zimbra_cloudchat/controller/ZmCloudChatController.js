/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2011, 2014 Zimbra, Inc.
 * 
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at: http://www.zimbra.com/license
 * The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 
 * have been added to cover use of software over a computer network and provide for limited attribution 
 * for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B. 
 * 
 * Software distributed under the License is distributed on an "AS IS" basis, 
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. 
 * See the License for the specific language governing rights and limitations under the License. 
 * The Original Code is Zimbra Open Source Web Client. 
 * The Initial Developer of the Original Code is Zimbra, Inc. 
 * All portions of the code are Copyright (C) 2011, 2014 Zimbra, Inc. All Rights Reserved. 
 * ***** END LICENSE BLOCK *****
 */
function ZmCloudChatController(zimlet, model, socket) {
	this.zimlet = zimlet;
	this.model = model;
	this._socket = socket;
	this.view; //chatlistview set itself as the view
}

ZmCloudChatController.prototype.setView = function(view) {
	this.view = view;
};

ZmCloudChatController.prototype.sendMessage = function(message) {
	this._socket.send(message);
};

ZmCloudChatController.prototype.resetSocketListeners = function() {
	this._socket.onConnectEvent.removeAllListeners();
		this._socket.onConnectEvent.attach(AjxCallback.simpleClosure(
			this._displayConnectionData, this, "connected"));

	
	this._socket.onMessageEvent.removeAllListeners();
	this._socket.onMessageEvent.attach(AjxCallback.simpleClosure(
			this.model.addMessage, this.model));
	
	this._socket.onDisconnectEvent.removeAllListeners();
	this._socket.onDisconnectEvent.attach(AjxCallback.simpleClosure(
			this._displayConnectionData, this, "disconnected"));
	
	this._socket.onReconnectFailedEvent.removeAllListeners();
	this._socket.onReconnectFailedEvent.attach(AjxCallback.simpleClosure(
			this._displayConnectionData, this, "Reconnection failed"));
};

ZmCloudChatController.prototype.displayMessage = function(message) {
	this.model.addMessage(message);
};

ZmCloudChatController.prototype.displayConnectionMessage = function(message) {
	this.model.addConnectionMessage(message);
};