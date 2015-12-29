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

//////////////////////////////////////////////////////////////////////////////
// Collects usage data about the user and sends it to the Google gods.
// @author Zimlet author: Parag Shah.
//////////////////////////////////////////////////////////////////////////////

function Com_Zimbra_Usagetracker() {
};

Com_Zimbra_Usagetracker.prototype = new ZmZimletBase();
Com_Zimbra_Usagetracker.prototype.constructor = Com_Zimbra_Usagetracker;


// Public methods

Com_Zimbra_Usagetracker.prototype.toString =
function() {
	return "Com_Zimbra_Usagetracker";
};

Com_Zimbra_Usagetracker.prototype.init =
function() {
	this._ganalytics = new GoogleAnalytics();
};

Com_Zimbra_Usagetracker.prototype.doubleClicked =
function(canvas) {
	// do nothing
};

Com_Zimbra_Usagetracker.prototype.onShowView =
function(viewId, isNewView) {
	this._ganalytics.handleShow(viewId, isNewView);
};

/**
 * Report an action triggered by the user (i.e. button click or menu item selection)
 *
 * @param type				[Integer]	Describes what kind of action happened (i.e. button, menuitem, treeitem)
 * @param action			[String]	The name of the action
 * @param currentViewId		[Integer]	The current view user is on when the action happened
 * @param lastViewId		[Integer]	The last view the user was on when the action happened
 */
Com_Zimbra_Usagetracker.prototype.onAction =
function(type, action, currentViewId, lastViewId) {
	this._ganalytics.handleAction(type, action, currentViewId, lastViewId);
};


/**
 * Google analytics specific code goes here
 */
function GoogleAnalytics() {
	try {
		this._pageTracker = _gat._getTracker("UA-xxxxxxx-1");					// replace with your own tracker key. Issued by Google.
//		this._pageTracker._setDomainName("none");								// for localhost test only. Leave commented out for production deployment.
		this._pageTracker._trackPageview();										// this call is required.
	} catch(err) {
		alert("Google Analytics error.");										// probably want to silently fail here.
	}
};

GoogleAnalytics.prototype.handleShow =
function(viewId, isNewView) {
	this._pageTracker._trackPageview("onShow_"+viewId);
};

GoogleAnalytics.prototype.handleAction =
function(type, action, currentViewId, lastViewId) {
	var text = [("type="+type), ("action="+action), ("currentView="+currentViewId), ("lastView="+lastViewId)].join("::");
	this._pageTracker._trackPageview("onAction_"+text);
};
