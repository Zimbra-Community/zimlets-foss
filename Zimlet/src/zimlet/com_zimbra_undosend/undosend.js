/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2010, 2011, 2013, 2014 Zimbra, Inc.
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
 * All portions of the code are Copyright (C) 2010, 2011, 2013, 2014 Zimbra, Inc. All Rights Reserved. 
 * ***** END LICENSE BLOCK *****
 */

/**
 * @author Raja Rao DV (rrao@zimbra.com)
 *
 * Provides the option to cancel or undo mail send for a configurable amount of time. Only one
 * compose message can be active at a time.
 */

function com_zimbra_undosend_HandlerObject() {

    this._undoLinkId = 'UndoSendZimlet_undo';
    this._sendNowLinkId = 'UndoSendZimlet_sendNow';
    this._timerId = 'UndoSendZimlet_timer';
    this._linkClicked = false;
}

com_zimbra_undosend_HandlerObject.prototype = new ZmZimletBase();
com_zimbra_undosend_HandlerObject.prototype.constructor = com_zimbra_undosend_HandlerObject;


/**
 * Simplify handler object
 *
 */
var UndoSendZimlet = com_zimbra_undosend_HandlerObject;

UndoSendZimlet.prototype.init = function() {

	this._initialDelay = parseInt(this.getUserProperty("undoSend_howMuchDelay"));

    // ZmComposeController was changed in 8.7 to notify this zimlet on send initiated via Ctrl+Enter. If this zimlet
    // is running within an earlier version of ZCS, use the keyboard mgr keydown listener to handle the shortcut here.
    var version = parseFloat(ZmCsfeCommand.clientVersion);
    if (true || version && version < 8.7) {
        appCtxt.getKeyboardMgr().addListener(DwtEvent.ONKEYDOWN, this._keyDownListener.bind(this));
    }
};

/**
 * This listener is a workaround for pre-8.7 clients. Instead of relying on a zimlet notification from the compose
 * controller when Ctrl+Send is used to send a message, add a keydown listener to the keyboard manager and look for
 * the shortcut manually.
 *
 * @param {Event}       ev      browser keydown event
 * @returns {boolean}   false if the event has been handled
 * @private
 */
UndoSendZimlet.prototype._keyDownListener = function(ev) {

    var keyCode = DwtKeyEvent.getCharCode(ev),
        pref = appCtxt.get(ZmSetting.USE_SEND_MSG_SHORTCUT),
        curView = appCtxt.getCurrentViewType(),
        composeCtlr = appCtxt.getCurrentController();

    if (pref !== false && ev.ctrlKey && keyCode === 13 && curView === ZmId.VIEW_COMPOSE && composeCtlr && !composeCtlr._uploadingProgress) {
        this._sendButtonListener(appCtxt.getCurrentView().getController());
        return false;
    }
};

UndoSendZimlet.prototype.initializeToolbar = function(app, toolbar, controller, viewId) {
  if (viewId.indexOf("COMPOSE") >= 0) {
    var sendBtn = toolbar.getButton("SEND_MENU");
    if(!sendBtn) {
      sendBtn = toolbar.getButton("SEND");
    }
    if(!sendBtn) {
      return;
    }
    sendBtn.removeSelectionListeners(); //remove all selection listeners
    sendBtn.addSelectionListener(new AjxListener(this, this._sendButtonListener, controller));
  }
};

/**
 * Listens for user send.
 *
 * @param {ZmComposeController}     controller      compose controller
 */
UndoSendZimlet.prototype._sendButtonListener = function(controller) {

  this._counter = this._initialDelay;

  // See if another message is being handled; if so, bail.
  if (Dwt.getVisible(document.getElementById(this._mainContainerId))) {
    this.displayErrorMessage(this.getMessage("UndoSendZimlet_pleaseWait"));
    return true;
  }

  this._msg = controller._composeView.getMsg();
  if (!this._msg) { //there is some compose error..
    return;
  }

  this._controller = controller;

  if (this._counter === 0) {
    this._sendEmail();
    return;
  }

  var avm = appCtxt.getAppViewMgr();
  var viewId = this._composeViewId = avm.getCurrentViewId();

  controller.saveDraft(ZmComposeController.DRAFT_TYPE_AUTO);

  if (!this._mainContainerId) {
    this._createView();
  }

  if (!appCtxt.isChildWindow) {
    var avmHash = avm._isTabView ? avm._tabParams[viewId] : avm._view[viewId].tabParams,
      tabBtnId = avmHash && avmHash.id,
      tabButton = tabBtnId && appCtxt.getAppChooser().getButton(tabBtnId);
  }

  this._composeTabTitle = tabButton ? tabButton.getText() : ZmMsg.compose;
  this._linkClicked = false;

  // clear auto-save timer to ensure there are no leftover drafts
  if (controller._autoSaveTimer) {
    controller._autoSaveTimer.kill();
  }

  if (!appCtxt.isChildWindow) {
    avm.popView(true, viewId);
    controller.inactive = false; // IMPORTANT! make sure to set this so this view isnt reused
  }

  this._showView(true);

  return true;
};

UndoSendZimlet.prototype._createView = function() {

    // outer container
    var div = this.getShell().getHtmlElement().appendChild(document.createElement('div'));
    div.id = this._mainContainerId = "undoSendZimlet_mainContainer";
    div.style.left = appCtxt.isChildWindow ? '25%' : '40%';
    div.className = "undosend_container";
    Dwt.setPosition(div, Dwt.ABSOLUTE_STYLE);
    Dwt.setVisible(div, false);
    Dwt.setZIndex(div, Dwt.Z_TOAST);

    // span that shows countdown timer
    var timerHtml = [], j = 0;
    timerHtml[j++] = "<span class='timer' id='" + this._timerId + "'>";
    timerHtml[j++] = this._initialDelay;
    timerHtml[j++] = "</span>";

    // text around the timer
    var html = [], i = 0;
    html[i++] = "<label>";
    html[i++] = AjxMessageFormat.format(this.getMessage("UndoSendZimlet_mainMsg"), timerHtml.join(''));
    html[i++] = "</label>";

    // Undo and Send Now links
    var undoLinkHtml = " <a class='undoLink' href='javascript:void(0)' id='" + this._undoLinkId + "'>" + this.getMessage("UndoSendZimlet_Undo") + "</a> ";
    var sendNowLinkHtml = " <a class='sendNowLink' href='javascript:void(0)' id='" + this._sendNowLinkId + "'>" + this.getMessage("UndoSendZimlet_sendNow") + "</a> ";
    html[i++] = AjxMessageFormat.format(this.getMessage("UndoSendZimlet_links"), [ undoLinkHtml, sendNowLinkHtml ]);

    Dwt.setInnerHtml(div, html.join(''));

    // attach listeners to links
    var link = document.getElementById(this._undoLinkId);
    if (link) {
        link.onclick = this._undoSend.bind(this);
    }
    link = document.getElementById(this._sendNowLinkId);
    if (link) {
        link.onclick = this._sendNow.bind(this);
    }
};

// Shows or hides the toast-like popup that provides the cancel/send options and a countdown timer
UndoSendZimlet.prototype._showView = function(visible) {

    Dwt.setVisible(document.getElementById(this._mainContainerId), visible);
    if (visible) {
        this._timer = setInterval(this._updateCounter.bind(this), 1000);
    }
};

/**
 * Updates countdown's counter or sends email if counter is 0.
 */
UndoSendZimlet.prototype._updateCounter = function() {

    var count = this._counter;
	if (count === 0) {
		clearInterval(this._timer);
        if (!this._linkClicked) {
            this._sendEmail();
        }
	}
    else {
		var el = document.getElementById(this._timerId);
		if (el) {
			el.innerHTML = --count;
			this._counter = count;
		}
	}
};

/**
 * Aborts the send and returns the user to the compose view.
 */
UndoSendZimlet.prototype._undoSend = function() {

	this._controller._initAutoSave();
    this._linkClicked = true;
	clearInterval(this._timer);
	this._showView(false);
	if (!appCtxt.isChildWindow){
        var avm = appCtxt.getAppViewMgr();
        avm.pushView(this._composeViewId, true);
        avm.setTabTitle(this._composeViewId, this._composeTabTitle);
	}
};

/**
 * Sends the email when user clicks "Send Now" link.
 */
UndoSendZimlet.prototype._sendNow = function() {

	this._linkClicked = true;
    clearInterval(this._timer);
	this._sendEmail();
};

/**
 * Sends the message.
 */
UndoSendZimlet.prototype._sendEmail = function() {

	this._showView(false);
	this._controller._send();
};

/**
 * Tries to revert the view upon send failure.
 *
 * @param {ZmComposeController}     controller      compose controller
 * @param {object}                  ex              exception
 * @param {ZmMailMsg}               msg             mail message
 */
UndoSendZimlet.prototype.onSendMsgFailure = function(controller, ex, msg) {

	if (this._composeViewId === controller.getCurrentViewId()) {
		this._undoSend();
	}
};

/**
 * @see {ZmZimletBase}
 */
UndoSendZimlet.prototype.doubleClicked = function() {
	this.singleClicked();
};

/**
 * @see {ZmZimletBase}
 */
UndoSendZimlet.prototype.singleClicked = function() {
	this._displayPrefDialog();
};

/**
 * Displays Preferences dialog
 */
UndoSendZimlet.prototype._displayPrefDialog = function() {

	if (this.pbDialog) {
		this.pbDialog.popup();
		return;
	}

	var pv = this.pView = new DwtComposite(this.getShell());
    pv.setScrollStyle(Dwt.SCROLL);
	pv.setContent(this._createPreferenceView());
	var pd = this.pbDialog = new ZmDialog({
        parent:             this.getShell(),
        title:              this.getMessage("UndoSendZimlet_PrefLabel"),
        view:               pv,
        standardButtons:    [DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON]
    });
	pd.setButtonListener(DwtDialog.OK_BUTTON, this._okBtnListner.bind(this));
	pd.popup();
};

/**
 * Returns HTML for preferences view.
 *
 * @returns {string} HTML
 */
UndoSendZimlet.prototype._createPreferenceView = function() {

    var id = this._inputId = "undoSend_input",
        input = "<input type='text' size=2 id='" + id + "' value='" + this._initialDelay + "'>",
        content = "<div>" + AjxMessageFormat.format(this.getMessage("UndoSendZimlet_PrefDescription"), input) + "</div>";

    return content;
};

/**
 * Saves the initial value for the countdown timer.
 */
UndoSendZimlet.prototype._okBtnListner = function() {

	var val = this._initialDelay = document.getElementById(this._inputId).value;
    if (!val || !/^\d+$/.test(val)) {
        this.displayErrorMessage(this.getMessage("UndoSendZimlet_PrefInvalidValue"));
        return;
    }
	this.setUserProperty("undoSend_howMuchDelay", val, true);
	appCtxt.getAppController().setStatusMsg(ZmMsg.optionsSaved, ZmStatusView.LEVEL_INFO);
	this.pbDialog.popdown();
};
