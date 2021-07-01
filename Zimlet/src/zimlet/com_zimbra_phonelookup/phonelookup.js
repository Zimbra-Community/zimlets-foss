/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2010, 2011, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2010, 2011, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/*
* @author Raja Rao DV (rrao@zimbra.com)
*/


function com_zimbra_phonelookup_handlerObject() {
};

com_zimbra_phonelookup_handlerObject.prototype = new ZmZimletBase();
com_zimbra_phonelookup_handlerObject.prototype.constructor = com_zimbra_phonelookup_handlerObject;

var PhoneLookupTooltipZimlet = com_zimbra_phonelookup_handlerObject;
PhoneLookupTooltipZimlet.API_KEY = "a374f585afac4e9539549d876cba193b";
PhoneLookupTooltipZimlet.BASE_URL = "http://api.whitepages.com/reverse_phone/1.0/";

/**
 * This method is called by Phone Lookup Zimlet notifying this Zimlet(phoneLookup) to add Phone Lookup slide to the tooltip
 */
PhoneLookupTooltipZimlet.prototype.onEmailHoverOver =
function(emailZimlet) {
	emailZimlet.addSubscriberZimlet(this, false);
	this.emailZimlet = emailZimlet;
	this._addSlide();
};

PhoneLookupTooltipZimlet.prototype._addSlide =
function() {
	var tthtml = this._getTooltipBGHtml();
	var selectCallback =  new AjxCallback(this, this._handleSlideSelect);
	
	this._slide = new EmailToolTipSlide(tthtml, true, "phoneLookupZimletIcon", selectCallback, "Phone Reverse Lookup");
	this.emailZimlet.slideShow.addSlide(this._slide);
	this._slide.setCanvasElement(document.getElementById("phoneLookupZimlet_searchResultsDiv"));
	this._addSearchHandlers();
};

PhoneLookupTooltipZimlet.prototype._handleSlideSelect =
function() {
	if(this._slide.loaded) {
		return;
	}
	document.getElementById("phoneLookupZimlet_MainDiv").style.height = document.getElementById(this._slide.id).offsetHeight;
	this._setSearchFieldValue(this._getDefaultQuery());
	this._searchTwitter();
	if(this._slide) {
		this._slide.loaded = true;	
	}
};

PhoneLookupTooltipZimlet.prototype._getDefaultQuery = function() {
	//Sometimes phonenumber appears in Name-part, like: "6501231234" <message@att.com> and we should pick that up
	var fullName = this.emailZimlet.fullName;
	var reg = new RegExp("^\\d*$"); 
	if(fullName && reg.test(fullName)) {
		return fullName;
	}

	var tmpArry = this.emailZimlet.emailAddress.split("@");
	var part1 = tmpArry[0] ?  tmpArry[0] : "";
	part1  = part1.replace("+", "").replace(/ /g, "").replace(/-/, "").replace(/\(/, "").replace(/\)/, "");

	if(part1.indexOf("1") == 0 && part1.length == 11) {
		part1 = part1.substring(1, 11);
	}
	return part1;
};

PhoneLookupTooltipZimlet.prototype._searchTwitter =
function() {
	this._slide.setInfoMessage(this.getMessage("searching"));
	var q = this._getSearchFieldValue();
	var url = PhoneLookupTooltipZimlet.BASE_URL;
	var params = ["phone=", "=", AjxStringUtil.urlComponentEncode(q), ";api_key=", PhoneLookupTooltipZimlet.API_KEY].join(""); 
	var entireurl = [url, "?", params].join(""); 

	var encodedEntireurl = AjxStringUtil.urlComponentEncode(entireurl); 
	var proxyUrl = [ZmZimletBase.PROXY, encodedEntireurl].join(""); 
	AjxRpc.invoke(null, proxyUrl, null, new AjxCallback(this, this._phoneLookupCallback), true);
};

PhoneLookupTooltipZimlet.prototype._phoneLookupCallback =
function(response) {
	if (!response.success) {
		var transitions = [ ZmToast.FADE_IN, ZmToast.PAUSE, ZmToast.PAUSE,  ZmToast.FADE_OUT ];
		appCtxt.getAppController().setStatusMsg(this.getMessage("phoneLookupError") + response.text, ZmStatusView.LEVEL_WARNING, null, transitions);
		return;
	}
	var jsonObj = new AjxXmlDoc.createFromDom(response.xml).toJSObject(true, false);
	this._appendphoneLookupResult(jsonObj);
};

PhoneLookupTooltipZimlet.prototype._appendphoneLookupResult =
function(jsonObj) {
	if(jsonObj && jsonObj.errormessages && jsonObj.errormessages.message) {
		this._slide.setErrorMessage(jsonObj.errormessages.message.toString() + "<br/><br/>"+ this.getMessage("mustBeValidNumber"));
		return;
	}
	var listings = jsonObj.listings;
	if(!listings || !listings.listing) {
		this._slide.setErrorMessage(this.getMessage("mustBeValidNumber"));
		return;
	}
	var listing;
	if(listings instanceof Array) {
		listing = listings[0].listing;
	} else {
		listing = listings.listing;
	}
	if(!listing) {
		this._slide.setErrorMessage(this.getMessage("mustBeValidNumber"));
		return;
	}
	var address = listing.address;
	var subs = {
		fullStreet: address.fullstreet ? address.fullstreet : "",
		city: address.city ? address.city.toString() : "",
		state: address.state ? address.state.toString() : "",
		country: address.country ? address.country.toString() : "",
		zip: address.zip ? address.zip.toString() : "",
		displayName: listing.displayname ? listing.displayname.toString() : ""
	};
	var html = AjxTemplate.expand("com_zimbra_phonelookup.templates.PhoneLookup#RowItem", subs);
	document.getElementById("phoneLookupZimlet_searchResultsDiv").innerHTML = html;
};

PhoneLookupTooltipZimlet.prototype._setSearchFieldValue =
function(val) {
	document.getElementById("phoneLookupZimlet_seachField").value = val;
};

PhoneLookupTooltipZimlet.prototype._getSearchFieldValue =
function() {
	return document.getElementById("phoneLookupZimlet_seachField").value;
};

PhoneLookupTooltipZimlet.prototype._getTooltipBGHtml =
function() {
	return AjxTemplate.expand("com_zimbra_phonelookup.templates.PhoneLookup#Frame");
};

PhoneLookupTooltipZimlet.prototype._setTooltipSticky =
function(sticky) {
	if(sticky) {
		this.emailZimlet.tooltip._poppedUp = false;//set this to make tooltip sticky
	} else {
		this.emailZimlet.tooltip._poppedUp = true;
	}
};

PhoneLookupTooltipZimlet.prototype._setTooltipNotSticky =
function() {
	this.emailZimlet.tooltip._poppedUp = true;
};

PhoneLookupTooltipZimlet.prototype._addSearchHandlers =
function() {
	document.getElementById("phoneLookupZimlet_MainDiv").onmouseover =  AjxCallback.simpleClosure(this._setTooltipSticky, this, true);
	document.getElementById("phoneLookupZimlet_MainDiv").onmouseout =  AjxCallback.simpleClosure(this._setTooltipSticky, this, false);
	var btn = new DwtButton({parent:this.emailZimlet.getShell()});
	btn.setText("Search");
	btn.setImage("phoneLookupZimletIcon");
	btn.addSelectionListener(new AjxListener(this, this._searchTwitter));
	document.getElementById("phoneLookupZimlet_seachBtnCell").appendChild(btn.getHtmlElement());
};
