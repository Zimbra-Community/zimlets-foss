/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2007, 2010, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2007, 2010, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Constructor.
 *
 */
function Com_Zimbra_YCurrency_HandlerObject() {
}
;

Com_Zimbra_YCurrency_HandlerObject.prototype = new ZmZimletBase();
Com_Zimbra_YCurrency_HandlerObject.prototype.constructor = Com_Zimbra_YCurrency_HandlerObject;

/**
 * Simplify handler object
 *
 */
var YCurrencyZimlet = Com_Zimbra_YCurrency_HandlerObject;

/**
 * Defines the "home currency" user property.
 */
YCurrencyZimlet.USER_PROP_HOME_CURRENCY = "home_currency";
/**
 * Defines the "tooltip currencies" user property.
 */
YCurrencyZimlet.USER_PROP_TOOLTIP_CURRENCIES = "tooltip_currs";
/**
 * Defines the "chart type" user property.
 */
YCurrencyZimlet.USER_PROP_CHART_TYPE = "chart_type";

/**
 * Defines the "preferences" menu item.
 */
YCurrencyZimlet.MENU_ITEM_ID_PREFERENCES = "SETTINGS";
/**
 * Defines the "convert" menu item.
 */
YCurrencyZimlet.MENU_ITEM_ID_CONVERT = "CONVERT";
/**
 * Defines the "goto Y! Finance" menu item.
 */
YCurrencyZimlet.MENU_ITEM_ID_GOTO_YAHOO_FINANCE = "GOTOYF";

/**
 * Defines the "chart type h2o" item.
 */
YCurrencyZimlet.USER_PROP_ENUM_ITEM_H2O = "H_2_O";
/**
 * Defines the "chart type o2h" item.
 */
YCurrencyZimlet.USER_PROP_ENUM_ITEM_O2H = "O_2_H";

/**
 * Initializes the zimlet.
 */
YCurrencyZimlet.prototype.init =
function() {
	this.currencies = new YCurrencies();
	this.URL = "http://finance.yahoo.com/d/quotes.html";
	this.chartURL = "http://ichart.finance.yahoo.com/t";
	this.yfnURL = "http://finance.yahoo.com";
	this.footerHtml = ["<hr/><div><b><i>", this.getMessage("YCurrencyZimlet_poweredByYahoo"),"</i></b></div>"].join("");
	var myCurr = I18nMsg["currencyCode"];
	this.setUserProperty(YCurrencyZimlet.USER_PROP_HOME_CURRENCY, myCurr ? myCurr : "USD");
	this.__prev_conv_string = "1 " + this.getUserProperty(YCurrencyZimlet.USER_PROP_HOME_CURRENCY) + " = ?";
	this.setUserProperty(YCurrencyZimlet.USER_PROP_TOOLTIP_CURRENCIES, this.currencies.getAllCurrencies().join(";"));
};

/**
 * Gets the regular expressions.
 *
 * @return	{RegExp}	the regular expression
 */
YCurrencyZimlet.prototype._getRegex = function() {
	//if(!this.regx) {
	var s = "(\\d+(,\\d+)*[.]?\\d*)\\s*";
	s += "(" + this.currencies.getAllCurrencies().join("|") + "|[A-Z]{3})";
	s += "\\s*(=\\s*\\?\\s*(";
	s += "(" + this.currencies.getAllCurrencies().join("|") + "|[A-Z]{3})" + "\\s*([,;]\\s*";
	s += "(" + this.currencies.getAllCurrencies().join("|") + "|[A-Z]{3})" + ")*)*)*";
	this.regx = new RegExp(s, "g");
	//}
	return this.regx;
};

/**
 * Gets all the currencies that needs to be converted and displayed in tooltip
 *
 * @return {array} an array of {string} currencies
 */
YCurrencyZimlet.prototype.getTooltipCurrencies =
function() {
	var toCurrencies = this.currencies.getAllCurrencies();
	try {
		toCurrencies = this.getUserProperty(YCurrencyZimlet.USER_PROP_TOOLTIP_CURRENCIES).split(/[;,]/);
	} catch(ex) {
		toCurrencies = this.currencies.getAllCurrencies();
	}
	return toCurrencies;
};

/**
 * Gets regular expressions to match.
 * 
 */
YCurrencyZimlet.prototype._getMatchRegex = function() {
	//if(!this.matchReg) {
	var s = "(" + this.currencies.getAllSymbols().join("|").replace(/(\$|\.)/g, "\\$1") + ")\\s*";
	s += "(\\d+(,\\d+)*[.]?\\d*)";
	this.matchReg = new RegExp(s, "g");
	//}
	return this.matchReg;
};


/**
 * Called by Zimbra framework to see if a line of text matches anything
 *
 * @see		ZmZimletBase
 */
YCurrencyZimlet.prototype.match =
function(line, startIndex) {
	this.RE = this._getMatchRegex();//this._getRegex();
	return ZmZimletBase.prototype.match.call(this, line, startIndex);
};

/**
 * Gets the Quote url.
 * 
 * @param {string} fromCurr		the "from" currency
 * @param {string} toCurrencies the "to" currency
 * @return	{string}	the url
 */
YCurrencyZimlet.prototype._getQuoteURL =
function(fromCurr, toCurrencies) {
	var s = this.URL + "?f=l1&s=";              // Get last traded price only
	for (var i = 0; i < toCurrencies.length; i++) {
		s += fromCurr + toCurrencies[i] + "=X+";
	}
	return ZmZimletBase.PROXY + AjxStringUtil.urlComponentEncode(s);
};

/**
 * Called by Zimlet Framework.
 *
 * @see		ZmZimletBase
 */
YCurrencyZimlet.prototype.clicked =
function(spanElement, contentObjText, matchContext, canvas) {
	var s = this.yfnURL + "/currency";//
	var curr = this.currencies.getCurrency(matchContext[1]); //matchContext[3];
	var amt = matchContext[2]; //matchContext[1]

	if (curr != this.getUserProperty(YCurrencyZimlet.USER_PROP_HOME_CURRENCY)) {
		s += "/convert?amt=" + amt + "&from=" + curr + "&to=" + this.getUserProperty(YCurrencyZimlet.USER_PROP_HOME_CURRENCY) + "&submit=Convert";
	}
	window.open(s);
};

/**
 * Called by the framework to get the html for tooltip.
 *
 * @see		ZmZimletBase
 */
YCurrencyZimlet.prototype._getHtmlContent =
function(html, idx, obj, context) {
	html[idx++] = [
		'<a class="',
		"Object",
		'">',
		AjxStringUtil.htmlEncode(obj),
		'</a>'
	].join("");
	return idx;
};

/**
 * Gets the tool tip height.
 *
 * @return	{number}	the tool tip height
 */
YCurrencyZimlet.prototype._getToolTipHeight =
function() {
	var m = this.getTooltipCurrencies().length < 4 ? 4 : this.getTooltipCurrencies().length;
	return (40 + 40 + (m * 18));
}

/**
 * Called when the tool tip is popped-up.
 *
 * @see		ZmZimletBase
 */
YCurrencyZimlet.prototype.toolTipPoppedUp =
function(spanElement, contentObjText, matchContext, canvas) {
	canvas.innerHTML = ["<div style='width:250px;height:", this._getToolTipHeight() + "px;vertical-align:middle'><center>",
		this.getMessage("YCurrencyZimlet_requestingY"), "</center></div>"].join("");
	var callback = new AjxCallback(this, this._toolTipPoppedCallback, [ canvas, matchContext ]);
	this._makeCall(contentObjText, matchContext, callback);

};

/**
 * Handles Currency conversion results from Y! Finance.
 * 
 * @param {object} canvas		the main tooltip canvas
 * @param  {array} matchContext	the array containing results of match
 * @param {object} result 		the response from Y! currency conversion service
 */
YCurrencyZimlet.prototype._toolTipPoppedCallback =
function(canvas, matchContext, result) {
	//result.success = true; result.text='1\r\n1\r\n1\r\n1\r\n1\r\n';// hack
	if (result && result.success) {
		var reqCurrency = this.currencies.getCurrency(matchContext[1]); //matchContext[3];
		var reqAmount = matchContext[2].replace(/,/g, ""); //matchContext[1]
		var rates = ((result.text + "").split(/\r\n/));
		var htmlData = ["<table style='width:250px;' cellspacing='2' cellspadding='1'><tr><th align='left' colspan='3'>",
			matchContext[0]," [",reqCurrency,"] ",this.getMessage("YCurrencyZimlet_equals")," <hr/></th></tr>"].join("");
		for (var i = 0; i < rates.length; i++) {
			var rate = rates[i];
			if (!rate || rate == undefined ||
				rate == null || rate == "" ||
				rate.trim() == "") {
				continue;
			}
			var toCurrencies = this.getTooltipCurrencies();
			var cur = toCurrencies[i];//this.currencies.symbols[i].currency;
			if (cur == reqCurrency) continue;
			var val = (rate * reqAmount).toFixed(4);
			var extra = "";
			if (cur == this.getUserProperty(YCurrencyZimlet.USER_PROP_HOME_CURRENCY)) {
				extra = "style='font-weight:bold;'";
			}
			htmlData += "<tr><th align='right'>" + val + "</th><td align='right' " + extra + ">" + cur + " @</td><td " + extra + " align='right'>" + rate + "</td></tr>";//+D+ " "+cur+"</b></div>";
		}
		htmlData += "</table>";//
		if (reqCurrency != this.getUserProperty(YCurrencyZimlet.USER_PROP_HOME_CURRENCY)) {
			this.hasChart = true;
			var homeCur = this.getUserProperty(YCurrencyZimlet.USER_PROP_HOME_CURRENCY);
			var ch_arg = (this.getUserProperty(YCurrencyZimlet.USER_PROP_CHART_TYPE) == YCurrencyZimlet.USER_PROP_ENUM_ITEM_O2H) ? reqCurrency + homeCur : homeCur + reqCurrency;
			htmlData = "<table style='width:250px;'><tr><td>" + htmlData + "</td><td valign='bottom'>";
			htmlData += "<img style='spacing:1px;border:1px inset gray;' src='" + this.chartURL + "?s=" + ch_arg + "=X&f=w4'/></td></tr></table>";
		} else {
			this.hasChart = false; //To be used to adjust tooltip width
		}
		canvas.innerHTML = "<div style='height:" + this._getToolTipHeight() + "px; width:" + (this.hasChart ? "450px" : "250px;") + ";'>" + htmlData + this.footerHtml + "</div>";//"<hr/><div><b><i>Powered by yahoo finance.</i></b></div>";
	} else {
		canvas.innerHTML = "<div style='color:red; vertical-align:middle;height:" + this._getToolTipHeight() + "px; width:" + (this.hasChart ? "500px" : "250px;") + ";'><center> ",this.getMessage("YCurrencyZimlet_errorInRate"),"</center></div>";// + result;
	}
};

/**
 * Creates a Currency converter dialog
 *
 * @param {string} preVal		a string representing a pre-selected currency like 10 USD
 * @param {boolean} showWait		if <code>true</code>, shows 'Wait..' status
 */
YCurrencyZimlet.prototype._showCurrencyConverterDialog =
function(preVal, showWait) {
	var view = new DwtComposite(this.getShell());
	view.setSize("350", "200");

	var container = document.createElement("DIV");
	this.aId = Dwt.getNextId();
	this.rId = Dwt.getNextId();
	preVal = (!preVal || preVal == null || preVal == undefined ) ? this.__prev_conv_string : preVal;
	container.innerHTML = ["<table width=100% cellspacing=4 cellpadding=0 border=0>",
		"<tr><td>",this.getMessage("YCurrencyZimlet_example1"),"</td></tr>",
		"<tr><td>","<input id='",this.aId,"' type='text' size=52 value='" + preVal + "'>","</td></tr>",
		"<tr><td>","<div style='border:1px solid silver;overflow-y:scroll;" + (AjxEnv.isIE ? "height:150px;" : "max-height:150px;") + "' id='",this.rId,"'>",
		this.getMessage("YCurrencyZimlet_example2"),"<br/>",this.getMessage("YCurrencyZimlet_example3"),"<br/>",
		"</div></td></tr>","<tr><td>",this.footerHtml,"</td></tr>","</table>"
	].join("");

	var element = view.getHtmlElement();
	element.appendChild(container);

	var dialogTitle = this.getMessage("YCurrencyZimlet_dialog_currencyconverter_title");
	var dialogArgs = {
		title : dialogTitle,
		parent : this.getShell(),
		view  : view
	};
	var dlg = new ZmDialog(dialogArgs);

	dlg.setButtonListener(
			DwtDialog.CANCEL_BUTTON,
			new AjxListener(this, function() {
				dlg.popdown();
				dlg.dispose();
			}));

	dlg.setButtonListener(
			DwtDialog.OK_BUTTON,
			new AjxListener(this, function() {
				var reqString = document.getElementById(this.aId).value;
				if (!reqString) {
					document.getElementById(this.rId).innerHTML = this.getMessage("YCurrencyZimlet_enterValidFormat");
				} else {
					document.getElementById(this.rId).innerHTML = this.getMessage("YCurrencyZimlet_requestingY");
					var _m_context = this._getMatch(reqString);
					if (_m_context == undefined || !_m_context || _m_context == null) {
						document.getElementById(this.rId).innerHTML = this.getMessage("YCurrencyZimlet_enterValidFormat");
					} else {
						this._convert(reqString, _m_context);
						this.__prev_conv_string = reqString;
					}
				}

			}));
	dlg.popup();
	if (showWait) {
		document.getElementById(this.rId).innerHTML = this.getMessage("YCurrencyZimlet_pleaseWait");
	}
};
/**
 * Matches a given string against regex and returns the result
 *
 * @param {string} reqString  A string that needs to be matched against regEX
 */
YCurrencyZimlet.prototype._getMatch = function(reqString) {
	var regex = this._getRegex();
	return regex.exec(reqString);
};
/**
 * Converts the currency and displays the result
 *
 * @param  {array} matchContext the array containing results of match
 * @param {object} result		the response from Y! currency conversion service
 */
YCurrencyZimlet.prototype._handleConvert = function(matchContext, result) {
	if (result && result.success) {
		var reqCurrency = matchContext[3].trim();//.split(",");
		var reqAmount = matchContext[1].replace(/,/g, "").trim();
		var rates = ((result.text + "").split(/\r\n/));
		var toCurrencies = [];
		if (matchContext[5]) {
			toCurrencies = matchContext[5].split(/\s*[,;]\s*/);
		} else {
			toCurrencies = this.currencies.getAllCurrencies();
		}
		var ihtml = "<table>";
		for (var i = 0; i < toCurrencies.length; i++) {
			if (toCurrencies[i].trim() == reqCurrency) continue; // if req is same as to curr, skip the result
			var value = (reqAmount * rates[i]).toFixed(4);
			ihtml += "<tr><td>" + reqAmount + " " + reqCurrency + " = </td><td align='right'><b>" + value + " " + toCurrencies[i].trim() + "</b> @ </td><td align='right'>" + rates[i] + "</td></tr>";// + "<hr/>";
		}
		ihtml += "</table>";
		document.getElementById(this.rId).innerHTML = ihtml;//"<hr/><div><b><i>Powered by yahoo finance.</i></b></div>";
	} else {
		document.getElementById(this.rId).innerHTML = ["<div style='width:200px;color:red;'>",this.getMessage("YCurrencyZimlet_errorInRate"),"</div>"].join("");
	}
};
/**
 * Invokes AJAX call
 *
 * @param {string} reqString	the currency string that was matched
 * @param {array} context		an Array containing results of the match
 * @param {AjxCallback} callback	a callback function
 * @param {object} srcCurr		the "from" currency
 */
YCurrencyZimlet.prototype._makeCall =
function(reqString, context, callback, srcCurr) {
	var toCurrencies = [];
	//var fromCurrency = context[3];
	if (context[5]) {
		toCurrencies = context[5].split(/\s*[,;]\s*/);
	} else {
		toCurrencies = this.getTooltipCurrencies();
	}
	if (srcCurr) {
		fromCurrency = srcCurr;
	} else {
		fromCurrency = this.currencies.getCurrency(context[1]);
	}
	var url = this._getQuoteURL(fromCurrency, toCurrencies);
	AjxRpc.invoke(null, url, null, callback, true);
};

/**
 * Converts Currency
 *
 * @param {string} reqString	a currency to convert "to"
 * @param {Array} context		an array containing the result of Regex match
 */
YCurrencyZimlet.prototype._convert =
function(reqString, context) {
	var callback = new AjxCallback(this, this._handleConvert, [ context ]);
	this._makeCall(reqString, context, callback, context[3]);
};

/**
 * Called when Framesowk when Zimlet menu item is selected.
 *
 * @see	ZmZimletBase
 */
YCurrencyZimlet.prototype.menuItemSelected =
function(itemId, label, spanElement, contentObjText, canvas) {
	switch (itemId) {
		case YCurrencyZimlet.MENU_ITEM_ID_PREFERENCES:
			this.createPropertyEditor();
			break;
		case YCurrencyZimlet.MENU_ITEM_ID_CONVERT:
			var q = this._actionObject;
			if (q) {
				_sym = q.replace(/(\d+(,\d+)*[.]?\d*)/ig, "");
				if (_sym) {
					_sym = _sym.trim();
					_amt = q.replace(_sym, "").trim();
					_cc = this.currencies.getCurrency(_sym);
					q = _amt + " " + _cc + " = ?";
				}
			}
			this._showCurrencyConverterDialog(q);
			break;
		case YCurrencyZimlet.MENU_ITEM_ID_GOTO_YAHOO_FINANCE:
			window.open(this.yfnURL);
			break;
	}
};

/**
 * This method is called when the panel item is double-clicked.
 *
 */
YCurrencyZimlet.prototype.doubleClicked = function() {
	this.singleClicked();
};

/**
 * This method is called when the panel item is single-clicked.
 *
 */
YCurrencyZimlet.prototype.singleClicked = function() {
	this._showCurrencyConverterDialog();
};

/**
 * Trims the string.
 * 
 */
String.prototype.trim = function() {
	var a = this.replace(/^\s+/, '');
	return a.replace(/\s+$/, '');
};

/**
 * @class
 * This class represents Currencies.
 * 
 */
YCurrencies = function() {
	this.symbols = [
		{currency:"USD", syms: ["$","Dollar","US$","USD"]},
		{currency:"EUR", syms: ["€","Euro","euro","EUR"]},
		{currency:"GBP", syms: ["£","Pound","pound","GBP"]},
		{currency:"JPY", syms: ["¥","Yen","yen","JPY"]},
		{currency:"INR", syms: ["Rs","Rp","Rs.","Rupee","INR"]},
		{currency:"AUD", syms: ["AU$","AUD"]},
		{currency:"CAD", syms: ["Can$","CAN$","CAD"]},
		{currency:"CHF", syms: ["SFr.","Fr.","Swiss franc","Swiss Franc","CHF"]}

	];

	this.length = this.symbols.length;
};

/**
 * Gets symbols for a given currency.
 * 
 * @param {string} curr		a String representing currencies
 * @return {array} an Array of symbols representing currencies
 */
YCurrencies.prototype.getSymbols = function(curr) {
	for (i = 0; i < this.symbols.length; i++) {
		if (this.symbols[i].currency == curr) {
			return this.symbols[i].syms;
		}
	}
	return [];
};

/**
 * Gets the Currency for a given Symbol.
 * 
 * @param {string} symbol	a string representing a Symbol
 * @return	{string}	the currency or <code>null</code> if not found
 */
YCurrencies.prototype.getCurrency = function(symbol) {
	for (i = 0; i < this.symbols.length; i++) {
		var syms = this.symbols[i].syms;
		var s = "," + syms.join(",") + ",";
		if (s.indexOf("," + symbol + ",") >= 0) {
			return this.symbols[i].currency;
		}
	}
	return null;
};

/**
 * Gets all Currencies
 *
 * @return {array} an array of currencies
 */
YCurrencies.prototype.getAllCurrencies = function() {
	var currs = [];
	for (var i = 0; i < this.symbols.length; i++) {
		currs.push(this.symbols[i].currency);
	}
	return currs;
};

/**
 * Gets all Symbols.
 *
 * @return {array} an array of all symbols
 */
YCurrencies.prototype.getAllSymbols = function() {
	var symbs = [];
	for (var i = 0; i < this.symbols.length; i++) {
		var syms = this.symbols[i].syms;
		for (j = 0; j < syms.length; j++) {
			symbs.push(syms[j]);
		}
	}
	return symbs;
};