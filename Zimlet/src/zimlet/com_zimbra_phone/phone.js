/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

function Com_Zimbra_Phone() {
}

Com_Zimbra_Phone.prototype = new ZmZimletBase();
Com_Zimbra_Phone.prototype.constructor = Com_Zimbra_Phone;

// Consts
Com_Zimbra_Phone.PEOPLE_SEARCH_TOOLBAR_ID	= "phone";



Com_Zimbra_Phone.prototype._getHtmlContent =
function(html, idx, phone, context) {
	var call = Com_Zimbra_Phone.getCallToLink(phone);

	html[idx++] = [
			'<a href="',
			call,
			'" onclick="window.top.Com_Zimbra_Phone.unsetOnbeforeunload()">',
			AjxStringUtil.htmlEncode(phone),
			'</a>'
	].join("");

	return idx;
};

Com_Zimbra_Phone.prototype.toolTipPoppedUp =
function(spanElement, contentObjText, matchContext, canvas) {
	var subs = {contentObjText: contentObjText, callStr: this.getMessage("call")};
	canvas.innerHTML = AjxTemplate.expand("com_zimbra_phone.templates.Phone#Tooltip", subs);
};

Com_Zimbra_Phone.prototype.menuItemSelected =
function(itemId) {
	switch (itemId) {
		case "SEARCH":		this._searchListener(); break;
		case "ADDCONTACT":	this._contactListener(); break;
		case "CALL":		this._callListener(); break;
	}
};

Com_Zimbra_Phone.prototype.onPeopleSearchShow =
function(peopleSearch, contact, rowId) {
    peopleSearch._clearText(rowId+"-phone");
	var phone = contact && contact.getAttr(ZmContact.F_workPhone);
    if(phone){
        var phoneTxt = new DwtText({parent:appCtxt.getShell(), parentElement:rowId+"-phone", index:0, id:"NewCall", className:"FakeAnchor"});
        phoneTxt.isLinkText = true;
        phoneTxt.setText(phone);
        phoneTxt.addListener(DwtEvent.ONMOUSEDOWN, new AjxListener(this, this._peopleSearchItemListener));
        phoneTxt.addListener(DwtEvent.ONMOUSEOVER, new AjxListener(this, peopleSearch.peopleItemMouseOverListener));
        phoneTxt.addListener(DwtEvent.ONMOUSEOUT, new AjxListener(this, peopleSearch.peopleItemMouseOutListener));
    }

};

Com_Zimbra_Phone.prototype._peopleSearchItemListener =
function(ev) {
	var workPhone = ev.target.innerHTML;
	var phone = Com_Zimbra_Phone.getCallToLink(workPhone);
	Com_Zimbra_Phone.unsetOnbeforeunload();
	window.location = phone;
};


Com_Zimbra_Phone.prototype._searchListener =
function() {
	appCtxt.getSearchController().search({query: this._actionObject});
};

Com_Zimbra_Phone.prototype._contactListener =
function() {
	var contact = new ZmContact(null);
	contact.initFromPhone(this._actionObject,this.getConfig("defaultContactField"));
	AjxDispatcher.run("GetContactController").show(contact);
};

Com_Zimbra_Phone.prototype._callListener =
function() {
	var phone = Com_Zimbra_Phone.getCallToLink(this._actionObject.toString());
	Com_Zimbra_Phone.unsetOnbeforeunload();
	window.location = phone;
};

Com_Zimbra_Phone.resetOnbeforeunload =
function() {
	window.onbeforeunload = ZmZimbraMail._confirmExitMethod;
};

Com_Zimbra_Phone.unsetOnbeforeunload =
function() {
	window.onbeforeunload = null;
	this._timerObj = new AjxTimedAction(null, Com_Zimbra_Phone.resetOnbeforeunload);
	AjxTimedAction.scheduleAction(this._timerObj, 3000);
};

Com_Zimbra_Phone.getCallToLink =
function(phoneIn) {
	if (!phoneIn) { return ""; }

	var phone = AjxStringUtil.trim(phoneIn, true);
	if (!/^(?:\+|00)/.test(phone)) {
		if(this.countryCode == 1) {//use countrycode(when its missing) only for US(for now)
			phone = "+1" + phone;
		}
	}
	return "callto:" + phone;
};

Com_Zimbra_Phone.prototype.match = function(line, startIndex) {
	var re = this.RE;
	re.lastIndex = startIndex;
	var m = re.exec(line);
	if (!m) { return m; }

	var phone = m[0];
	// bug 73264, don't identify long digit sequence (length > 10) without separators as phone number
	if (phone.length > 10 &&
		phone[0] != "+"   &&
		!(AjxUtil.arrayContains(phone, " ")) &&
		!(AjxUtil.arrayContains(phone, ".")) &&
		!(AjxUtil.arrayContains(phone, "-"))) {
			return null;
	} else {
		m[0] = phone;
		return m;
	}
}
