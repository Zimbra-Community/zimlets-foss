<!--
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2008, 2009, 2010, 2013, 2014, 2016 Synacor, Inc.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software Foundation,
 * version 2 of the License.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 * ***** END LICENSE BLOCK *****
-->
<%@ page language="java" import="java.util.*, java.io.*, java.net.*" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%
	request.setCharacterEncoding("UTF-8");
	String text = request.getParameter("text");
	String lang = request.getParameter("lang");
	String userAgent = request.getParameter("userAgent");

    URL url = new URL("http://babelfish.yahoo.com/translate_txt");
    URLConnection urlConnection = url.openConnection();
    urlConnection.setDoInput(true);
    urlConnection.setDoOutput(true);
    urlConnection.setUseCaches(false);
    urlConnection.setRequestProperty("Host", "babelfish.yahoo.com");
    urlConnection.setRequestProperty("Accept-Charset", "utf-8");
	urlConnection.setRequestProperty("User-Agent", userAgent);
	urlConnection.setRequestProperty("Referer", "http://babelfish.yahoo.com/translate_txt");

    DataOutputStream outStream = new DataOutputStream(urlConnection.getOutputStream());
    String content = "ei=UTF-8&doit=done&fr=bf-res&intl=1&tt=urltext&trtext=" +
		URLEncoder.encode(text, "UTF-8") + "&lp=" + lang + "&btnTrTxt=Translate";
    outStream.writeBytes(content);
    outStream.flush();
    outStream.close();

    DataInputStream inStream = new DataInputStream(urlConnection.getInputStream());
    String str;
    while ((str = inStream.readLine()) != null)
    {
    	out.println(new String(str.getBytes("ISO-8859-1"),"UTF-8"));
    }
    inStream.close();
%>
