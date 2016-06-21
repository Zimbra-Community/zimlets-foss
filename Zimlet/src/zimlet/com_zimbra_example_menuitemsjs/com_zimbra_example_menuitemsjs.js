/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2010, 2013, 2014 Zimbra, Inc.
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
 * All portions of the code are Copyright (C) 2010, 2013, 2014 Zimbra, Inc. All Rights Reserved. 
 * ***** END LICENSE BLOCK *****
 */

/**
 * Defines the Zimlet handler class.
 *   
 */
function com_zimbra_example_menuitemsjs_HandlerObject() {
}

/**
 * Makes the Zimlet class a subclass of ZmZimletBase.
 *
 */
com_zimbra_example_menuitemsjs_HandlerObject.prototype = new ZmZimletBase();
com_zimbra_example_menuitemsjs_HandlerObject.prototype.constructor = com_zimbra_example_menuitemsjs_HandlerObject;

/**
 * This method gets called by the Zimlet framework when the zimlet loads.
 *  
 */
com_zimbra_example_menuitemsjs_HandlerObject.prototype.init =
function() {
	// do something
};

/**
 * This method gets called by the Zimlet framework when a context menu item is selected.
 * 
 * @param	itemId		the Id of selected menu item
 */
com_zimbra_example_menuitemsjs_HandlerObject.prototype.menuItemSelected =
function(itemId) {
	switch (itemId) {
		case "SOME_MENU_ITEM_ID1":
			window.open ("http://www.yahoo.com",
					"mywindow","menubar=1,resizable=1,width=800,height=600"); 
			break;
		case "SOME_MENU_ITEM_ID2":
			window.open ("http://sports.yahoo.com",
					"mywindow","menubar=1,resizable=1,width=800,height=600"); 
			break;
		default:
			// do nothing
			break;
	}

};
