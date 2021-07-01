/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2010, 2011, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2010, 2011, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
function Com_Zimbra_SForceObject(zimlet) {
	this.zimlet = zimlet;
	this.props = {};
	this.objName_intNameExtNameMap = [];	
	this.sForceObjectDescMap = [];
	this.sForceObjectLayoutMap = [];
	this.loaded =  false;
}

Com_Zimbra_SForceObject.prototype.getFieldMap =
function(queryName, objName) {
	if(this.objName_intNameExtNameMap[objName]) {
		return this.objName_intNameExtNameMap[objName];
	}
	this.load(queryName, objName);
	return this.objName_intNameExtNameMap[objName];
};

Com_Zimbra_SForceObject.prototype.getObjDesc =
function(queryName, objName) {
	if(this.sForceObjectDescMap[objName]) {
		return this.sForceObjectDescMap[objName];
	}

	this.load(queryName, objName);
	return this.sForceObjectDescMap[objName];
};



Com_Zimbra_SForceObject.prototype.load =
function(queryName, objName, callback) {
	this.loaded = false;
	var soap = this.zimlet._makeEnvelope(queryName);
	soap.set("sObject", objName);

	var	requestStr = [ '<?xml version="1.0" encoding="utf-8" ?>', soap.getXml() ].join("");
	var serverURL = ZmZimletBase.PROXY + AjxStringUtil.urlComponentEncode(this.zimlet.SERVER);
	var response =	AjxRpc.invoke(requestStr, serverURL, {SOAPAction: "m", "Content-Type": "text/xml"}, null, false);

	try {
		var objDesc = this.zimlet.xmlToObject(response).Body.describeSObjectResponse.result;
		this.sForceObjectDescMap[objName] = objDesc;
		this._createNamesHash(objName, objDesc);
		/*
		if(objName != "ActivityHistory"&& objName != "OpenActivity" && objName != "NoteAndAttachment" && objName != "AccountPartner"){//there is no layout for AH/OA
			
			//var infos = objDesc.recordTypeInfos;
			//if(infos instanceof Array) {
			//	infos = infos[0];
			//}
			this._loadLayout(objName, "012000000000000AAA");
		}
		*/
		this.loaded = true;
	}catch(e) {
		appCtxt.setStatusMsg("Could not get SalesForce DescribeObject for object: "+ objName + "<br/>"+ e, ZmStatusView.LEVEL_WARNING);
	}
	if(callback) {
		callback.run(this);
	}
};


Com_Zimbra_SForceObject.prototype.getLayoutMap =
function(objName, recordTypeId) {
	this.loaded = false;
	var soap = this.zimlet._makeEnvelope("describeLayout");
	soap.set("sObjectType", objName);
	soap.set("recordTypeId", recordTypeId);

	var	requestStr = [ '<?xml version="1.0" encoding="utf-8" ?>', soap.getXml() ].join("");
	var serverURL = ZmZimletBase.PROXY + AjxStringUtil.urlComponentEncode(this.zimlet.SERVER);
	var response =	AjxRpc.invoke(requestStr, serverURL, {SOAPAction: "m", "Content-Type": "text/xml"}, null, false);

	try {
		return this.zimlet.xmlToObject(response).Body.describeLayoutResponse.result;
	}catch(e) {
		appCtxt.setStatusMsg("Could not get SalesForce describeLayout for object: "+ objName, ZmStatusView.LEVEL_WARNING);
	}
};

Com_Zimbra_SForceObject.prototype._createNamesHash =
function(objName, objDesc) {
	var fields = objDesc.fields;
	var map = [];
	for(var i =0; i < fields.length; i++) {
		var field = fields[i];
		try{
			var name = field.name.__msh_content;
			map[name] = {};
			map[name].label= field.label.__msh_content;
			map[name].type= field.type.__msh_content;
			map[name].updateable = field.updateable.__msh_content;
			map[name].deprecatedAndHidden = field.deprecatedAndHidden.__msh_content;
			map[name].length = field.length.__msh_content;
			map[name].nillable = field.nillable.__msh_content;

			if(field.picklistValues != undefined) {
				var items = [];
				items = field.picklistValues;
				var parry = [];
				for(var j=0; j< items.length; j++) {
					parry.push(this._constructListItemAsJSON(items[j]));
				}
				map[name].picklistValues = parry.join("=::=");
			}


		}catch(e) {
		}
	}
	this.objName_intNameExtNameMap[objName] = map;
};


Com_Zimbra_SForceObject.prototype._constructListItemAsJSON =
function(item) {
	var html = new Array();
	var i = 0;
	html[i++] = "{";
	html[i++] = "active:";
	html[i++] = "\"" + item["active"].__msh_content + "\"";
	html[i++] = ",value:";
	html[i++] = "\"" + item["value"].__msh_content + "\"";
	html[i++] = ",defaultValue:";
	html[i++] = "\"" + item["defaultValue"].__msh_content + "\"";
	html[i++] = ",label:";
	html[i++] = "\"" + item["label"].__msh_content + "\"";
	html[i++] = "}";

	return html.join("");	
};