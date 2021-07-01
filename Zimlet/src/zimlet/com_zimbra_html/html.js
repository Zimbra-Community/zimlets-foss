/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2007, 2009, 2010, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2007, 2009, 2010, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

function Com_Zimbra_Html() {
    ZmZimletBase.call(this);
}
Com_Zimbra_Html.prototype = new ZmZimletBase;
Com_Zimbra_Html.prototype.constructor = Com_Zimbra_Html;

//
// Constants
//

Com_Zimbra_Html.INLINE = "inline";
Com_Zimbra_Html.IFRAME = "iframe";

//
// Public methods
//

Com_Zimbra_Html.prototype.portletCreated = function(portlet) {
    var refresh = portlet.properties.refresh;
    if (refresh) {
        portlet.setRefreshInterval(refresh);
    }
    this.portletRefreshed(portlet);
};

Com_Zimbra_Html.prototype.portletRefreshed = function(portlet) {
    var isIFrame = portlet.properties.type != Com_Zimbra_Html.INLINE;
    if (isIFrame) {
        var html = [
            "<iframe ",
                "style='border:none;width:100%;height:100%' ",
                "src='",portlet.properties.url,"'",
            "></iframe>"
        ].join("");
        portlet.setContent(html);
    }
    else {
        var url = portlet.properties.url || "";
        if (url.match(/^(https?|ftp):/)) {
            url = ZmZimletBase.PROXY + AjxStringUtil.urlComponentEncode(url);
        }
        else if (!url.match(/^\//)) {
            url = this.getResource(url);
        }
        var params = {
            url: url,
            callback: new AjxCallback(this, this._handleHtml, [portlet])
        };
        AjxLoader.load(params);
    }
};

//
// Protected methods
//

Com_Zimbra_Html.prototype._handleHtml = function(portlet, req) {
    if (!req || !req.responseText) return;
    portlet.setContent(req.responseText);
};