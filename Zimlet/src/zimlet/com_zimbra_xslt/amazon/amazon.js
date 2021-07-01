/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2006, 2007, 2009, 2010, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2006, 2007, 2009, 2010, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

function _initAmazon() {
	function _queryAmazon(ctxt, q, domain) {
		var searchIndex;

		if (domain == "awsmusic") {
			searchIndex = "Music";
		} else if (domain == "awsbooks") {
			searchIndex = "Books";
		}

		var q_url = ctxt.getConfig("amznUrl");
		var args = { Service: "AWSECommerceService", 
					 Operation: "ItemSearch", 
					 SearchIndex: searchIndex, 
					 ResponseGroup: "Request,Small", 
					 Version: "2004-11-10" };
		args.SubscriptionId = ctxt.getConfig("amazonKey");
		args.Keywords = AjxStringUtil.urlEncode(q);
		var sep = "?";
		for (var arg in args) {
			q_url = q_url + sep + arg + "=" + args[arg];
			sep = "&";
		}
		return {"url":q_url, "req":null}
	};

	var amzn = new Object();
	amzn.label = "Amazon Music";
	amzn.id = "awsmusic";
	amzn.icon = "Amazon-panelIcon";
	amzn.xsl = "amazon/amazon.xsl";
	amzn.queryAmazon = _queryAmazon;
	amzn.getRequest = 
		function (ctxt, q) { return this.queryAmazon(ctxt, q, this.id) };
		
	Com_Zimbra_Xslt.registerService(amzn);

	amzn = new Object();
	amzn.label = "Amazon Books";
	amzn.id = "awsbooks";
	amzn.icon = "Amazon-panelIcon";
	amzn.xsl = "amazon/amazon.xsl";
	amzn.queryAmazon = _queryAmazon;
	amzn.getRequest = 
		function (ctxt, q) { return this.queryAmazon(ctxt, q, this.id) };
		
	Com_Zimbra_Xslt.registerService(amzn);
};

_initAmazon();
