/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2010, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2010, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Defines the Zimlet handler class.
 *   
 */
function com_zimbra_example_taboverview_HandlerObject() {
};

/**
 * Makes the Zimlet class a subclass of ZmZimletBase.
 *
 */
com_zimbra_example_taboverview_HandlerObject.prototype = new ZmZimletBase();
com_zimbra_example_taboverview_HandlerObject.prototype.constructor = com_zimbra_example_taboverview_HandlerObject;

/**
 * This method gets called by the Zimlet framework when the zimlet loads.
 *  
 */
com_zimbra_example_taboverview_HandlerObject.prototype.init =
function() {
	
	// create the tab application
	this._tabAppName = this.createApp("Tab Label", "zimbraIcon", "Tab Tool Tip");
	
};

/**
 * This method gets called by the Zimlet framework each time the application is opened or closed.
 *  
 * @param	{String}	appName		the application name
 * @param	{Boolean}	active		if <code>true</code>, the application status is open; otherwise, <code>false</code>
 */
com_zimbra_example_taboverview_HandlerObject.prototype.appActive =
function(appName, active) {
	switch(appName) {
		case this._tabAppName: {			
			if (active) {
			
				var app = appCtxt.getApp(this._tabAppName); // returns ZmZimletApp
				app.setContent("<b>THIS IS THE TAB APPLICATION CONTENT AREA</b>");

				var toolbar = app.getToolbar(); // returns ZmToolBar
				toolbar.setContent("<b>THIS IS THE TAB APPLICATION TOOLBAR AREA</b>");

				var overview = app.getOverview(); // returns ZmOverview
				overview.setContent("<b>THIS IS THE TAB APPLICATION OVERVIEW AREA</b>");

				var controller = appCtxt.getAppController();
				var appChooser = controller.getAppChooser();

				// change the tab label and tool tip
				var appButton = appChooser.getButton(this._tabAppName);
				appButton.setText("NEW TAB LABEL");
				appButton.setToolTipContent("NEW TAB TOOL TIP");

			}
			break;
		}
	}
};

/**
 * This method gets called by the Zimlet framework when the application is opened for the first time.
 *  
 * @param	{String}	appName		the application name		
 */
com_zimbra_example_taboverview_HandlerObject.prototype.appLaunch =
function(appName) {
	switch(appName) {
		case this._tabAppName: {
			// the app is launched, do something
			break;	
		}	
	}
};

