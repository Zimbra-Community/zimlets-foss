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
window.jsonParse=function(){var r="(?:-?\\b(?:0|[1-9][0-9]*)(?:\\.[0-9]+)?(?:[eE][+-]?[0-9]+)?\\b)",k='(?:[^\\0-\\x08\\x0a-\\x1f"\\\\]|\\\\(?:["/\\\\bfnrt]|u[0-9A-Fa-f]{4}))';k='(?:"'+k+'*")';var s=new RegExp("(?:false|true|null|[\\{\\}\\[\\]]|"+r+"|"+k+")","g"),t=new RegExp("\\\\(?:([^u])|u(.{4}))","g"),u={'"':'"',"/":"/","\\":"\\",b:"\u0008",f:"\u000c",n:"\n",r:"\r",t:"\t"};function v(h,j,e){return j?u[j]:String.fromCharCode(parseInt(e,16))}var w=new String(""),x=Object.hasOwnProperty;return function(h,
j){h=h.match(s);var e,c=h[0],l=false;if("{"===c)e={};else if("["===c)e=[];else{e=[];l=true}for(var b,d=[e],m=1-l,y=h.length;m<y;++m){c=h[m];var a;switch(c.charCodeAt(0)){default:a=d[0];a[b||a.length]=+c;b=void 0;break;case 34:c=c.substring(1,c.length-1);if(c.indexOf("\\")!==-1)c=c.replace(t,v);a=d[0];if(!b)if(a instanceof Array)b=a.length;else{b=c||w;break}a[b]=c;b=void 0;break;case 91:a=d[0];d.unshift(a[b||a.length]=[]);b=void 0;break;case 93:d.shift();break;case 102:a=d[0];a[b||a.length]=false;
b=void 0;break;case 110:a=d[0];a[b||a.length]=null;b=void 0;break;case 116:a=d[0];a[b||a.length]=true;b=void 0;break;case 123:a=d[0];d.unshift(a[b||a.length]={});b=void 0;break;case 125:d.shift();break}}if(l){if(d.length!==1)throw new Error;e=e[0]}else if(d.length)throw new Error;if(j){var p=function(n,o){var f=n[o];if(f&&typeof f==="object"){var i=null;for(var g in f)if(x.call(f,g)&&f!==n){var q=p(f,g);if(q!==void 0)f[g]=q;else{i||(i=[]);i.push(g)}}if(i)for(g=i.length;--g>=0;)delete f[i[g]]}return j.call(n,
o,f)};e=p({"":e},"")}return e}}();
