/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2009, 2010, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2009, 2010, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

//Author: Raja Rao DV (rrao@zimbra.com)

function com_zimbra_socialDigg(zimlet) {
	this.zimlet = zimlet;
}

com_zimbra_socialDigg.prototype.getDiggCategories =
function() {
	this.allDiggCats = new Array();
	this.allDiggCats.push({query:"Popular in 24hours", name:this.zimlet.getMessage("popularIn24Hours")});
	this.allDiggCats.push({query:"technology", name:this.zimlet.getMessage("technology")});
	this.allDiggCats.push({query:"science", name:this.zimlet.getMessage("science")});
	this.allDiggCats.push({query:"sports", name:this.zimlet.getMessage("sports")});
	this.allDiggCats.push({query:"entertainment", name:this.zimlet.getMessage("entertainment")});

	if (this.zimlet.preferences.social_pref_diggPopularIsOn) {
		for (var i = 0; i < 1; i++) {
			var folder = this.allDiggCats[i];
			var tableId = this.zimlet._showCard({headerName:folder.name, type:"DIGG", autoScroll:false});
			this.diggSearch({query:folder.query, tableId:tableId});
		}
	}
	this.zimlet._updateAllWidgetItems({updateDiggTree:true});
};

com_zimbra_socialDigg.prototype._getQueryFromHeaderName =
function(headerName) {
	for(var i =0; i < this.allDiggCats.length; i++) {
		var cat = this.allDiggCats[i];
		if(cat.name == headerName) {
			return cat.query;
		}
	}
	return "Popular in 24hours";
};

com_zimbra_socialDigg.prototype.diggSearch =
function(params) {
	var headerName = params.headerName;
	var query = this._getQueryFromHeaderName(headerName);
	var url = "";
	var tmp = new Date();
	var time = ((new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate())).getTime() - 3600 * 24 * 1000) / 1000;
	var args = "min_promote_date=" + time + "&sort=digg_count-desc&appkey=http%3A%2F%2Fwww.zimbra.com&count=20&type=json";
	if (query == "Popular in 24hours")
		url = "http://services.digg.com/stories/popular?" + args;
	else
		url = "http://services.digg.com/stories/container/" + query + "/popular?" + args;

	var entireurl = ZmZimletBase.PROXY + AjxStringUtil.urlComponentEncode(url);
	AjxRpc.invoke(null, entireurl, null, new AjxCallback(this, this._DiggSearchCallback, params), true);
};

com_zimbra_socialDigg.prototype._DiggSearchCallback =
function(params, response) {
	var jsonObj = this.zimlet._extractJSONResponse(params.tableId, this.zimlet.getMessage("diggError"), response);
	if(jsonObj.stories) {
		jsonObj = jsonObj.stories;
	}
	this.zimlet.createCardView({tableId:params.tableId, items:jsonObj, type:"DIGG"});
};