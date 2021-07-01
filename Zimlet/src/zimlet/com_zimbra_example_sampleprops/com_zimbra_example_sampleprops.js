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

com_zimbra_example_sampleprops_HandlerObject = function() {
};
com_zimbra_example_sampleprops_HandlerObject.prototype = new ZmZimletBase;
com_zimbra_example_sampleprops_HandlerObject.prototype.constructor = com_zimbra_example_sampleprops_HandlerObject;


/**
 * This method is called by the Zimlet framework when a menu item is selected.
 * 
 */
com_zimbra_example_sampleprops_HandlerObject.prototype.menuItemSelected = 
function(itemId) {
	var str = this.getMessage("helloworld_status");
	switch (itemId) {
		case "sampleprops_menuItemId":
			appCtxt.getAppController().setStatusMsg(str);
			break;
	}
};