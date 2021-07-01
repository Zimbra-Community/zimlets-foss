/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2010, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2010, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
AjxTemplate.register("com_zimbra_phonelookup.templates.PhoneLookup#Frame", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div align=center  style='display:block;overflow:auto;'  id='phoneLookupZimlet_MainDiv'><div class='overviewHeader LinkedInHeader' id='phoneLookupZimlet_searchBarDiv'><table cellspacing=0 cellpadding=0 align=\"center\"><tr><td><input id='phoneLookupZimlet_seachField' type='text' style='width:110px'></input></td><td id='phoneLookupZimlet_seachBtnCell'></td></tr></table></div><div id='phoneLookupZimlet_searchResultsDiv'></div></div>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "Frame"
}, true);
AjxPackage.define("com_zimbra_phonelookup.templates.PhoneLookup");
AjxTemplate.register("com_zimbra_phonelookup.templates.PhoneLookup", AjxTemplate.getTemplate("com_zimbra_phonelookup.templates.PhoneLookup#Frame"), AjxTemplate.getParams("com_zimbra_phonelookup.templates.PhoneLookup#Frame"));

AjxTemplate.register("com_zimbra_phonelookup.templates.PhoneLookup#RowItem", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div style='border-bottom:1px solid gray;background:white;'><table width=100%><tr><td style='font-weight:bold;font-size:12px'>Owner: </td><td>";
	buffer[_i++] = data["displayName"];
	buffer[_i++] = "</td></tr><tr><td style='font-weight:bold;font-size:12px'>Street: </td><td>";
	buffer[_i++] = data["fullStreet"];
	buffer[_i++] = "</td></tr><tr><td style='font-weight:bold;font-size:12px'>City: </td><td>";
	buffer[_i++] = data["city"];
	buffer[_i++] = "</td></tr><tr><td style='font-weight:bold;font-size:12px'>State: </td><td>";
	buffer[_i++] = data["state"];
	buffer[_i++] = "</td></tr><tr><td style='font-weight:bold;font-size:12px'>zip: </td><td>";
	buffer[_i++] = data["zip"];
	buffer[_i++] = "</td></tr><tr><td style='font-weight:bold;font-size:12px'>Country: </td><td>";
	buffer[_i++] = data["country"];
	buffer[_i++] = "</td></tr></table></div>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "RowItem"
}, true);

