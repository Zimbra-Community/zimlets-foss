/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2009, 2010, 2013, 2014 Zimbra, Inc.
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
 * All portions of the code are Copyright (C) 2009, 2010, 2013, 2014 Zimbra, Inc. All Rights Reserved. 
 * ***** END LICENSE BLOCK *****
 */

/**
 * Allows downloading a single email message.
 * 
 * @author Raja Rao DV
 */
function com_zimbra_emaildownloader_HandlerObject() {
}

com_zimbra_emaildownloader_HandlerObject.prototype = new ZmZimletBase();
com_zimbra_emaildownloader_HandlerObject.prototype.constructor = com_zimbra_emaildownloader_HandlerObject;

/**
 * Simplify handler object
 *
 */
var EmailDownloaderZimlet = com_zimbra_emaildownloader_HandlerObject;

/**
 * Called by the framework on an droppedItem drop.
 * 
 * @param	{ZmConv|ZmMailMsg}	droppedItem		the dropped message object
 */
EmailDownloaderZimlet.prototype.doDrop =
function(droppedItem) {
	var ids = [];
	var msgObjs = [];
	var fmt = "zip";
	if(droppedItem instanceof Array) {
		for(var i =0; i < droppedItem.length; i++) {
			var obj = droppedItem[i].srcObj ?  droppedItem[i].srcObj :  droppedItem[i];
			if(obj.type == "CONV") {
				ids = ids.concat(this._getMsgIdsFromConv(obj));
			} else if(obj.type == "MSG") {
				ids.push(obj.id);
			} else if(obj.TYPE == "ZmContact") {
				ids.push(obj.id);
			} else if(obj.TYPE == "ZmAppt" || obj.type == "APPT") {
				ids.push(obj.id);
			}
		}
	} else {
		var obj = droppedItem.srcObj ? droppedItem.srcObj : droppedItem;
		if (obj.type == "CONV"){
			ids = this._getMsgIdsFromConv(obj);
		} else if(obj.type == "MSG") {
			ids.push(obj.id);
		} else if(obj.TYPE == "ZmContact") {
			ids.push(obj.id);
			fmt = "vcf";
		} else if(obj.TYPE == "ZmAppt" || obj.type == "APPT") {
			ids.push(obj.id);
			fmt = "ics";
		}
	}

	var url = [];
	var i = 0;
	var proto = location.protocol;
	var port = Number(location.port);
	url[i++] = proto;
	url[i++] = "//";
	url[i++] = location.hostname;
	if (port && ((proto == ZmSetting.PROTO_HTTP && port != ZmSetting.HTTP_DEFAULT_PORT) 
		|| (proto == ZmSetting.PROTO_HTTPS && port != ZmSetting.HTTPS_DEFAULT_PORT))) {
		url[i++] = ":";
		url[i++] = port;
	}
	url[i++] = "/home/";
	url[i++]= AjxStringUtil.urlComponentEncode(appCtxt.getActiveAccount().name);
	url[i++] = "/?fmt=";
	url[i++] = fmt;
	url[i++] = "&list=";
	url[i++] = ids.join(",");
	url[i++] = "&filename=ZimbraItems";
	
	var getUrl = url.join(""); 
	window.open(getUrl, "_blank");
};

EmailDownloaderZimlet.prototype._getMsgIdsFromConv =
function(convSrcObj) {
	convSrcObj.load();
	return  convSrcObj.msgIds;
};