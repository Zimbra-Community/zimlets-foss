<%--
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2007, 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc.
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
--%>
<%@ page buffer="8kb" autoFlush="true" %>
<%@ page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8" %>
<%@ page language="java" import="org.apache.commons.httpclient.*, org.apache.commons.httpclient.methods.*, javax.servlet.*, com.zimbra.common.util.*"%>
<%@ page language="java" import="java.net.*, java.util.*,com.zimbra.common.util.*, com.zimbra.cs.util.*, com.zimbra.cs.servlet.*"%>
<%@ page language="java" import="java.io.*, org.apache.commons.httpclient.methods.multipart.*"%>
<%@ page language="java" import="com.zimbra.cs.service.*" %>
<%@ page language="java" import="com.zimbra.client.*" %>

<%@ page import="org.apache.commons.fileupload.*,org.apache.commons.fileupload.disk.*, org.apache.commons.io.*, java.util.*,
java.io.File, java.lang.Exception" %>
<%
    String FURL = "http://api.flickr.com/services/upload/";
    String src = null;
    String api_key = null;
    String user_id = null;
    String auth_token = null;
    String api_sig = null;
    String title = null;
    String tags = null;

    try { src = request.getParameter("src");   // Image source 
    } catch (Exception e) { src = ""; }

    try { tags = request.getParameter("tags");  // Image tags (optional)
    } catch (Exception e) { tags = ""; }

    try { title = request.getParameter("title");    // Image title (optional)
    } catch (Exception e) { title = ""; }

    try{ api_key = request.getParameter ("api_key"); }
    catch (Exception e) { api_key = ""; }

    try { user_id = request.getParameter ("user_id"); }
    catch (Exception e) { user_id = ""; }

    try { auth_token = request.getParameter ("auth_token"); }
    catch (Exception e) { auth_token = ""; }

    try { api_sig = request.getParameter ("api_sig"); }
    catch (Exception e) { api_sig=""; }

    String url = FURL + "?api_key=" + api_key + "&auth_token=" + auth_token + "&api_sig=" + api_sig + "&user_id=" + user_id;
    // System.out.println ("[Yflickr] Uploading to URL " + url);

    //ServletOutputStream os = response.getOutputStream();
    /* response.setStatus(200);
    response.setContentType("text/plain");
    os.println ("url=" + url);
    os.println ("src=" + src);
    return; */

    /* we first need to fetch the image from the local url specified by src, save it to a local file,
       and then upload it to flickr
     */

    // first generate a local file name to store the image before uploading
    String dirPath = System.getProperty ("java.io.tmpdir", "/tmp");
    String filePath = dirPath + "/yflickr_" + System.currentTimeMillis() + ".jpg";
    File rfile = new File (filePath);
    FileOutputStream rfile_stream = new FileOutputStream (rfile.getPath());

    try {
        javax.servlet.http.Cookie reqCookie[] = request.getCookies();
        org.apache.commons.httpclient.Cookie[] clientCookie = new org.apache.commons.httpclient.Cookie[reqCookie.length];
        String hostName = request.getServerName () + ":" + request.getServerPort();

        for (int i=0; i<reqCookie.length; i++) {
            javax.servlet.http.Cookie cookie = reqCookie[i];
            clientCookie[i] = new org.apache.commons.httpclient.Cookie (hostName,cookie.getName(), cookie.getValue(),"/",null,false);
        }

        HttpState state = new HttpState ();
        state.addCookies (clientCookie);

        HttpClient srcclient = new HttpClient ();
        srcclient.setState (state);

        GetMethod get = new GetMethod (URLDecoder.decode (src,"UTF-8"));
        get.setFollowRedirects (true);

        srcclient.getHttpConnectionManager().getParams().setConnectionTimeout (10000);
        srcclient.executeMethod(get);

        ByteUtil.copy(get.getResponseBodyAsStream(), false, rfile_stream, false);
    }
    catch (Exception e) {
    }

    MultipartPostMethod mpm = new MultipartPostMethod (url);

    mpm.addParameter ("api_key", api_key);
    mpm.addParameter ("user_id", user_id);
    mpm.addParameter ("auth_token", auth_token);
    mpm.addParameter ("api_sig", api_sig);
    if ((title != null) && (title.length() > 0)) { mpm.addParameter ("title", title); }
    if ((tags != null) && (tags.length() > 0)) { mpm.addParameter ("tags", tags); }

    FilePart fimgpart = new FilePart ("photo", "yflickr_zimlet_photo.jpg", rfile);
    fimgpart.setTransferEncoding (null);
    mpm.addPart (fimgpart);

    // upload to flickr
    HttpClient client = new HttpClient ();

    try {
        client.getHttpConnectionManager().getParams().setConnectionTimeout (10000);
        client.executeMethod (mpm);
    } catch (HttpException ex) {
        response.sendError(500);
        return;
    }

    try {
        response.setStatus (mpm.getStatusCode ());
    } catch (Exception e) {
        response.setStatus (500);
    }

    try { 
        response.setContentType (mpm.getResponseHeader ("Content-Type").getValue());
    } catch (Exception e) {
        response.setContentType ("text/plain");
    }
    try{
        //ByteUtil.copy (mpm.getResponseBodyAsStream(), false, os, false);
        out.print(mpm.getResponseBodyAsString());
        mpm.releaseConnection();
    }catch (Exception e){
        
    }
%>
