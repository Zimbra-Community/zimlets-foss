/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

//Author: Raja Rao DV (rrao@zimbra.com)

function com_zimbra_socialTweetMeme(zimlet) {
	this.zimlet = zimlet;
}

com_zimbra_socialTweetMeme.prototype.loadTweetMemeCategories =
function() {
	this.allTweetMemeCats = new Array();
	this.allTweetMemeCats.push({query:"__MOST_POPULAR__", name:this.zimlet.getMessage("mostPopular")});
	this.allTweetMemeCats.push({query:"__MOST_RECENT__", name:this.zimlet.getMessage("mostRecent")});
	this.allTweetMemeCats.push({query:"Technology", name:this.zimlet.getMessage("technology")});
	this.allTweetMemeCats.push({query:"Entertainment", name:this.zimlet.getMessage("entertainment")});
	this.allTweetMemeCats.push({query:"Science", name:this.zimlet.getMessage("science")});
	this.allTweetMemeCats.push({query:"Sports", name:this.zimlet.getMessage("sports")});

	if (this.zimlet.preferences.social_pref_tweetmemePopularIsOn) {
		for (var i = 0; i < 1; i++) {
			var folder = this.allTweetMemeCats[i];
			var tableId = this.zimlet._showCard({headerName:folder.name, type:"TWEETMEME", autoScroll:false});
			this.tweetMemeSearch({query:folder.query, tableId:tableId});
		}
	}
	this.zimlet._updateAllWidgetItems({updateTweetMemeTree:true});
};

com_zimbra_socialTweetMeme.prototype._getQueryFromHeaderName =
function(headerName) {
	for(var i =0; i < this.allTweetMemeCats.length; i++) {
		var cat = this.allTweetMemeCats[i];
		if(cat.name == headerName) {
			return cat.query;
		}
	}
	return "__MOST_POPULAR__";
};

com_zimbra_socialTweetMeme.prototype.tweetMemeSearch =
function(params) {
	var headerName = params.headerName;
	var query = this._getQueryFromHeaderName(headerName);
	var url = "";
	if (query == "__MOST_POPULAR__")
		url = "http://api.tweetmeme.com/stories/popular.json?";
	else if (query == "__MOST_RECENT__")
		url = "http://api.tweetmeme.com/stories/recent.json";
	else
		url = "http://api.tweetmeme.com/stories/popular.json?category=" + AjxStringUtil.urlComponentEncode(query);

	var entireurl = ZmZimletBase.PROXY + AjxStringUtil.urlComponentEncode(url);
	AjxRpc.invoke(null, entireurl, null, new AjxCallback(this, this._tweetMemeSearchCallback, params), true);
};
com_zimbra_socialTweetMeme.prototype._tweetMemeSearchCallback =
function(params, response) {
	var jsonObj = this.zimlet._extractJSONResponse(params.tableId, this.zimlet.getMessage("tweetMemeError"), response);
	if(jsonObj.stories) {
		jsonObj = jsonObj.stories;
	}
	this.zimlet.createCardView({tableId:params.tableId, items:jsonObj, type:"TWEETMEME"});
};