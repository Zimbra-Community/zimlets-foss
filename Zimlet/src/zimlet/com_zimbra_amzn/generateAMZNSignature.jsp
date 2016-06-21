<%--
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2010, 2013, 2014 Zimbra, Inc.
 * 
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software Foundation,
 * version 2 of the License.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <http://www.gnu.org/licenses/>.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Copyright (C) Amazon (Original Java Format)
 *
 * Author: Raja Rao DV (rrao@zimbra.com) Converted to JSP
 */
--%>

<%@ page language="java" import="java.io.UnsupportedEncodingException"%>

<%@ page language="java" import="java.net.URLDecoder"%>
<%@ page language="java" import="java.net.URLEncoder"%>

<%@ page language="java" import="java.security.InvalidKeyException"%>
<%@ page language="java" import="java.security.NoSuchAlgorithmException"%>

<%@ page language="java" import="java.text.DateFormat"%>
<%@ page language="java" import="java.text.SimpleDateFormat"%>

<%@ page language="java" import="java.util.Calendar"%>

<%@ page language="java" import="java.util.HashMap"%>
<%@ page language="java" import="java.util.Iterator"%>
<%@ page language="java" import="java.util.Map"%>
<%@ page language="java" import="java.util.SortedMap"%>
<%@ page language="java" import="java.util.TimeZone"%>
<%@ page language="java" import="java.util.TreeMap"%>

<%@ page language="java" import="javax.crypto.Mac"%>
<%@ page language="java" import="javax.crypto.spec.SecretKeySpec"%>

<%@ page language="java" import="org.apache.commons.codec.binary.Base64"%>

<%@ page language="java" import="java.io.UnsupportedEncodingException"%>

<%@ page language="java" import="java.net.URLDecoder"%>
<%@ page language="java" import="java.net.URLEncoder"%>

<%@ page language="java" import="java.security.InvalidKeyException"%>
<%@ page language="java" import="java.security.NoSuchAlgorithmException"%>

<%@ page language="java" import="java.text.DateFormat"%>
<%@ page language="java" import="java.text.SimpleDateFormat"%>

<%@ page language="java" import="java.util.Calendar"%>
<%@ page language="java" import="java.util.HashMap"%>
<%@ page language="java" import="java.util.Iterator"%>
<%@ page language="java" import="java.util.Map"%>
<%@ page language="java" import="java.util.SortedMap"%>
<%@ page language="java" import="java.util.TimeZone"%>
<%@ page language="java" import="java.util.TreeMap"%>

<%@ page language="java" import="javax.crypto.Mac"%>
<%@ page language="java" import="javax.crypto.spec.SecretKeySpec"%>

<%@ page language="java" import="sun.misc.BASE64Encoder"%>

<%!String awsAccessKeyId = "AKIAJMLVLU3IPT6AP7SQ";%>
<%!String awsSecretKey = "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";%>
<%!String endpoint = "webservices.amazon.com";%>
<%!String UTF8_CHARSET = "UTF-8";%>
<%!String HMAC_SHA256_ALGORITHM = "HmacSHA256";%>
<%!String REQUEST_URI = "/onca/xml";%>
<%!String REQUEST_METHOD = "GET";%>
<%!Mac mac = null;%>


<%
	SecretKeySpec secretKeySpec = null;
	Mac mac = null;
	String keywords = request.getParameter("Keywords");
	Map<String, String> map = new HashMap<String, String>();
	map.put("Service", "AWSECommerceService");
	map.put("Operation", "ItemSearch");
	map.put("SearchIndex", "Books");
	map.put("ResponseGroup", "Medium");
	map.put("Keywords", keywords);

	//map.put("ItemId", "0679722769");

	//map.put("Operation", "ItemLookup");
	//map.put("ItemId", "0679722769");
	//map.put("ResponseGroup", "ItemAttributes,Offers,Images,Reviews");
	//map.put("Version", "2009-01-06");
	byte[] secretyKeyBytes = null;
	try {
		secretyKeyBytes = awsSecretKey.getBytes(UTF8_CHARSET);
	} catch (UnsupportedEncodingException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	secretKeySpec = new SecretKeySpec(secretyKeyBytes,
			HMAC_SHA256_ALGORITHM);
	String resp = "";
	try {
		mac = Mac.getInstance(HMAC_SHA256_ALGORITHM);
		mac.init(secretKeySpec);
	 	resp = sign(map, mac);

	} catch (NoSuchAlgorithmException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}catch (InvalidKeyException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
%>

<%=resp%>


<%!public String sign(Map<String, String> params, Mac mac) {
		params.put("AWSAccessKeyId", awsAccessKeyId);
		params.put("Timestamp", timestamp());
		SortedMap<String, String> sortedParamMap = new TreeMap<String, String>(
				params);
		String canonicalQS = canonicalize(sortedParamMap);
		String toSign = REQUEST_METHOD + "\n" + endpoint + "\n" + REQUEST_URI
				+ "\n" + canonicalQS;

		String hmac = hmac(toSign, mac);
		String sig = percentEncodeRfc3986(hmac);
		String url = "http://" + endpoint + REQUEST_URI + "?" + canonicalQS
				+ "&Signature=" + sig;

		return url;
		//return sig;
	}%>

<%!private String hmac(String stringToSign, Mac mac) {
		String signature = null;
		byte[] data;
		byte[] rawHmac;
		try {
			data = stringToSign.getBytes(UTF8_CHARSET);
			rawHmac = mac.doFinal(data);
			BASE64Encoder encoder = new BASE64Encoder();
			signature = new String(encoder.encode(rawHmac));
		} catch (UnsupportedEncodingException e) {
			throw new RuntimeException(UTF8_CHARSET + " is unsupported!", e);
		} catch(Exception e) {
			throw new RuntimeException(UTF8_CHARSET + " is unsupported!", e);
	
		}
		return signature;
	}%>

<%!private String timestamp() {
		String timestamp = null;
		Calendar cal = Calendar.getInstance();
		DateFormat dfm = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
		dfm.setTimeZone(TimeZone.getTimeZone("GMT"));
		timestamp = dfm.format(cal.getTime());
		return timestamp;
	}%>

<%!private String canonicalize(SortedMap<String, String> sortedParamMap) {
		if (sortedParamMap.isEmpty()) {
			return "";
		}

		StringBuffer buffer = new StringBuffer();
		Iterator<Map.Entry<String, String>> iter = sortedParamMap.entrySet()
				.iterator();

		while (iter.hasNext()) {
			Map.Entry<String, String> kvpair = iter.next();
			buffer.append(percentEncodeRfc3986(kvpair.getKey()));
			buffer.append("=");
			buffer.append(percentEncodeRfc3986(kvpair.getValue()));
			if (iter.hasNext()) {
				buffer.append("&");
			}
		}
		String cannoical = buffer.toString();
		return cannoical;
	}%>

<%!private String percentEncodeRfc3986(String s) {
		String out;
		try {
			out = URLEncoder.encode(s, UTF8_CHARSET).replace("+", "%20")
					.replace("*", "%2A").replace("%7E", "~");
		} catch (UnsupportedEncodingException e) {
			out = s;
		}
		return out;
	}%>