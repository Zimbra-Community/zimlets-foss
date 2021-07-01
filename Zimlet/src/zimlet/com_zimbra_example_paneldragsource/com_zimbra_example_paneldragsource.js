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
function com_zimbra_example_paneldragsource_HandlerObject() {
}

/**
 * Makes the Zimlet class a subclass of ZmZimletBase.
 *
 */
com_zimbra_example_paneldragsource_HandlerObject.prototype = new ZmZimletBase();
com_zimbra_example_paneldragsource_HandlerObject.prototype.constructor = com_zimbra_example_paneldragsource_HandlerObject;

/**
 * This method gets called by the Zimlet framework when the zimlet loads.
 *  
 */
com_zimbra_example_paneldragsource_HandlerObject.prototype.init =
function() {
	// do something
};


/**
 * This method gets called by the Zimlet framework when an item or items are dropped on the panel.
 * 
 * @param	obj		the dropped object
 */
com_zimbra_example_paneldragsource_HandlerObject.prototype.doDrop =
function(obj) {

	var type = obj.TYPE;
	switch(type) {
		case "ZmAppt": {
			// do something with ZmAppt
			break;
		}
		case "ZmContact": {
			// do something with ZmContact
			break;
		}
		case "ZmConv": {
			// do something with ZmConv
			break;
		}
		case "ZmMailMsg": {
			// do something with ZmMailMsg
			break;
		}
	}

};

