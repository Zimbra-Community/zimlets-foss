/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

function Com_Zimbra_Url() {
}

Com_Zimbra_Url.prototype = new ZmZimletBase();
Com_Zimbra_Url.prototype.constructor = Com_Zimbra_Url;

Com_Zimbra_Url.prototype.init =
function() {
	
	this._disablePreview = this.getBoolConfig("disablePreview", true);
	this._youtubePreview = this.getBoolConfig("youtubePreview", true);
	this._alexaId = this.getConfig("alexaThumbnailId");	
	if (this._alexaId) {
		this._alexaId = AjxStringUtil.trim(this._alexaId);
		// console.log("Found Alexa ID: %s", this._alexaId);
		this._alexaKey = AjxStringUtil.trim(this.getConfig("alexaThumbnailKey"));
		// console.log("Found Alexa Key: %s", this._alexaKey);
	}
	Com_Zimbra_Url.REGEXES = [];
	//populate regular expressions
	var s = this.getConfig("ZIMLET_CONFIG_REGEX_VALUE");
	if(s){
		var r = new RegExp(s,"gi");
		if(r)
		Com_Zimbra_Url.REGEXES.push(r);
	}

	if (/^\s*true\s*$/i.test(this.getConfig("supportUNC"))) {
		s = this.getConfig("ZIMLET_UNC_REGEX_VALUE");
		var r = new RegExp(s,"gi");
		if(r)
		Com_Zimbra_Url.REGEXES.push(r);
	}

};

// Const
//Com_Zimbra_Url.THUMB_URL = "http://pthumbnails.alexa.com/image_server.cgi?id=" + document.domain + "&url=";
Com_Zimbra_Url.THUMB_URL = "http://images.websnapr.com/?url=";
Com_Zimbra_Url.THUMB_SIZE = 'width="200" height="150"';

// chars to ignore if they follow a URL, since they are unlikely to be part of it
Com_Zimbra_Url.IGNORE = AjxUtil.arrayAsHash([".", ",", ";", "!", "*", ":", "?", ")", "]", "}"]);

Com_Zimbra_Url.prototype.match =
function(line, startIndex) {

	for (var i = 0; i < Com_Zimbra_Url.REGEXES.length; i++) {
		
		var re = Com_Zimbra_Url.REGEXES[i];
		re.lastIndex = startIndex;
		var m = re.exec(line);
		if (!m) { continue; }

		var url = m[0];
		var last = url.charAt(url.length - 1);
		while (url.length && Com_Zimbra_Url.IGNORE[last]) {
			//bug 70084, when it's ")", check whether there are matched "(" in url
			if (last == ")") {
				var countLeft = 0;
				var countRight = 0;
				for(var j in url) {
					if(url[j] == "(") { countLeft++;}
					else if(url[j] == ")") {countRight++};
				}
				if (countLeft == countRight) {
					break;
				}
			}            
			url = url.substring(0, url.length - 1);
			last = url.charAt(url.length - 1);
		}
		m[0] = url;
		return m;
	}
};

Com_Zimbra_Url.prototype._getHtmlContent =
function(html, idx, obj, context) {

	var escapedUrl = obj.replace(/\"/g, '\"').replace(/^\s+|\s+$/g, "");
	if (escapedUrl.substr(0, 4) == 'www.') {
		escapedUrl = "http://" + escapedUrl;
	}
	if (escapedUrl.indexOf("\\\\") == 0) {
		obj.isUNC = true;
		escapedUrl = "file://" + escapedUrl;
	}
	escapedUrl = escapedUrl.replace(/\\/g, '/');

	var link = "<a target='_blank' href='" + escapedUrl; // Default link to use when ?app= fails

	if (escapedUrl.split(/[\?#]/)[0] == ("" + window.location).split(/[\?#]/)[0]) {
		var paramStr = escapedUrl.substr(escapedUrl.indexOf("?"));
		if (paramStr) {
			var params = AjxStringUtil.parseQueryString(escapedUrl);
			if (params) {
				var app = params.app;
				if (app && app.length > 0) {
					app = app.toUpperCase();
					if (appCtxt.getApp(ZmApp[app])) {
						link = "<a href='javascript:top.appCtxt.getAppController().activateApp(top.ZmApp." + app + ", null, null);";
					}
				}
			}
		}
	}
	html[idx++] = link;
	html[idx++] = "'>";
	html[idx++] = AjxStringUtil.htmlEncode(obj);
	html[idx++] = "</a>";
	return idx;
};

Com_Zimbra_Url.prototype.toolTipPoppedUp =
function(spanElement, obj, context, canvas) {

	var url = obj.replace(/^\s+|\s+$/g, "");
	if (/^\s*true\s*$/i.test(this.getConfig("stripUrls"))) {
		url = url.replace(/[?#].*$/, "");
	}
	if (url.indexOf("\\\\") == 0) {
		url = "file:" + url;
	}
	url = url.replace(/\\/g, '/');

	if (this._disablePreview || url.indexOf("file://") == 0) {  // local files
		this._showUrlThumbnail(url, canvas);
	}
	else if (this._alexaId) {
		this._showAlexaThumbnail(url, canvas);
	}
	else {
		// Pre-load placeholder image
		(new Image()).src = this.getResource('blank_pixel.gif');
		this._showFreeThumbnail(url, canvas);
	}
};

Com_Zimbra_Url.prototype.clicked = function(){
	var tooltip = DwtShell.getShell(window).getToolTip();
	if (tooltip) {
		tooltip.popdown();
	}
	return true;
};

Com_Zimbra_Url.prototype._showUrlThumbnail = function(url, canvas){
	var decodedURI = AjxStringUtil.urlDecode(url);
	if (decodedURI && decodedURI !== "") {
		canvas.innerHTML = "<b>" + ZmMsg.urlLabel + "</b> " + AjxStringUtil.htmlEncode(decodedURI);
	}
	else if (decodedURI === "") {
		canvas.innerHTML = "<b>" + ZmMsg.urlLabel + "</b> " + AjxStringUtil.htmlEncode(url);
	}
};

Com_Zimbra_Url.prototype._showFreeThumbnail = function(url, canvas) {
	var html = [];
	var i = 0;

	html[i++] = "<img src='";
	html[i++] = this.getResource("blank_pixel.gif");
	html[i++] = "' ";
	html[i++] = Com_Zimbra_Url.THUMB_SIZE;
	html[i++] = " style='background: url(";
	html[i++] = '"';
	html[i++] = Com_Zimbra_Url.THUMB_URL;
	html[i++] = url;
	html[i++] = '"';
	html[i++] = ")'/>";

	canvas.innerHTML = html.join("");
};


Com_Zimbra_Url.ALEXA_THUMBNAIL_CACHE = {};
Com_Zimbra_Url.ALEXA_CACHE_EXPIRES = 10 * 60 * 1000; // 10 minutes

Com_Zimbra_Url.prototype._showAlexaThumbnail = function(url, canvas) {
	canvas.innerHTML = [ "<table style='width: 200px; height: 150px; border-collapse: collapse' cellspacing='0' cellpadding='0'><tr><td align='center'>",
				 ZmMsg.fetchingAlexaThumbnail,
				 "</td></tr></table>" ].join("");

	// check cache first
	var cached = Com_Zimbra_Url.ALEXA_THUMBNAIL_CACHE[url];
	if (cached) {
		var diff = new Date().getTime() - cached.timestamp;
		if (diff < Com_Zimbra_Url.ALEXA_CACHE_EXPIRES) {
			// cached image should still be good, let's use it
			var html = [ "<img src='", cached.img, "' />" ].join("");
			canvas.firstChild.rows[0].cells[0].innerHTML = html;
			return;
		} else {
			// expired
			delete Com_Zimbra_Url.ALEXA_THUMBNAIL_CACHE[url];
		}
	}

	var now = new Date(), pad = Com_Zimbra_Url.zeroPad;
	var timestamp =
		pad(now.getUTCFullYear()  , 4) + "-" +
		pad(now.getUTCMonth() + 1 , 2) + "-" +
		pad(now.getUTCDate()	  , 2) + "T" +
		pad(now.getUTCHours()	  , 2) + ":" +
		pad(now.getUTCMinutes()	  , 2) + ":" +
		pad(now.getUTCSeconds()	  , 2) + ".000Z";
	// console.log("Timestamp: %s", timestamp);
	var signature = this._computeAlexaSignature(timestamp);
	// console.log("Computed signature: %s", signature);
	var args = {
		Service		: "AlexaSiteThumbnail",
		Action		: "Thumbnail",
		AWSAccessKeyId	: this._alexaId,
		Timestamp	: timestamp,
		Signature	: signature,
		Size		: "Large",
		Url		: url
	};
	var query = [];
	for (var i in args)
		query.push(i + "=" + AjxStringUtil.urlComponentEncode(args[i]));
	query = "http://ast.amazonaws.com/xino/?" + query.join("&");
	// console.log("Query URL: %s", query);
	this.sendRequest(null, query, null, new AjxCallback(this, this._alexaDataIn,
								[ canvas, url, query ]),
			 true);
};

Com_Zimbra_Url.prototype._computeAlexaSignature = function(timestamp) {
	return AjxSHA1.b64_hmac_sha1(this._alexaKey, "AlexaSiteThumbnailThumbnail" + timestamp)
		+ "=";		// guess what, it _has_ to end in '=' :-(
};

Com_Zimbra_Url.prototype._alexaDataIn = function(canvas, url, query, result) {
	var xml = AjxXmlDoc.createFromDom(result.xml);
	var res = xml.toJSObject(true /* drop namespace decls. */,
				 false /* keep case */,
				 true /* do attributes */);
	res = res.Response;
	if (res.ResponseStatus.StatusCode == "Success") {
		if (res.ThumbnailResult.Thumbnail.Exists == "true") {
			var html = [ "<img src='", res.ThumbnailResult.Thumbnail, "' />" ].join("");
			// console.log("HTML: %s", html);
			canvas.firstChild.rows[0].cells[0].innerHTML = html;

			// cache it
			Com_Zimbra_Url.ALEXA_THUMBNAIL_CACHE[url] = {
				img	  : res.ThumbnailResult.Thumbnail,
				timestamp : new Date().getTime()
			};
		} else
			this._showFreeThumbnail(url, canvas);
	} else
		this._showFreeThumbnail(url, canvas);
};

Com_Zimbra_Url.zeroPad = function(number, width) {
	var s = "" + number;
	while (s.length < width)
		s = "0" + s;
	return s;
};

//Begin YouTube section
Com_Zimbra_Url.YOUTUBE_LINK_PATTERN1 = "youtube.com/watch?";
Com_Zimbra_Url.YOUTUBE_LINK_PATTERN2 = "youtube.com/v/";
Com_Zimbra_Url.YOUTUBE_LINK_PATTERN3 = "youtu.be/";
Com_Zimbra_Url.YOUTUBE_FEED = "http://gdata.youtube.com/feeds/api/videos/@ID?alt=jsonc&v=2";
Com_Zimbra_Url.YOUTUBE_EMBED_URL = "//www.youtube.com/embed/";
Com_Zimbra_Url.YOUTUBE_DEFAULT_THUMBNAIL = "https://img.youtube.com/vi/@ID/default.jpg";
Com_Zimbra_Url.PROTOCOL = location.protocol;
Com_Zimbra_Url.YOUTUBE_MAX_VIDEOS = 5;

/**
 * Get the gDATA feed so we can parse for title & thumbnail
 */
Com_Zimbra_Url.prototype._getYouTubeFeed =
function(msgElId, youTubeHash, youTubeCtrl) {
	for (var youTubeId in youTubeHash) {
		var gDataUrl = Com_Zimbra_Url.YOUTUBE_FEED;
		gDataUrl = gDataUrl.replace("@ID", youTubeId);
		gDataUrl = ZmZimletBase.PROXY + AjxStringUtil.urlComponentEncode(gDataUrl);
		var params = {
				url: gDataUrl,
				callback: this._parseYouTubeFeed.bind(this, youTubeId, msgElId, youTubeHash, youTubeCtrl)
			};
		AjxLoader.load(params);
	}
};

/**
 * Parse the feed for thumbnail, title
 * @param youTubeId {String} 11 character id
 * @param req {HttpResponse} http response
 */
Com_Zimbra_Url.prototype._parseYouTubeFeed =
function(youTubeId, msgElId, youTubeHash, youTubeCtrl, req) {
	if (req.status != 200) {
		DBG.println(AjxDebug.DBG1, "Error code in parsing YouTube Feed. Code = " + req.status);
		var thumbnail = Com_Zimbra_Url.YOUTUBE_DEFAULT_THUMBNAIL.replace("@ID", youTubeId);
		var title = "";
	}
	else {
		var json = eval("(" + req.responseText + ")");
		var thumbnail = json.data.thumbnail["sqDefault"];
		var title = json.data.title;
	}
	youTubeHash[youTubeId] = {thumbnail : thumbnail, title : title};
	this._buildYouTubeImageHtml(youTubeId, msgElId, youTubeHash, youTubeCtrl);
};

/**
 * Extract YouTube video Id from URL.
 * @param url
 * @return {String} id YouTube video id
 */
Com_Zimbra_Url.prototype.getYouTubeId =
function(url) {
	var id = null;
	var index = url.indexOf(Com_Zimbra_Url.YOUTUBE_LINK_PATTERN1);
	if (index != -1) {
		var qs = AjxStringUtil.parseQueryString(url);
		if (qs && qs['v']) {
			id = qs['v'];
		}
	}
	else {
		index = url.indexOf(Com_Zimbra_Url.YOUTUBE_LINK_PATTERN2);
		if (index != -1) {
			id = AjxStringUtil.trim(url.substring(index + Com_Zimbra_Url.YOUTUBE_LINK_PATTERN2.length));
		}
		else {
			index = url.indexOf(Com_Zimbra_Url.YOUTUBE_LINK_PATTERN3);
			if (index != -1) {
				id = AjxStringUtil.trim(url.substring(index + Com_Zimbra_Url.YOUTUBE_LINK_PATTERN3.length));
			}
		}
	}
	return id;
};

/**
 * Display YouTube video using iframe API
 * @param youTubeId
 * @param msgElId
 */
Com_Zimbra_Url.prototype._showYouTubeVideo =
function(youTubeId, msgElId, youTubeHash) {

	var div = document.getElementById(this._getVidDivId(msgElId));
	if (!div) {
		return;
	}
	var iframeEl = document.getElementById(this._getVidIframeId(msgElId));
	var opac;
	if (!Dwt.getVisible(div)) {
		div.innerHTML = this._getYouTubeEmbed(youTubeId, msgElId);
		Dwt.setVisible(div, true);
		opac = true;
	}
	else {
		if (iframeEl && iframeEl.src === this._getVidEmbedUrl(youTubeId)) {
			//clicking on the thumbnail of the current visible video again, hides the video.
			Dwt.setVisible(div, false);
			div.innerHTML = "";
			opac = false;
		}
		else {
			div.innerHTML = this._getYouTubeEmbed(youTubeId, msgElId);
			opac = true;
		}
	}
	this._setYouTubeOpacity(youTubeId, msgElId, youTubeHash, opac);
};

/**
 * Setup youtube video using iframe API
 * @param youTubeId
 * @param msgElId
 */
Com_Zimbra_Url.prototype._getYouTubeEmbed =
function(youTubeId, msgElId) {
	var iframeId = this._getVidIframeId(msgElId);
	return '<br/><iframe id="' + iframeId +'" class="youtube-player" type="text/html"' +
			'width="640" '  +
			'height="385"'  +
			'src="' + this._getVidEmbedUrl(youTubeId) + '" frameborder="0"></iframe>';
};

Com_Zimbra_Url.prototype._getVidEmbedUrl =
function(youTubeId) {
	return Com_Zimbra_Url.PROTOCOL + Com_Zimbra_Url.YOUTUBE_EMBED_URL + youTubeId + "?autoplay=1&rel=0";
};
/**
 * Display thumbnail of youtube video
 * @param youTubeId
 */
Com_Zimbra_Url.prototype._showYouTubeThumbnail =
function(youTubeId, youTubeHash) {
	return "<div class='thumb-wrapper'><div class='play'></div><img src='" + youTubeHash[youTubeId].thumbnail + "' border='2'></div>";
};

/**
 * Parse the mail message for youtube links matching a specified pattern
 * @param text
 */
Com_Zimbra_Url.prototype._getAllYouTubeLinks =
function(text) {
	var none = {links: {}, reachedMax: false};
	if (!text) {
		return none;
	}
	var youTubeArr = text.match(/(\b(((http | https)\:\/\/)?(www\.)?((youtube\.com\/watch\?v=)|(youtube\.com\/watch\?.*\&v=)|(youtube\.com\/v\/)|(youtu\.be\/))((-)?[0-9a-zA-Z_-]+)?(&\w+=\w+)*)\b)/gi);
	var hash = {};
	if (!youTubeArr) {
		return none;
	}
	var reachedMax = false;
	for (var i = 0; i < youTubeArr.length; i++) {
		if (i === Com_Zimbra_Url.YOUTUBE_MAX_VIDEOS) {
			reachedMax = true;
			break;
		}
		var id = this.getYouTubeId(youTubeArr[i]);

		if (!hash.hasOwnProperty(id)) {
			hash[id] = youTubeArr[i];
		}
	}
	return {links: hash, reachedMax: reachedMax};
};

/**
 * Build the HTML of YouTube thumbnails
 * @param youTubeId
 */
Com_Zimbra_Url.prototype._buildYouTubeImageHtml =
function(youTubeId, msgElId, youTubeHash, youTubeCtrl) {
	if (!youTubeId) {
		return;
	}
	
	var imgHtml = this._showYouTubeThumbnail(youTubeId, youTubeHash);
	var imgSpan = document.createElement("div");
	imgSpan.className = "youTubeImagePreview";
	imgSpan.innerHTML = imgHtml;
	imgSpan.id = this._getThumbSpanId(youTubeId, msgElId);
	youTubeCtrl.getHtmlElement().appendChild(imgSpan);
	youTubeCtrl.setData(imgSpan.id, {youTubeId: youTubeId}); //todo - maybe actually use this to get the info? It seems we only store it.
	var parentDiv = this._getVidsContainer(msgElId);
	var videoDiv = document.getElementById(this._getVidDivId(msgElId));
	if (parentDiv && videoDiv) {
		parentDiv.insertBefore(youTubeCtrl.getHtmlElement(), videoDiv);
		Dwt.setVisible(parentDiv, true);
	}
};

/**
 * Onclick handler for playing video.
 * @param ev
 */
Com_Zimbra_Url.prototype._onYouTubeClickListener =
function(youTubeHash, ev) {
	if (!ev || !ev.target || !ev.target.parentNode || !ev.target.parentNode.parentNode) {
		return;
	}
	var ids = ev.target.parentNode.parentNode.id.split("$");
	var youTubeId = ids[1];
	var msgElId = ids[2];
	if (youTubeId && msgElId) {
		this._showYouTubeVideo(youTubeId, msgElId, youTubeHash);
	}
};

Com_Zimbra_Url.prototype._onYouTubeMouseOver =
function(ev) {
	if (ev && ev.target && ev.target.tagName.toLowerCase() == "img") {
		ev.target.style.border = "2px solid white";
	}
};

Com_Zimbra_Url.prototype._onYouTubeMouseOut =
function(ev) {
   	if (ev && ev.target && ev.target.tagName.toLowerCase() == "img") {
		ev.target.style.border = "2px solid";
	}
};

Com_Zimbra_Url.prototype._getVidsContainerId =
function(msgElId) {
	return ["YOUTUBE", msgElId].join("$");
};

Com_Zimbra_Url.prototype._getVidsContainer =
function(msgElId) {
	return document.getElementById(this._getVidsContainerId(msgElId));
};

Com_Zimbra_Url.prototype._getThumbSpanId =
function(youTubeId, msgElId) {
	return ["YOUTUBE", youTubeId, msgElId].join("$");
};

Com_Zimbra_Url.prototype._getThumbSpan =
function(youTubeId, msgElId) {
	return document.getElementById(this._getThumbSpanId(youTubeId, msgElId));
};

Com_Zimbra_Url.prototype._getVidDivId =
function(msgElId) {
	return ["YOUTUBE-VID", msgElId].join("$");
};

Com_Zimbra_Url.prototype._getVidIframeId =
function(msgElId) {
	return ["YOUTUBE-IFRAME", msgElId].join("$");
};

Com_Zimbra_Url.prototype._setYouTubeOpacity =
function(youTubeId, msgElId, youTubeHash, opac) {
	for (var id in youTubeHash) {
		img = this._getThumbSpan(id, msgElId);
		img = img && img.firstChild;
		if (!img) {
			continue;
		}
		if (opac && id === youTubeId) {
			img.style.opacity = 0.4;
		}
		else {
			img.style.opacity = "";
		}
	}
};



/**
 * handle youtube videos on message view
 * @param msg
 */
Com_Zimbra_Url.prototype.onMsgView = 
function(msg, oldMsg, msgView) {
	this.renderYouTube(msg, msgView);
};

Com_Zimbra_Url.prototype.renderYouTube =
function(msg, msgView) {
	if (!this._youtubePreview || appCtxt.isChildWindow) {
		return;
	}

	var text = msgView && msgView.getContent();
	var ret = this._getAllYouTubeLinks(text);
	var youTubeHash = ret.links;
	var reachedMax = ret.reachedMax;
	if (!AjxUtil.arraySize(youTubeHash)) {
		return;
	}

	var msgElId = msgView._htmlElId;
	var msgEl = document.getElementById(msgElId);
	
	if (!msgEl) {
		return;
	}

	var div = document.createElement("DIV");
	div.className = "video-panel";
	div.id = this._getVidsContainerId(msgElId);
	div.style.display = "none"; //don't show until we're getting all the thumbnails
	var title = reachedMax ? this.getMessage("youTubeTitleMax").replace("{0}", Com_Zimbra_Url.YOUTUBE_MAX_VIDEOS) : this.getMessage("youTubeTitle");

	div.innerHTML = "<h3 class='user_font_" + appCtxt.get(ZmSetting.FONT_NAME) +"'>" + title + "</h3>";
		
	var spaceDiv = document.createElement("div");
	spaceDiv.style.padding = "5px";
	msgEl.appendChild(spaceDiv);
	msgEl.appendChild(div);

	var videoDiv = document.createElement("div");
	videoDiv.id = this._getVidDivId(msgElId);
	videoDiv.style.display = "none";
	videoDiv.className = "movie-player";
	div.appendChild(videoDiv);

	var youTubeCtrl = new DwtControl({parent: appCtxt.getShell()});
	youTubeCtrl.addListener(DwtEvent.ONMOUSEDOWN, this._onYouTubeClickListener.bind(this, youTubeHash));
	youTubeCtrl.addListener(DwtEvent.ONMOUSEOVER, this._onYouTubeMouseOver.bind(this));
	youTubeCtrl.addListener(DwtEvent.ONMOUSEOUT, this._onYouTubeMouseOut.bind(this));
	youTubeCtrl.reparentHtmlElement(videoDiv);

	this._getYouTubeFeed(msgElId, youTubeHash, youTubeCtrl);

};

Com_Zimbra_Url.CALENDAR_URL_EXTENSION = 'ics';

Com_Zimbra_Url.prototype.getActionMenu =
function(obj, span, context) {
    var uri = AjxStringUtil.parseURL(obj),
        fileName = uri.fileName,
        extension = fileName ? fileName.substring(fileName.lastIndexOf('.') + 1) : '';
    if(!appCtxt.get(ZmApp.SETTING[ZmId.APP_CALENDAR]) ||
        extension != Com_Zimbra_Url.CALENDAR_URL_EXTENSION) {
        return false;
    }
	if (this._zimletContext._contentActionMenu instanceof AjxCallback) {
		this._zimletContext._contentActionMenu = this._zimletContext._contentActionMenu.run();
	}
	// Set some global context since the parent Zimlet (Com_Zimbra_Date) will be called for
	// right click menu options, even though the getActionMenu will get called on the sub-classes.
	Com_Zimbra_Url._actionObject = obj;
	Com_Zimbra_Url._actionSpan = span;
	Com_Zimbra_Url._actionContext = context;
	return this._zimletContext._contentActionMenu;
};

Com_Zimbra_Url.prototype.menuItemSelected =
function(itemId, ev) {
	switch (itemId) {
		case "NEWCAL":		this._newCalListener(ev); break;
		case "GOTOURL":		this._goToUrlListener(); break;
	}
};

Com_Zimbra_Url.prototype._goToUrlListener =
function() {
    window.open(Com_Zimbra_Url._actionObject, "_blank");
};

Com_Zimbra_Url.prototype.getMainWindow =
function(appId) {
	return appCtxt.isChildWindow ? window.opener : window;
};

Com_Zimbra_Url.prototype._newCalListener =
function(ev) {
    AjxDispatcher.require(["CalendarCore", "Calendar"]);
    var oc = appCtxt.getOverviewController();
	var treeController = oc.getTreeController(ZmOrganizer.CALENDAR);

    var iCal = {
                url : Com_Zimbra_Url._actionObject
            };
    treeController._newListener(ev);
    var dialog = appCtxt.getNewCalendarDialog();
    dialog.setICalData(iCal);
};
