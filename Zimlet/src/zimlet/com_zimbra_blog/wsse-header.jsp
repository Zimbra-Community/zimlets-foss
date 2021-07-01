/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2007, 2009, 2010, 2013, 2014, 2016 Synacor, Inc.
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
 */
<%@page import="java.net.*"%><%@page import="java.util.Date"%><%@page import="java.text.SimpleDateFormat"%><%@page import="java.security.MessageDigest"%><%
String username = request.getParameter("username");
String password = request.getParameter("password");
if(username!=null && password!=null){
String result = generateWSSEHeader(username,password);
out.println(result);
}
%><%!
public static String generateWSSEHeader(String username, String passwd)
     throws Exception {

   byte[] nonceB = generateNonce();
   String nonce = base64Encode(nonceB);

   String created = generateTimestamp();

   String passwd64 = generateBase64Digest(nonceB, created.getBytes("UTF-8"),passwd.getBytes("UTF-8"));

	/*
   StringBuffer hdr = new StringBuffer("UsernameToken Username=\"");
   hdr.append(username);
   hdr.append("\", ");
   hdr.append("PasswordDigest=\"");
   hdr.append(passwd64);
   hdr.append("\", ");
   hdr.append("Nonce=\"");
   hdr.append(nonce);
   hdr.append("\", ");
   hdr.append("Created=\"");
   hdr.append(created);
   hdr.append("\"");
	*/

   StringBuffer hdr = new StringBuffer("UsernameToken Username=");
   hdr.append(username);
   hdr.append(", ");
   hdr.append("PasswordDigest=");
   hdr.append(passwd64);
   hdr.append(", ");
   hdr.append("Nonce=");
   hdr.append(nonce);
   hdr.append(", ");
   hdr.append("Created=");
   hdr.append(created);
   hdr.append("");

   return hdr.toString();
 }



public static byte[] generateNonce() {
     String nonce = Long.toString(new Date().getTime());
     return nonce.getBytes();
 }

 public static String generateTimestamp() {
   SimpleDateFormat dateFormatter = new SimpleDateFormat(
       "yyyy-MM-dd'T'HH:mm:ss'Z'");
   return dateFormatter.format(new Date());
 }

 public static synchronized String generateBase64Digest(byte[] nonce,
     byte[] created, byte[] password) {
   try {
     MessageDigest messageDigester = MessageDigest.getInstance("SHA-1");
     messageDigester.reset();
     messageDigester.update(nonce);
     messageDigester.update(created);
     messageDigester.update(password);
     return base64Encode(messageDigester.digest());
   } catch (java.security.NoSuchAlgorithmException e) {
     throw new RuntimeException(e);
   }
 }

 public static synchronized String generateBase64Digest(byte[] password) {
   try {
     MessageDigest messageDigester = MessageDigest.getInstance("SHA-1");
     messageDigester.reset();
     messageDigester.update(password);
     return base64Encode(messageDigester.digest());
   } catch (java.security.NoSuchAlgorithmException e) {
     throw new RuntimeException(e);
   }
 }

 public static String base64Encode(byte[] bytes) {
	return new sun.misc.BASE64Encoder().encode(bytes);
//	return (new Base64Encoder(new String(bytes))).processString();
 }

%>