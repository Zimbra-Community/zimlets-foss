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
function ZmCloudChatSocket(nodeServer) {
    this.nodeServer = nodeServer;
    this.onConnectEvent = new ZmCloudChatEvent(this);
    this.onReconnectEvent = new ZmCloudChatEvent(this);
    this.onMessageEvent = new ZmCloudChatEvent(this);
    this.onDisconnectEvent = new ZmCloudChatEvent(this);
    this.onReconnectFailedEvent = new ZmCloudChatEvent(this);
    this.onChatRequestEvent = new ZmCloudChatEvent(this);
    this.onLoggedInEvent = new ZmCloudChatEvent(this);
}

ZmCloudChatSocket.prototype.removeAllListeners = function() {
	this.onConnectEvent.removeAllListeners();
    this.onReconnectEvent.removeAllListeners();
    this.onMessageEvent.removeAllListeners();
    this.onDisconnectEvent.removeAllListeners();
    this.onReconnectFailedEvent.removeAllListeners();
    this.onChatRequestEvent.removeAllListeners();
    this.onLoggedInEvent.removeAllListeners();
};

ZmCloudChatSocket.prototype.connect = function() {
    this._io = io.connect(this.nodeServer, {
											'force new connection':true,
											'remember transport': false,
											'try multiple transports': false,
											 transports: ["xhr-polling"]});

    var ZDS = this;
    this._io.on('connect',
    function(message) {
        ZDS.onConnectEvent.notify(message);
    });
    this._io.on('reconnect',
    function(message) {
        ZDS.onReconnectEvent.notify(message);
    });

    this._io.on('message',
    function(message) {
        ZDS.onMessageEvent.notify(message);
    });

    this._io.on('logged_in',
    function(message) {
        ZDS.onLoggedInEvent.notify(message);
    });

    this._io.on('disconnect',
    function(message) {
        ZDS.onDisconnectEvent.notify(message);
    });
    this._io.on('reconnect_failed',
    function(message) {
        ZDS.onReconnectFailedEvent.notify(message);
    });

};

ZmCloudChatSocket.prototype.disconnect = function() {
    this._io.disconnect();
};

ZmCloudChatSocket.prototype.send = function(message, messageType) {
    messageType = messageType ? messageType: "message";
    this._io.emit(messageType, message);
};

ZmCloudChatSocket.prototype.close = function() {
    this._io.close;
};

ZmCloudChatSocket.prototype.getSocket = function() {
    return this._io;
};

ZmCloudChatSocket.prototype.isConnected = function() {
    return this._io.socket.connected;
};
