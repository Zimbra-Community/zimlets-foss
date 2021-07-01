/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2011, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2011, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Zimlet to handle integration with a Yahoo! Maps
 *
 * @author Raja Rao DV
 */
function ZmGMapsZimlet() {
}

ZmGMapsZimlet.prototype = new ZmZimletBase();
ZmGMapsZimlet.prototype.constructor = ZmGMapsZimlet;



/**
 * GMaps Static map url
 */
ZmGMapsZimlet.URL = "http://maps.google.com/maps/api/staticmap";
ZmGMapsZimlet.URLPARAMS = [];
ZmGMapsZimlet.URLPARAMS["size"] = "345x245";
ZmGMapsZimlet.URLPARAMS["zoom"] = "12";
ZmGMapsZimlet.URLPARAMS["sensor"] = "false";
ZmGMapsZimlet.URLPARAMS["markers"] = "size:mid|color:red|";
ZmGMapsZimlet.URLPARAMS["center"] = "";


/**
 * Map image URI cache.
 */
ZmGMapsZimlet.CACHE = [];


/**
 * Called by the framework when generating the span for in-context link.
 *
 */
ZmGMapsZimlet.prototype.match =
function(line, startIndex) {
	this._setRegExps();
	if (this._regexps.length == 0) {
		return;
	}

	var a = this._regexps;
	var ret = null;
	for (var i = 0; i < a.length; ++i) {
		var re = a[i];
		re.lastIndex = startIndex;
		var m = re.exec(line);
		if (m && m[0] != "") {
			if(this._skipRegex && this._skipRegex.test(m[0])) {
				continue;
			}

			if (!ret || m.index < ret.index) {
				ret = m;
				ret.matchLength = m[0].length;
				return ret;
			}
		}
	}
	return ret;
};

ZmGMapsZimlet.prototype._setRegExps =
function() {
	if(this._regexps) {
		return this._regexps;
	}
	var re = this.getMessage("completeAddressRegex");
	if(!re || re == "\"\"") {
		var addressFirstPartRegEx = this.getMessage("addressFirstPartRegEx");
		var zipCodeRegEx = this.getMessage("zipCodeRegEx");
		var countryNameRegEx = this.getMessage("countryNameRegEx");
		re = [addressFirstPartRegEx , "(", zipCodeRegEx, "|", countryNameRegEx, ")"].join("");
	}
	this._regexps = new Array();
	this._regexps.push(new RegExp(re, "ig"));
	var sRE = this.getMessage("skipRegex");
	if(!sRE || sRE == "\"\"") {
		this._skipRegex = null;
	} else {
		this._skipRegex = new RegExp(AjxStringUtil.trim(sRE), "ig");
	}	
};

/**
 * Called when clicked on matched text.
 */
ZmGMapsZimlet.prototype.clicked =
function(spanElem, contentObj, matchContext, canvas) {
	var lang = this.getMessage("mapLanguage");
	if(lang)
		ZmGMapsZimlet.URLPARAMS["language"] = lang;		
	var addr = contentObj.replace("\n","+").replace("\r","+").replace(/ /g, "+");
	canvas = window.open("http://maps.google.com/maps?q="+AjxStringUtil.urlComponentEncode(addr));
};

/**
 * Handles tooltip popped-up event.
 *
 */
ZmGMapsZimlet.prototype.toolTipPoppedUp =
function(spanElement, addrs, context, canvas) {
	var url = this._getMapUrl(addrs);
	var id = Dwt.getNextId();
	canvas.innerHTML = [
		'<center><img width="345" height="245" id="',
		id,
		'" src="',
		this.getResource('blank_pixel.gif'),
		'"/></center>'
	].join("");
	var el = document.getElementById(id);
	el.style.backgroundImage = "url("+url+")";	
};

ZmGMapsZimlet.prototype._getMapUrl =
function(myaddrs) {
        var addrs = myaddrs;
        var lang = this.getMessage("mapLanguage");
        if(lang)
                ZmGMapsZimlet.URLPARAMS["language"] = lang;
        var clearStr =   this.getMessage("clearString");
        if(clearStr) {
            var strs = clearStr.split("|");
            if(!(strs instanceof Array)) strs = [strs];
            for(var i = 0; i < strs.length; i ++) {
                   if(myaddrs.indexOf(strs[i]) == 0) {
                       addrs = myaddrs.substring(strs[i].length);
                   }
            }
        }
	addrs = addrs.replace("\n","+").replace("\r","+").replace(/ /g, "+");
	var marker = ZmGMapsZimlet.URLPARAMS["markers"] + addrs;
    ZmGMapsZimlet.URLPARAMS["center"] = addrs;
	var params = [];
	for(var el in ZmGMapsZimlet.URLPARAMS) {		
		params.push(el + "=" + ZmGMapsZimlet.URLPARAMS[el]);//AjxStringUtil.urlComponentEncode(ZmGMapsZimlet.URLPARAMS[el]));
	}
    params.push("markers=" + marker);
	var url = ZmGMapsZimlet.URL + "?" + params.join("&");
	//url = ZmZimletBase.PROXY + AjxStringUtil.urlComponentEncode(url);
	//url = AjxStringUtil.urlComponentEncode(url);
	return url;
};
