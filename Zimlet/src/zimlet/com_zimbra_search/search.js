/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2006, 2007, 2009, 2010, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2006, 2007, 2009, 2010, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

function Com_Zimbra_Search() {
	this._divID = Dwt.getNextId();
};

Com_Zimbra_Search.prototype = new ZmZimletBase;
Com_Zimbra_Search.prototype.constructor = Com_Zimbra_Search;

Com_Zimbra_Search.HANDLERS = [];

Com_Zimbra_Search.registerHandler = function(ctor) {
	Com_Zimbra_Search.HANDLERS.push(ctor);
};

Com_Zimbra_Search.prototype.init = function() {
	var a = Com_Zimbra_Search.HANDLERS;
	for (var i = 0; i < a.length; ++i) {
		var ctor = a[i];
		var h = a[i] = new ctor(this);
		this.addSearchDomainItem(h.icon, h.label,
					 new AjxListener(this, this.selectListener, h));
	}
};

Com_Zimbra_Search.prototype.selectListener = function(handler) {
	var query = AjxStringUtil.trim(this.getSearchQuery(), true);
	if (query != "") {
		var code = handler.getSearchFormHTML(query);
		if (code) {
			var div = document.getElementById(this._divID);
			if (!div) {
				div = document.createElement("div");
				div.id = this._divID;
				div.style.position = "absolute";
				div.style.left = "-30000px";
				div.style.top = "-30000px";
				document.body.appendChild(div);
			}
			div.innerHTML = code;
			var form = div.getElementsByTagName("form")[0];
			if (/^get$/i.test(form.method)) {
				this._windowOpen(form);
			} else {
				form.submit();
			}
			setTimeout(function() {
				div.removeChild(form);
				form = null;
				div = null;
			}, 1000);
		}
	}
};

Com_Zimbra_Search.prototype._windowOpen = function(form) {
	var fields = form.elements;
	var url = form.action;
	var args = [];
	for (var i = 0; i < fields.length; ++i) {
		var f = fields[i];
		args.push(AjxStringUtil.urlEncode(f.name)
			  + "=" +
			  AjxStringUtil.urlEncode(f.value));
	}
	url = url + "?" + args.join("&");
	window.open(url, "_blank");
};
