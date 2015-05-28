/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2011, 2014 Zimbra, Inc.
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
 * All portions of the code are Copyright (C) 2011, 2014 Zimbra, Inc. All Rights Reserved. 
 * ***** END LICENSE BLOCK *****
 */
AjxTemplate.register("com_zimbra_cloudchat.templates.ZmCloudChat#BuddyListWidget", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div style='cursor:pointer;' class='overviewHeader'><table cellpadding='0' cellspacing='0'><tr><td><div id='cloudchat_buddy_list_expand_icon' class='ImgNodeExpanded' ></div></td><td class='overviewHeader-Text' width='100%'>";
	buffer[_i++] = data["cloudChatStr"];
	buffer[_i++] = "</td><td id='cloudchat_buddy_list_pref_icon' style='padding-right:20px' class='ImgPreferences'></td></tr></table></div><div id='cloudchat_content_div' style='cursor: pointer'><div class='CloudChatInfoDiv'><div style='padding:3px;'><b>";
	buffer[_i++] = data["chatStatusStr"];
	buffer[_i++] = "</b></div><div  id='cloudChat_buddy_login_info_div' style='width:190px'></div></div><div id='cloudchat_login_widget_div'><table align=center><tr><td id='cloudChat_buddy_login_btn_cell'></td></tr></table></div><div id='cloudchat_buddyList_widget' style='cursor:pointer;display:none;'><div id='cloudchat_emailParticipants_hdr' class='overviewHeader' style='width:100%;display:none'><table cellpadding='0' cellspacing='0'><tr><td><b>";
	buffer[_i++] = data["emailParticipants"];
	buffer[_i++] = "</b></td></tr></table></div><div id='cloudchat_emailParticipants_div'></div><div id='cloudchat_buddyList_hdr' class='overviewHeader' style='width:100%'><table cellpadding='0' cellspacing='0'><tr><td><b>";
	buffer[_i++] = data["chatUsers"];
	buffer[_i++] = "</b></td></tr></table></div><div id='cloudchat_buddyList_div'></div><br><div id='cloudChat_buddy_list_actions_menu_container'><table align=center><tr><td id='cloudChat_buddy_list_actions_menu'></td></tr></table></div></div></div><br>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "BuddyListWidget"
}, true);
AjxPackage.define("com_zimbra_cloudchat.templates.ZmCloudChat");
AjxTemplate.register("com_zimbra_cloudchat.templates.ZmCloudChat", AjxTemplate.getTemplate("com_zimbra_cloudchat.templates.ZmCloudChat#BuddyListWidget"), AjxTemplate.getParams("com_zimbra_cloudchat.templates.ZmCloudChat#BuddyListWidget"));

