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

/**
 * @class
 * This is a utility class.
 * 
 */
function com_zimbra_example_dynamictab_Util() {
};

/**
 * Gets a random number.
 * 
 * @param	{int}	range		a range
 * @return	{int}	a random number
 */
com_zimbra_example_dynamictab_Util._getRandomNumber =
function(range) {
	return Math.floor(Math.random() * range);
};

/**
 * Gets a random char.
 * 
 * @return	{String}	a random char
 */
com_zimbra_example_dynamictab_Util._getRandomChar =
function() {
	var chars = "0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ";
	return chars.substr( this._getRandomNumber(62), 1 );
};

/**
 * Generates a unique id.
 * 
 * @param	{int}	size		the size of the unique id
 * @return	{String}	the unique id
 */
com_zimbra_example_dynamictab_Util.generateUniqueID =
function(size) {
	var str = "";
	for(var i = 0; i < size; i++)
	{
		str += this._getRandomChar();
	}
	return str;
};

/**
 * Cleans the given url.
 * 
 * @param	{String}	url		the url to clean
 * @return	{String}	the resulting url
 */
com_zimbra_example_dynamictab_Util.cleanUrl =
function(url) {

	var newUrl = url;

	if (url) {
		url = url.trim();
		url = url.toLowerCase();
		
		if (url.indexOf("http://") == -1)
			url = "http://"+url;
		
		newUrl = url;
	}

	return newUrl;
};

/**
 * Checks if the item is in the array.
 * 
 * @param	{Array}		array		the array
 * @param	{String}	item		the item
 * @return	{Boolean}	<code>true</code> if the item is in the array
 */
com_zimbra_example_dynamictab_Util.arrayContains =
function(array,item) {
	for (i=0;array && i<array.length; i++) {
		if (array[i] == item)
			return true;
	}
	
	return false;
};

/**
 * 
 */
com_zimbra_example_dynamictab_Util.escapeHTML =
function (str) {                                       
    return(                                                               
        str.replace(/&/g,'&amp;').                                         
            replace(/>/g,'&gt;').                                           
            replace(/</g,'&lt;').                                           
            replace(/"/g,'&quot;')                                         
    );
    
};