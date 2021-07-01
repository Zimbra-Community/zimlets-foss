/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/*
* @Author Raja Rao DV (rrao@zimbra.com)
* Highlights search texts within an email
*/

function com_zimbra_srchhltr_HandlerObject() {
}

com_zimbra_srchhltr_HandlerObject.prototype = new ZmZimletBase();
com_zimbra_srchhltr_HandlerObject.prototype.constructor = com_zimbra_srchhltr_HandlerObject;

/**
 * Simplify Handler object's name
 *
 */
 var SearchHighlighterZimlet = com_zimbra_srchhltr_HandlerObject;

/**
 * Called by the framework when Zimbra loads
 *
 */
SearchHighlighterZimlet.prototype.init =
function() {
	this._searchController = appCtxt.getSearchController();
	this._spanIds = [];
};

/**
 * Called by the framework when generating the span for in-context link.
 *
 */
SearchHighlighterZimlet.prototype.match =
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
			if (!ret || m.index < ret.index) {
				ret = m;
				ret.matchLength = m[0].length;
				return ret;
			}
		}
	}
	return ret;
};

/**
 * Called by the framework when generating the span for in-context link.
 *
 */
SearchHighlighterZimlet.prototype.generateSpan =
function(html, idx, obj, spanId, context) {
    var currentApp  = appCtxt.getCurrentApp();
    if (currentApp && currentApp.isZmSearchApp){
        var id = Dwt.getNextId();
        this._spanIds.push(id);
        html[idx++] = ["<span id= '",id,"'class='ZmSearchResult'>",AjxStringUtil.htmlEncode(obj),"</span>"].join("");
    } else {
        html[idx++] = AjxStringUtil.htmlEncode(obj);
    }
    return idx;
};


/**
 * Gets list of search words to highlight using ZmParsedQuery Utility
 * @return {array} An array of search words
 */
SearchHighlighterZimlet.prototype._getSearchWords =
function(searchStr) {
	if (!searchStr) {
		return [];
	}
	var result = [];
	
	var searchTokens = (new ZmParsedQuery(searchStr)).getTokens();
	
	for (var i = 0; i < searchTokens.length; i++) {	
		if (searchTokens[i].op === ZmParsedQuery.OP_CONTENT && 
				(i == 0 || (searchTokens[i - 1].op !== ZmParsedQuery.COND_NOT))) {
			/* If the ZmSearchToken has "op" as "content" and is not coming immediately after
			 * the conditional "not" operator then include it in the result array.
			 */
			result.push(searchTokens[i].arg);
		}
	}
	
	return AjxUtil.uniq(result);
};


 /**
 *  Creates list of regular expressions to match
 */
SearchHighlighterZimlet.prototype._setRegExps =
function() {
	this._currentSearchQuery = (this._searchController.currentSearch) ? this._searchController.currentSearch.query : null;
	if (!this._oldSearchQuery || this._currentSearchQuery != this._oldSearchQuery) {
		var words = this._getSearchWords(this._currentSearchQuery);
		this._regexps = [];
		try {
			var expression, token, lastCharIsStar;
			for (var i = 0; i < words.length; i++) {
				token = words[i];
				
				lastCharIsStar = token[token.length - 1] == '*'? true : false;
		
				//Remove all punctuations in the beginning and at the end.
				token = token.replace(/^\W*/, '').replace(/\W*$/, '');
				 		
				/* For the middle characters (*,?,+), all of them are searched for as a content.
				 * e.g While searching for "20?15",   '?' treated as part of the content
				 * and not as quantifier. 
				 */
				token = AjxStringUtil.regExEscape(token);
				
				//Handle the case where "*" is at the end.
				if (lastCharIsStar) {
					token = token.concat("\\S*");
				}
				
				if (expression) {
					expression = expression + "|" + token;
				}
				else {
					expression = token;
				}
				
			}
			if (expression) {
				/* We want to match the exact word.
				 * e.g When the user searches for "hi" do not highlight "this" or "his".
				 */
				expression = "\\b(" + expression + ")\\b";
				this._regexps.push(new RegExp(expression, "ig"));
			}
			
		} catch(e) {
			this._regexps = [];
		}
		this._oldSearchQuery = this._currentSearchQuery;
	}
};


//------------------------------------------------
// Context menu / clear highlight related
//------------------------------------------------
/**
 *  Called by Framework to add a context-menu item for emails
 */
SearchHighlighterZimlet.prototype.onParticipantActionMenuInitialized =
function(controller, menu) {
	this.onActionMenuInitialized(controller, menu);
};

/**
 *  Called by Framework to add a context-menu item for emails
 */
SearchHighlighterZimlet.prototype.onActionMenuInitialized =
function(controller, menu) {
	this.addMenuButton(controller, menu);
};

/**
 * Adds a menu item for emails
 * @param {ZmMsgController} controller
 * @param {object} menu  Menu object
 */
SearchHighlighterZimlet.prototype.addMenuButton = function(controller, menu) {
	var ID = "COM_ZIMBRA_SEARCH_WORD_HIGHLIGHTER_ZIMLET";
	var text = this.getMessage("SearchHighlighterZimlet_MenuLabel"); //TODO - not working
	//var text = "Clear Search Highlights";
	if (!menu.getMenuItem(ID)) {
		var op = {
			id:			 ID,
			text:		  text,
			image:		  "Search"
		};
		var opDesc = ZmOperation.defineOperation(null, op);
		menu.addOp(ID, 1000);//add the button at the bottom
		menu.addSelectionListener(ID, new AjxListener(this,
				this._clearSearchWordHighlights, controller));
	}
};

/**
 * Helps clearing highlighted texts
 * @param {ZmMsgController} controller  A controller
 */
SearchHighlighterZimlet.prototype._clearSearchWordHighlights = function(controller) {
	var currentView = appCtxt.getAppViewMgr().getCurrentView();
	var view;
	if(currentView.getItemView) {
		view = currentView.getItemView();
	} else if(currentView.getMsgView) {
		view = currentView.getMsgView();
	}
	if(!view) {
		return;
	}
	var msgBody = view.getDocument();
	if (!msgBody) {
		var elId = view.getHTMLElId();
		if (elId) {
			var doc = document.getElementById(elId + "_body__iframe");
			if (!AjxEnv.isIE) {
				if (doc) {
					msgBody = doc.contentDocument;
				}
			} else {
				if (doc) {
					msgBody = doc.contentWindow.document;
				}
			}
		}
	}
	for (var i = 0; i < this._spanIds.length; i++) {
		var obj = document.getElementById(this._spanIds[i]);
		var bodyObj;
		if (msgBody != undefined || msgBody != null) {
			bodyObj = msgBody.getElementById(this._spanIds[i]);
		}
		if ((obj != undefined) && (obj.className != undefined)) {
			obj.className = "";
		}
		if ((bodyObj != undefined) && (bodyObj.className != undefined)) {
			bodyObj.className = "";
		}
	}
	this._spanIds = [];//reset
};
