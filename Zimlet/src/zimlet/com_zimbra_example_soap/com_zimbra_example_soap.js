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

com_zimbra_example_soap_HandlerObject = function() {
};

com_zimbra_example_soap_HandlerObject.prototype = new ZmZimletBase;
com_zimbra_example_soap_HandlerObject.prototype.constructor = com_zimbra_example_soap_HandlerObject;

/**
 * This method is called by the Zimlet framework when a context menu item is selected.
 * 
 */
com_zimbra_example_soap_HandlerObject.prototype.menuItemSelected = 
function(itemId) {
	switch (itemId) {
		case "menuId_soap_request_xml":
			this._submitSOAPRequestXML();
			break;
		case "menuId_soap_request_json":
			this._submitSOAPRequestJSON();
			break;
	}
};

/**
 * Submits a SOAP request in XML format.
 * 
 * <GetAccountInfoRequest xmlns="urn:zimbraAccount">
 *     <account by="name">user1</account>
 * </GetAccountInfoRequest>
 *
 * @private
 */
com_zimbra_example_soap_HandlerObject.prototype._submitSOAPRequestXML =
function() {
		
	var soapDoc = AjxSoapDoc.create("GetAccountInfoRequest", "urn:zimbraAccount");

	var accountNode = soapDoc.set("account", appCtxt.getUsername());
	accountNode.setAttribute("by", "name");
	
	var params = {
			soapDoc: soapDoc,
			asyncMode: true,
			callback: (new AjxCallback(this, this._handleSOAPResponseXML)),
			errorCallback: (new AjxCallback(this, this._handleSOAPErrorResponseXML))
			};

	appCtxt.getAppController().sendRequest(params);
};

/**
 * Handles the SOAP response.
 * 
 * @param	{ZmCsfeResult}		result		the result
 * @private
 */
com_zimbra_example_soap_HandlerObject.prototype._handleSOAPResponseXML =
function(result) {

	if (result.isException()) {
		// do something with exception
		var exception = result.getException();		

		return;
	}
	
	// do something with response (in JSON format)
	var response = result.getResponse().GetAccountInfoResponse;

	var name = response.name;
	var soapURL = response.publicURL;
	var soapURL = response.soapURL;
	var zimbraId = result.getResponse().GetAccountInfoResponse._attrs.zimbraId;
	var zimbraMailHost = result.getResponse().GetAccountInfoResponse._attrs.zimbraMailHost;
	
	appCtxt.setStatusMsg("GetAccountInfoResponse (XML) success - "+name);	
};

/**
 * Handles the SOAP error response.
 * 
 * @param	{ZmCsfeException}		ex		the exception
 * @private
 */
com_zimbra_example_soap_HandlerObject.prototype._handleSOAPErrorResponseXML =
function(ex) {

	var errorMsg = ex.getErrorMsg(); // the error message
	var dump = ex.dump(); // the complete error dump

};

/**
 * Submits a SOAP request in JSON format.
 * 
 * 
 * GetAccountInfoRequest: {
 *   _jsns: "urn:zimbraAccount",
 *   account: {
 *     _content: "user1",
 *     by: "name"
 *    }
 * }
 *
 * @private
 */
com_zimbra_example_soap_HandlerObject.prototype._submitSOAPRequestJSON =
function() {

	var jsonObj = {GetAccountInfoRequest:{_jsns:"urn:zimbraAccount"}};
	var	request = jsonObj.GetAccountInfoRequest;
	request.account = {_content: appCtxt.getUsername(), by: "name"};
	
	var params = {
			jsonObj:jsonObj,
			asyncMode:true,
			callback: (new AjxCallback(this, this._handleSOAPResponseJSON)),
			errorCallback: (new AjxCallback(this, this._handleSOAPErrorResponseJSON))
		};
	
	return appCtxt.getAppController().sendRequest(params);

};

/**
 * Handles the SOAP response.
 * 
 * @param	{ZmCsfeResult}		result		the result
 * @private
 */
com_zimbra_example_soap_HandlerObject.prototype._handleSOAPResponseJSON =
function(result) {

	if (result.isException()) {
		// do something with exception
		var exception = result.getException();		

		return;
	}
	
	// do something with response (in JSON format)
	var response = result.getResponse().GetAccountInfoResponse;

	var name = response.name;
	var soapURL = response.publicURL;
	var soapURL = response.soapURL;
	var zimbraId = result.getResponse().GetAccountInfoResponse._attrs.zimbraId;
	var zimbraMailHost = result.getResponse().GetAccountInfoResponse._attrs.zimbraMailHost;
	
	appCtxt.setStatusMsg("GetAccountInfoResponse (JSON) success - "+name);	
};

/**
 * Handles the SOAP error response.
 * 
 * @param	{ZmCsfeException}		ex		the exception
 * @private
 */
com_zimbra_example_soap_HandlerObject.prototype._handleSOAPErrorResponseJSON =
function(ex) {

	var errorMsg = ex.getErrorMsg(); // the error message
	var dump = ex.dump(); // the complete error dump

};
