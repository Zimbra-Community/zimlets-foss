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
// auxiliary functions for dealing with flickr data

// returns the value of the `stat' attribute of the `rsp' node within an xml document
// @xml     an xml document containing the rsp node (usually as the root element)
function flickrapi_responsestatus (xml)
{
    if (xml == null) { return ""; }

    var stat = "";
    var docelem = xml.getDoc().documentElement;

    if ((docelem) && (docelem.tagName == "rsp") && (docelem.attributes.length > 0)) {
        var stat_attr = docelem.attributes.getNamedItem ("stat");
        if (stat_attr) {
            stat = stat_attr.nodeValue;
        }
    }

    return stat;
}

// returns an unsigned url suitable for HTTP GET 
// @endpoint    the base endpoint of the url (eg: a REST endpoint)
// @args        an array of pairs, each pair is an argument name/value
function flickrapi_getunsignedurl (endpoint, args)
{
    var url = endpoint;

    if (args.length > 0) {
        for (i =0; i < args.length; ++i) {
            if (i == 0) { url = url + "?"; }
            else { url = url + "&"; }
            url = url + args[i][0] + "=" + args[i][1];
        }
    }

    return url;
}

// get a signed flickr url
function flickrapi_getsignedurl (endpoint, secret, args)
{
    var url = endpoint;
    var extra = secret;

    args.sort();

    if (args.length > 0) {
        for (i = 0; i < args.length; ++i) {
            if (i == 0) { url = url + "?"; }
            else { url = url + "&"; }
            url = url + args[i][0] + "=" + args[i][1];
            extra = extra + args[i][0] + args[i][1];
        }
		AjxPackage.require("Crypt");
        extra = AjxMD5.hex_md5(extra);
        url = url + "&api_sig=" + extra;
    }

    return url;
}

// get an api signature
function flickrapi_getapisig (secret,args)
{
    var sig = secret;

    args.sort();
    if (args.length > 0)
    {
        for (var i=0; i<args.length; i++) {
            sig=sig+args[i][0] + args[i][1];
        }
		AjxPackage.require("Crypt");
        sig = AjxMD5.hex_md5(sig);
    }

    return sig;
}

/* get a human readable error message from a flickr api response object 
   (useful for logging)
 */
function flickrapi_geterrmsg (jso)
{
    var errmsg = "";

    if ((jso != null) && (jso.err != null)) {
        errmsg = errmsg + " Error: " + jso.err.code + ": " + "(" + jso.err.msg + ")";
    }

    return errmsg;
}
