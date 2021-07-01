/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

function Com_Zimbra_DnD() {
}

Com_Zimbra_DnD.prototype = new ZmZimletBase();
Com_Zimbra_DnD.prototype.constructor = Com_Zimbra_DnD;

Com_Zimbra_DnD.prototype.init = function () {

    this.isHTML5 = false;
    this.checkHTML5Dnd();
    if (this.isHTML5 && !AjxEnv.isIE) {
       this._initHTML5();
    } else if(!AjxEnv.isIE) {
       this._initNonHTM5();  
    }
    this.upLoadC = 0;
    this.attachment_ids = [];
};

Com_Zimbra_DnD.prototype.isDndSupported = function (evntname) {

    var element = document.createElement('div');
    evntname = 'on' + evntname;

    var isSupported = (evntname in element);

    if (!isSupported && element.setAttribute && AjxEnv.isFirefox3_6up) {
       element.setAttribute(evntname, 'return;');
       isSupported = typeof element[evntname] == 'function';
    }

    element = null;

    return isSupported;
};

Com_Zimbra_DnD.prototype.checkHTML5Dnd = function () {

    if(!this.isHTML5) {
        this.isHTML5 = this.isDndSupported('drag')
                && this.isDndSupported('dragstart')
                && this.isDndSupported('dragenter')
                && this.isDndSupported('dragover')
                && this.isDndSupported('dragleave')
                && this.isDndSupported('dragend')
                && this.isDndSupported('drop');
    }

};

Com_Zimbra_DnD.prototype._initNonHTM5 = function () {

    var outerEl = document.getElementById("skin_outer");
	var filesEl = document.getElementById("zdnd_files");
	if (outerEl && !filesEl) {
		var fileSpan = document.createElement("span");
		fileSpan.id = "zdnd_files";
		fileSpan.style.display = "none";
		fileSpan.innerHTML = this.getConfig("dnd-uploadform");
		outerEl.appendChild(fileSpan);
	}

	if (document.getElementById("zdnd_files")) {
		var uploadUri = appCtxt.get(ZmSetting.CSFE_UPLOAD_URI);
		var zDnDUploadFrm = document.getElementById("zdnd_form");
		zDnDUploadFrm.setAttribute("action", uploadUri);
	}

    var cmd = window.newWindowCommand;
    if(cmd == 'compose' || cmd == 'msgViewDetach' || cmd == 'composeDetach') {
            var self = this;
            setTimeout(AjxCallback.simpleClosure(function(cmd) {
                var curView = appCtxt.getAppViewMgr().getCurrentView();
                var el = curView.getHtmlElement();
                var doc = el.ownerDocument;
                var filesEl = doc.getElementById("zdnd_files");
                if (!filesEl) {
                    var fileSpan = doc.createElement("span");
                    fileSpan.id = "zdnd_files";
                    fileSpan.style.display = "none";
                    fileSpan.innerHTML = window.opener.document.getElementById("zdnd_files").innerHTML;
                    el.appendChild(fileSpan);
                }

                if (doc.getElementById("zdnd_files")) {
                    var uploadUri = appCtxt.get(ZmSetting.CSFE_UPLOAD_URI);
                    var zDnDUploadFrm = doc.getElementById("zdnd_form");
                    zDnDUploadFrm.setAttribute("action", uploadUri);
                }
                if(cmd == 'compose' || cmd == 'composeDetach') {
                    var ev = document.createEvent("Events");
                    ev.initEvent("ZimbraDnD", true, false);
                    curView._resetBodySize();
                    el.dispatchEvent(ev);
                }
            }, this, cmd), 1000);
    }
    
};

Com_Zimbra_DnD.prototype._initHTML5 = function () {

    /*var cmd = window.newWindowCommand;
    if(cmd == 'compose' || cmd == 'msgViewDetach') {
        setTimeout(AjxCallback.simpleClosure(function() {
            var curView = appCtxt.getAppViewMgr().getCurrentView();
            var el = curView.getHtmlElement();
            alert(el);
            this._addHandlers(el);
            var dndTooltip = document.getElementById(el.id + '_zdnd_tooltip');
            alert(dndTooltip);
            dndTooltip.style.display = "block";
        },this),1000);
    }*/
    
};

Com_Zimbra_DnD.prototype._setToolTip =
function(){
    if (!this.dndTooltipEl && !this.dndTooltipEl.style){
        return;
    }
    var curView = appCtxt.getAppViewMgr().getCurrentView();
    var controller = curView.getController();
    if(!controller) { return; }

    if (curView._attachCount > 0 || this.upLoadC > 0){
          this.dndTooltipEl.innerHTML = "";
          this.dndTooltipEl.style.display = "none";
    } else {
          this.dndTooltipEl.innerHTML = ZmMsg.dndTooltip;
          this.dndTooltipEl.style.display = "block";
    }
};

Com_Zimbra_DnD.prototype.onShowView =
function(viewId, isNewView) {
    var isWindowsSafari = (AjxEnv.isWindows && !AjxEnv.isChrome && !AjxEnv.isFirefox);
    if(AjxEnv.isDesktop) {    //bug:
    	isWindowsSafari = false;
    }
	var viewType = appCtxt.getViewTypeFromId(viewId);
    if(this.isHTML5 && !AjxEnv.isIE && !isWindowsSafari) {
        if (viewType == ZmId.VIEW_COMPOSE) {
            var curView = appCtxt.getAppViewMgr().getCurrentView();
            var el = curView.getHtmlElement();
            
            this._addHandlers(el);
            this.dndTooltipEl = document.getElementById(el.id + '_zdnd_tooltip');
            this._setToolTip();
        }
    } else if ("createEvent" in document && document.getElementById("zdnd_files") && !AjxEnv.isIE && !isWindowsSafari) {
        if (viewType == ZmId.VIEW_COMPOSE ||
			viewType == ZmId.VIEW_BRIEFCASE_COLUMN ||
			viewType == ZmId.VIEW_BRIEFCASE ||
			viewType == ZmId.VIEW_BRIEFCASE_DETAIL) {

			var ev = document.createEvent("Events");
			ev.initEvent("ZimbraDnD", true, false);

			var curView = appCtxt.getAppViewMgr().getCurrentView();

			if (viewType == ZmId.VIEW_COMPOSE) {
				curView._resetBodySize();
			}
            var el = curView.getHtmlElement();
			el.dispatchEvent(ev);
		}
	}
};

Com_Zimbra_DnD.uploadDnDFiles =
function() {
	var viewType = appCtxt.getCurrentViewType();
	if (viewType == ZmId.VIEW_COMPOSE ||
		viewType == ZmId.VIEW_BRIEFCASE_COLUMN ||
		viewType == ZmId.VIEW_BRIEFCASE ||
		viewType == ZmId.VIEW_BRIEFCASE_DETAIL)
	{
		var curView = appCtxt.getAppViewMgr().getCurrentView();
        /*if(window.newWindowCommand == 'compose'){
           window.opener.document.getElementById("zdnd_files").innerHTML = document.getElementById("zdnd_files").innerHTML;
        }*/
		if (curView && curView.uploadFiles) {
			curView.uploadFiles();
		}
	}
};

Com_Zimbra_DnD.prototype._addHandlers = function(el) {
    Dwt.setHandler(el,"ondragenter",this._onDragEnter);
    Dwt.setHandler(el,"ondragover",this._onDragOver);
    Dwt.setHandler(el,"ondrop", AjxCallback.simpleClosure(this._onDrop, this));
};

Com_Zimbra_DnD.prototype._onDragEnter = function(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    if(ev.dataTransfer && ev.dataTransfer.types) {
        var isFileType = false;
        for(var i = 0; i < ev.dataTransfer.types.length; i++) {
            var type = ev.dataTransfer.types[i];
            if(type == "Files" || type == "application/x-moz-file") {
                isFileType = true;
            }
        }
        return isFileType;
    } else {
        return false;
    }
};

Com_Zimbra_DnD.prototype._onDragOver = function(ev) {
    return false;
};

Com_Zimbra_DnD.prototype._onDrop = function(ev) {
    ev.stopPropagation();
    ev.preventDefault();

    var dt = ev.dataTransfer;
    var files = dt.files;
    
    if(files) {

        for (var j = 0; j < files.length; j++) {
            var file = files[j];
            var size = file.size || file.fileSize; /*Safari*/;
            if(size > appCtxt.get(ZmSetting.ATTACHMENT_SIZE_LIMIT)) {
                this._setToolTip();
                var msgDlg = appCtxt.getMsgDialog();
                var errorMsg = AjxMessageFormat.format(ZmMsg.attachmentSizeError, AjxUtil.formatSize(appCtxt.get(ZmSetting.ATTACHMENT_SIZE_LIMIT)));
                msgDlg.setMessage(errorMsg, DwtMessageDialog.WARNING_STYLE);
                msgDlg.popup();
                return false;
            }
        }

        var curView = appCtxt.getAppViewMgr().getCurrentView();
        var controller = curView.getController();
        if(!controller) { return; }

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var size = file.size || file.fileSize /*Safari*/;
            if(size > appCtxt.get(ZmSetting.ATTACHMENT_SIZE_LIMIT)) {
                continue;
            }
            this._uploadFiles(file, controller);
            this.dndTooltipEl.innerHTML = "<img src='/img/animated/ImgSpinner.gif' width='16' height='16' border='0' style='float:left;'/>&nbsp;<div style='display:inline;'>" + ZmMsg.attachingFiles + "</div>";
            this.dndTooltipEl.style.display = "block";
        }
    }

};

/* Convert non-ASCII characters to valid HTML UNICODE entities */
Com_Zimbra_DnD.prototype.convertToEntities = function (astr){
	var bstr = '', cstr, i = 0;
	for(i; i < astr.length; ++i){
		if(astr.charCodeAt(i) > 127){
			cstr = astr.charCodeAt(i).toString(10);
			while(cstr.length < 4){
				cstr = '0' + cstr;
			}
			bstr += '&#' + cstr + ';';
		} else {
			bstr += astr.charAt(i);
		}
	}
	return bstr;
};

Com_Zimbra_DnD.prototype._uploadFiles = function(file, controller) {

    try {

        var req = new XMLHttpRequest();
        var fileName = file.name || file.fileName;
        this.upLoadC = this.upLoadC + 1;
        req.open("POST", appCtxt.get(ZmSetting.CSFE_ATTACHMENT_UPLOAD_URI)+"?fmt=extended,raw", true);
        req.setRequestHeader("Cache-Control", "no-cache");
        req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        req.setRequestHeader("Content-Type",  (file.type || "application/octet-stream") + ";");
        req.setRequestHeader("Content-Disposition", 'attachment; filename="'+ this.convertToEntities(fileName) + '"');

        var tempThis = req;
        req.onreadystatechange = AjxCallback.simpleClosure(this._handleResponse, this, tempThis, controller);

        req.send(file);
        delete req;
    } catch(exp) {
        var msgDlg = appCtxt.getMsgDialog();
        this.upLoadC = this.upLoadC - 1;
        msgDlg.setMessage(ZmMsg.importErrorUpload, DwtMessageDialog.CRITICAL_STYLE);
        this._setToolTip();
        msgDlg.popup();
        return false;
    }
};


Com_Zimbra_DnD.prototype._handleErrorResponse = function(respCode) {

    var warngDlg = appCtxt.getMsgDialog();
    var style = DwtMessageDialog.CRITICAL_STYLE;
    if (respCode == '200') {
        return true;
    } else if(respCode == '413') {
        warngDlg.setMessage(ZmMsg.errorAttachmentTooBig, style);
    } else {
       var msg = AjxMessageFormat.format(ZmMsg.errorAttachment, (respCode || AjxPost.SC_NO_CONTENT));
       warngDlg.setMessage(msg, style);
    }
    this.upLoadC = this.upLoadC - 1;
    warngDlg.popup();
};

Com_Zimbra_DnD.prototype._handleResponse = function(req, controller) {
    if(req) {
        if(req.readyState == 4 && req.status == 200) {
            var resp = eval("["+req.responseText+"]");

            this._handleErrorResponse(resp[0]);
            this._setToolTip();

            if(resp.length > 2) {
                var respObj = resp[2];
                for (var i = 0; i < respObj.length; i++) {
                    if(respObj[i].aid != "undefined") {
                        this.attachment_ids.push(respObj[i].aid);
                        this.upLoadC = this.upLoadC - 1;
                    }
                }

                if(this.attachment_ids.length > 0 && this.upLoadC == 0) {
                    var attachment_list = this.attachment_ids.join(",");
                    this.attachment_ids = [];
					var viewType = appCtxt.getCurrentViewType();
                    if (viewType == ZmId.VIEW_COMPOSE) {
                        controller.saveDraft(ZmComposeController.DRAFT_TYPE_MANUAL, attachment_list);
                    }
                }
            }
        }
    }
    
};

function convertToEntities(astr){
	var bstr = '', cstr, i = 0;
	for(i; i < astr.length; ++i){
		if(astr.charCodeAt(i) > 127){
			cstr = astr.charCodeAt(i).toString(10);
			while(cstr.length < 4){
				cstr = '0' + cstr;
			}
			bstr += '&#' + cstr + ';';
		} else {
			bstr += astr.charAt(i);
		}
	}
	return bstr;
}