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

com_zimbra_example_simplejspasync_HandlerObject = function() {
};
com_zimbra_example_simplejspasync_HandlerObject.prototype = new ZmZimletBase;
com_zimbra_example_simplejspasync_HandlerObject.prototype.constructor = com_zimbra_example_simplejspasync_HandlerObject;

/**
 * Double clicked.
 */
com_zimbra_example_simplejspasync_HandlerObject.prototype.doubleClicked =
function() {
	this.singleClicked();
};

/**
 * Single clicked.
 */
com_zimbra_example_simplejspasync_HandlerObject.prototype.singleClicked =
function() {
	this._displayDialog();
};

/**
 * Displays the zimlet jsp page.
 * 
 */
com_zimbra_example_simplejspasync_HandlerObject.prototype._displayDialog = 
function() {
	
	var jspUrl = this.getResource("jspfile.jsp");

	var callback = new AjxCallback(this, this._rpcCallback, ["param1", "param2"])

	AjxRpc.invoke(null, jspUrl, null, callback, true);
	
};

/**
 * Called from the ajax callback.
 * 
 */
com_zimbra_example_simplejspasync_HandlerObject.prototype._rpcCallback =
function(p1, p2, response) {

	if (response.success == true) {
		appCtxt.getAppController().setStatusMsg(response.text);		
	}

};
