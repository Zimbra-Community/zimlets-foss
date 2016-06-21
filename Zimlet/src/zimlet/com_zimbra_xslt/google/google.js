/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2006, 2007, 2009, 2010, 2013, 2014 Zimbra, Inc.
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
 * All portions of the code are Copyright (C) 2006, 2007, 2009, 2010, 2013, 2014 Zimbra, Inc. All Rights Reserved. 
 * ***** END LICENSE BLOCK *****
 */


function _initGoogle() {
	var goog = new Object();
	goog.label = "Google";
	goog.id = "googlewebservice";
	goog.icon = "Google-panelIcon";
	goog.xsl = "google/google.xsl";
	goog.getRequest = 
		function (ctxt, q) {
			var i = 0,reqmsg = [];
			reqmsg[i++] = '<?xml version="1.0" encoding="UTF-8"?>';
			reqmsg[i++] = '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/1999/XMLSchema-instance" xmlns:xsd="http://www.w3.org/1999/XMLSchema">';
			reqmsg[i++] = '<SOAP-ENV:Body>';
			reqmsg[i++] = '<ns1:doGoogleSearch xmlns:ns1="urn:GoogleSearch" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">';
			reqmsg[i++] = '<key xsi:type="xsd:string">';
			reqmsg[i++] = ctxt.getConfig("googleKey");
			reqmsg[i++] = '</key><q xsi:type="xsd:string">';
			reqmsg[i++] = q;
			reqmsg[i++] = '</q>';
			reqmsg[i++] = '<start xsi:type="xsd:int">0</start>';
			reqmsg[i++] = '<maxResults xsi:type="xsd:int">';
			reqmsg[i++] = 10; // ctxt.getConfig("numResults");  // 10 is the limit for google beta api.
			reqmsg[i++] = '</maxResults>';
			reqmsg[i++] = '<filter xsi:type="xsd:boolean">true</filter>';
			reqmsg[i++] = '<restrict xsi:type="xsd:string"/>';
			reqmsg[i++] = '<safeSearch xsi:type="xsd:boolean">false</safeSearch>';
			reqmsg[i++] = '<lr xsi:type="xsd:string"/>';
			reqmsg[i++] = '<ie xsi:type="xsd:string">UTF-8</ie>';
			reqmsg[i++] = '<oe xsi:type="xsd:string">UTF-8</oe>';
			reqmsg[i++] = '</ns1:doGoogleSearch></SOAP-ENV:Body></SOAP-ENV:Envelope>';

			return {"url":ctxt.getConfig("googUrl"), "req":reqmsg.join("")}
		};
		
	Com_Zimbra_Xslt.registerService(goog);
};

_initGoogle();
