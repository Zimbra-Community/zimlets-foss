/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2006, 2007, 2008, 2009, 2010, 2011, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2006, 2007, 2008, 2009, 2010, 2011, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

Com_Zimbra_Date = function(pattern) {
    // TODO: What is this here for? There is no _generateRegex method anywhere.
	if (arguments.length == 1) {
		this._generateRegex(pattern);
	}
};

Com_Zimbra_Date.prototype = new ZmZimletBase();
Com_Zimbra_Date.prototype.constructor = Com_Zimbra_Date;

//
// Data
//

Com_Zimbra_Date.prototype.TYPE = ZmObjectManager.DATE;

//
// Public methods
//

Com_Zimbra_Date.validate =
function(day, month, year){
	//"Day must be between 1 and 31.";
	if (day < 1 || day > 31) {
		return false;
	}

	//"Month must be between 0 and 11."
	if (month < 0 || month > 11) {
		return false;
	}

	// Make sure month and day of month is valid
	if ((month == 3 || month == 5 || month == 8 || month == 10) && day == 31) {
		return  false;
	}

	// Check for February date validity (including leap years)
	if (year && month == 1) {
		// figure out if "year" is a leap year;
		var isleap = (year%4 == 0 && (year%100 != 0 || year%400 == 0));
		if (day > 29 || (day == 29 && !isleap)) {
			return false;
		}
	}

	return true;
};

Com_Zimbra_Date.prototype.getCurrentDate =
function(date) {
	var d = this[ZmObjectManager.ATTR_CURRENT_DATE];
	return d ? d : new Date();
};

//
// ZmZimletBase methods
//

Com_Zimbra_Date.prototype.init =
function() {
	Com_Zimbra_Date.prototype._zimletContext = this._zimletContext;
	Com_Zimbra_Date.prototype._className = "Object";
	this._initDateObjectHandlers();
};

Com_Zimbra_Date.prototype.getActionMenu =
function(obj, span, context) {
	if (this._zimletContext._contentActionMenu instanceof AjxCallback) {
		this._zimletContext._contentActionMenu = this._zimletContext._contentActionMenu.run();
	}
	// Set some global context since the parent Zimlet (Com_Zimbra_Date) will be called for
	// right click menu options, even though the getActionMenu will get called on the sub-classes.
	Com_Zimbra_Date._actionObject = obj;
	Com_Zimbra_Date._actionSpan = span;
	Com_Zimbra_Date._actionContext = context;
	return this._zimletContext._contentActionMenu;
};

Com_Zimbra_Date.prototype.menuItemSelected =
function(itemId) {
	switch (itemId) {
		case "DAYVIEW":		this.showDayView(Com_Zimbra_Date._actionContext.date); break;
		case "NEWAPPT":		this._newApptListener(); break;
		case "SEARCHMAIL":	this._searchMailListener(); break;
	}
};

Com_Zimbra_Date.prototype.toolTipPoppedUp = function(spanElement, contentObjText, matchContext, canvas) {

	var app = this.getAppInMainWindow(ZmApp.CALENDAR);
	if (!app) {
		return;
	}

    var date = matchContext ? matchContext.date : new Date();
    if (!isNaN(date)) {
	    canvas.innerHTML = app.getDateToolTip(date, true);
    }
};

/**
 * returns the opener window if this is a child window, or this window otherwise
 * @param appId
 */
Com_Zimbra_Date.prototype.getMainWindow =
function(appId) {
	return appCtxt.isChildWindow ? window.opener : window;
};


/**
 * returns the opener app if this is a child window, or this window's app if it's not a child window
 * @param appId
 */
Com_Zimbra_Date.prototype.getAppInMainWindow =
function(appId) {
	var win = this.getMainWindow();
	if (!win) {
		return null;
	}
	var ctxt = win.appCtxt;
	if (!ctxt) {
		return null;
	}
	return ctxt.getApp(appId);
};


Com_Zimbra_Date.prototype.clicked =
function(spanElement, contentObjText, matchContext, canvas) {
	this.showDayView(matchContext.date);
};

Com_Zimbra_Date.prototype.showDayView =
function(date) {
	var app = this.getAppInMainWindow(ZmApp.CALENDAR);
	if (!app) {
		return;
	}
	app.showDayView(date);
	if (appCtxt.isChildWindow) {
		window.opener.focus();
	}
};


Com_Zimbra_Date.prototype.match =
function(line, startIndex) {
	// is there anything to do?
	if (!Com_Zimbra_Date.PATTERNS) { return null; }

	// find first match
	var match, mapping, rule, re, m, i;
	for (i = 0; i < Com_Zimbra_Date.REGEXES.length; i++) {
		re = Com_Zimbra_Date.REGEXES[i];
		re.lastIndex = startIndex;
		m = re.exec(line);
		if (m && m[0] && (!match || m[0].length > match[0].length )) { // Longest match wins
			match = m;
			rule = Com_Zimbra_Date.RULES[i];
			mapping = re.mapping;
			break;
		}
	}

	// did we find anything?
	if (!match) { return null; }

	// replace mapping and calculate date
	try {
		var keyword, value;
		for (i in mapping) {
			keyword = mapping[i];
			value = match[i];
			rule = rule.replace(new RegExp("\\{"+keyword+"\\}", "gi"), value);
		}
		var now = new Date(this.getCurrentDate().getTime());
		match.context = {
			rule: rule,
			date: AjxDateUtil.calculate(rule, now),
			monthOnly: 0, // TODO: What is this for? Noone seems to use it! 
			valid: true
		};
		return match;
	}
	catch (e) {
		/*** DEBUG ***/
		if (window.console && window.console.log) console.log(e);
		/***/
		return null;
	}
};

//
// Protected methods
//

Com_Zimbra_Date.prototype._initDateObjectHandlers =
function() {
	// ignore if calendar isn't enabled
	if (!appCtxt.get(ZmSetting.CALENDAR_ENABLED)) { return; }

	// initialize constants
	Com_Zimbra_Date.MAPPINGS = {
		datenum:	"(3[0-1]|0[1-9]|[1-2][0-9]|[1-9])",
		dayname:	"("+AjxDateUtil.S_DAYNAME+")",
		weekord:	"("+AjxDateUtil.S_WEEKORD+")",
		monthnum:	"(0[1-9]|[1-9]|1[0-2])",
		monthname:	"("+AjxDateUtil.S_MONTHNAME+")",
		yearnum:	"(\\d{2}|[1-9]\\d{2,3})",
        fullyearnum:"(\\d{4})",
		number:		"(\\d+)",
        timenum:    "(1[0-2]:?[0-5][0-9]|[1-9]:?[0-5][0-9]|1[0-2]|[1-9])",         //12hr
        militarytimenum:    "(2[0-3]:?[0-5][0-9]|[0-1][0-9]:?[0-5][0-9])"        //24hr

	};

	Com_Zimbra_Date.PATTERNS = [];
	Com_Zimbra_Date.RULES = [];
	Com_Zimbra_Date.REGEXES = [];

	// get all the defined patterns
	var i, pattern;
	for (i = 1; pattern = this.getMessage("format"+i+".pattern"); i++) {
		if (pattern.match(/^\?\?\?+/)) break;	// this means couldn't find the resources file!
		if (pattern.match(/^###+/)) break;		// Minimum three hashes to terminate
		if (pattern.match(/^#/)) continue;		// one hash to skip/disable the pattern
		Com_Zimbra_Date.PATTERNS.push(pattern);
		Com_Zimbra_Date.RULES.push(this.getMessage("format"+i+".rule"));
	}
	for (i = 0; i < Com_Zimbra_Date.DEFAULT_FORMATS.length; i++) {
		Com_Zimbra_Date.PATTERNS.push(Com_Zimbra_Date.DEFAULT_FORMATS[i]);
		Com_Zimbra_Date.RULES.push(Com_Zimbra_Date.DEFAULT_FORMATS[++i]);
	}

	// generate regular expressions for patterns
    var BOUNDARY_TRUE = this.getMessage("boundaryTrue");
	var boundary, regex;
    var boundary_all = this.getMessage("format.boundary") || BOUNDARY_TRUE;
	for (i = 0; i < Com_Zimbra_Date.PATTERNS.length; i++) {
		pattern = Com_Zimbra_Date.PATTERNS[i];

		// normalize regex
//        pattern = pattern.replace(/\s+/g, "\\b\\s*\\b");
        pattern = pattern.replace(/\s+/g, "\\s+");
		pattern = pattern.replace(/\(([^\)]+)\)/g, "(?:$1)");

		// replace keywords with regex fragment
		Com_Zimbra_Date.__replaceKeyword_group = 1;
		Com_Zimbra_Date.__replaceKeyword_mapping = {};
		pattern = pattern.replace(/\{([a-z]+)\}/g, Com_Zimbra_Date.__replaceKeyword);

		// NOTE: can't use \b with asian characters!
		boundary = this.getMessage("format"+(i+1)+".boundary");
		if ((boundary != "" && boundary == BOUNDARY_TRUE) || boundary_all == BOUNDARY_TRUE) {
			pattern = "\\b"+pattern+"\\b";
		}

		var caseSensitive = this.getMessage("format.caseSensitive") === BOUNDARY_TRUE;

		// save regex
		regex = new RegExp(pattern, "g" + (!caseSensitive ? "i" : ""));
		regex.mapping = Com_Zimbra_Date.__replaceKeyword_mapping;
		Com_Zimbra_Date.REGEXES.push(regex);

	}

	// register self as handler
	ZmObjectManager.registerHandler(this, ZmObjectManager.DATE, this._zimletContext.priority);
};


Com_Zimbra_Date.prototype._newApptListener =
function() {
	var win = this.getMainWindow();
	if (!win) {
		return;
	}

	var loadCallback = new win.AjxCallback(this, this._handleLoadNewAppt);
	win.AjxDispatcher.require(["CalendarCore", "Calendar", "CalendarAppt"], false, loadCallback, null, true);
};

Com_Zimbra_Date.prototype._handleLoadNewAppt =
function() {
	// TODO support ev.shiftKey
	var win = this.getMainWindow();
	if (!win) {
		return null;
	}

	win.appCtxt.getAppViewMgr().popView(true, ZmId.VIEW_LOADING);	// pop "Loading..." page
	win.AjxDispatcher.run("GetCalController").newAppointmentHelper(Com_Zimbra_Date._actionContext.date);
	if (appCtxt.isChildWindow) {
		window.opener.focus();
	}
};

Com_Zimbra_Date.prototype._searchMailListener =
function() {
	var win = this.getMainWindow(ZmApp.CALENDAR);
	if (!win) {
		return;
	}

	win.appCtxt.getSearchController().dateSearch(Com_Zimbra_Date._actionContext.date);
	if (appCtxt.isChildWindow) {
		window.opener.focus();
	}
};

//
// Private
//

Com_Zimbra_Date.__replaceKeyword_mapping = null;
Com_Zimbra_Date.__replaceKeyword_group = -1;

Com_Zimbra_Date.__replaceKeyword =
function($0, keyword) {
	var MAPPINGS = Com_Zimbra_Date.MAPPINGS;

	// is there anything to do?
	keyword = keyword.toLowerCase();
	if (!MAPPINGS[keyword]) { return $0; }

	// store keyword mapping
	var mapping = Com_Zimbra_Date.__replaceKeyword_mapping;
	var group = Com_Zimbra_Date.__replaceKeyword_group++;
	mapping[group++] = keyword;
	return MAPPINGS[keyword];
};
