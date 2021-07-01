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
AjxTemplate.register("com_zimbra_example_simpledialogtemplate.templates.Simple#Main", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table cellpadding=\"2\" cellspacing=\"0\" border=\"0\" width=\"100%\"><tr><td colspan=\"2\">\n";
	buffer[_i++] = "\t\t\t\tThis is a sample dialog with HTML code...\n";
	buffer[_i++] = "\t\t\t</td></tr><tr><td colspan=\"2\">&nbsp;</td></tr><tr><td><b>Text Property:</b></td><td><input type=\"text\" name=\"simpledialog_text_prop\" /></td></tr><tr><td><b>Password Property:</b></td><td><input type=\"password\" name=\"simpledialog_password_prop\" /></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "Main"
}, false);
AjxTemplate.register("com_zimbra_example_simpledialogtemplate.templates.Simple", AjxTemplate.getTemplate("com_zimbra_example_simpledialogtemplate.templates.Simple#Main"), AjxTemplate.getParams("com_zimbra_example_simpledialogtemplate.templates.Simple#Main"));

