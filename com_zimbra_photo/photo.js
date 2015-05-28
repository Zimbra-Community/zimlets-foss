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

// Initialize 
function Com_Zimbra_Photo() {
    this.nameToImage= {
	"Bill Evans" : "bill_evans.jpg",
	"Jimmy Smith" : "jimmy_smith.jpg",
	"Medeski" : "medeski.jpg",
	"Thelonious Monk" : "monk.jpg",
	"Ray Charles" : "ray_charles.jpg"
    };
}

Com_Zimbra_Photo.prototype.init =
    function() {
	// Pre-load placeholder image
	(new Image()).src = this.getResource('blank_pixel.gif');
    };

Com_Zimbra_Photo.prototype = new ZmZimletBase();
Com_Zimbra_Photo.prototype.constructor = Com_Zimbra_Photo;

Com_Zimbra_Photo.prototype.match =
    function(line, startIndex) {
	var match;

	for (var name in this.nameToImage) {
	    var i = line.indexOf(name, startIndex);
	    // Skip if not found or this match isn't earlier
	    if (i < 0 || (match != null && i >= match.index)) {
		continue;
	    }

	    match = {index: i};
	    match[0] = name;
	}
	return match;
    };

Com_Zimbra_Photo.prototype.toolTipPoppedUp =
    function(spanElement, obj, context, canvas) {
	var image = this.nameToImage[obj];
	// alert("obj = '" + obj + "', image='" + image + "'");
	canvas.innerHTML = '<img src="' +
	this.getResource(image) +
	'"/>';
    };
