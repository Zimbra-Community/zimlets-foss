/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2007, 2008, 2009, 2010, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2007, 2008, 2009, 2010, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

Com_Zimbra_YMEmoticons.REGEXP = /(>:D<|#:-S|O:-\)|<:-P|:-SS|<\):\)|:-\?\?|3:-O|:\(\|\)|@};-|\*\*==|\(~~\)|\*-:\)|\[-O<|:\)>-|\\:D\x2f|\^:\)\^|;;\)|:-\x2f|:\x22>|:-\*|=\(\(|:-O|B-\)|:-S|>:\)|:\(\(|:\)\)|\x2f:\)|=\)\)|:-B|:-c|:\)\]|~X\(|:-h|:-t|8->|I-\)|8-\||L-\)|:-&|:-\$|\[-\(|:O\)|8-}|\(:\||=P~|:-\?|#-o|=D>|@-\)|:\^o|:-w|:-<|>:P|:o3|%-\(|:@\)|~:>|%%-|~O\)|8-X|=:\)|>-\)|:-L|\$-\)|:-\x22|b-\(|\[-X|>:\x2f|;\)\)|:-@|:-j|\(\*\)|o->|o=>|o-\+|\(%\)|:\)|:\(|;\)|X\(|:>|:\||=;)/ig;
Com_Zimbra_YMEmoticons.REGEXP_CASE_SENSITIVE = /(:D|:X|:P)/g;

Com_Zimbra_YMEmoticons.SMILEYS = {

	":)" : {
		"width" : 18,
		"alt" : "emoticon_happy",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/1.gif",
		"text" : ":)",
		"regexp" : ":\\)",
		"height" : 18
	},
	":(" : {
		"width" : 18,
		"alt" : "emoticon_sad",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/2.gif",
		"text" : ":(",
		"regexp" : ":\\(",
		"height" : 18
	},
	"(~~)" : {
		"width" : 17,
		"alt" : "emoticon_pumpkin",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/56.gif",
		"text" : "(~~)",
		"regexp" : "\\(~~\\)",
		"height" : 18
	},
	"~o)" : {
		"width" : 18,
		"alt" : "emoticon_coffee",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/57.gif",
		"text" : "~O)",
		"regexp" : "~O\\)",
		"height" : 18
	},
	":\">" : {
		"width" : 18,
		"alt" : "emoticon_blushing",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/9.gif",
		"text" : ":\">",
		"regexp" : ":\\x22>",
		"height" : 18
	},
	"[-(" : {
		"width" : 18,
		"alt" : "emoticon_not_talking",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/33.gif",
		"text" : "[-(",
		"regexp" : "\\[-\\(",
		"height" : 18
	},
	">:d<" : {
		"width" : 42,
		"alt" : "emoticon_big_hug",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/6.gif",
		"text" : ">:D<",
		"regexp" : ">:D<",
		"height" : 18
	},
	"#-o" : {
		"width" : 24,
		"alt" : "emoticon_d_oh",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/40.gif",
		"text" : "#-o",
		"regexp" : "#-o",
		"height" : 18
	},
	"[-x" : {
		"width" : 22,
		"alt" : "emoticon_shame_on_you",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/68.gif",
		"text" : "[-X",
		"regexp" : "\\[-X",
		"height" : 18
	},
	":-t" : {
		"width" : 30,
		"alt" : "emoticon_time_out",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/104.gif",
		"text" : ":-t",
		"regexp" : ":-t",
		"height" : 18
	},
	":(|)" : {
		"width" : 21,
		"alt" : "emoticon_monkey",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/51.gif",
		"text" : ":(|)",
		"regexp" : ":\\(\\|\\)",
		"height" : 18
	},
	":o)" : {
		"width" : 28,
		"alt" : "emoticon_clown",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/34.gif",
		"text" : ":O)",
		"regexp" : ":O\\)",
		"height" : 18
	},
	"i-)" : {
		"width" : 21,
		"alt" : "emoticon_sleepy",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/28.gif",
		"text" : "I-)",
		"regexp" : "I-\\)",
		"height" : 18
	},
	";;)" : {
		"width" : 18,
		"alt" : "emoticon_batting_eyelashes",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/5.gif",
		"text" : ";;)",
		"regexp" : ";;\\)",
		"height" : 18
	},
	":^o" : {
		"width" : 18,
		"alt" : "emoticon_liar",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/44.gif",
		"text" : ":^o",
		"regexp" : ":\\^o",
		"height" : 18
	},
	"<:-p" : {
		"width" : 38,
		"alt" : "emoticon_party",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/36.gif",
		"text" : "<:-P",
		"regexp" : "<:-P",
		"height" : 18
	},
	"x(" : {
		"width" : 34,
		"alt" : "emoticon_angry",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/14.gif",
		"text" : "X(",
		"regexp" : "X\\(",
		"height" : 18
	},
	":-/" : {
		"width" : 20,
		"alt" : "emoticon_confused",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/7.gif",
		"text" : ":-/",
		"regexp" : ":-\\x2f",
		"height" : 18
	},
	"#:-s" : {
		"width" : 34,
		"alt" : "emoticon_whew",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/18.gif",
		"text" : "#:-S",
		"regexp" : "#:-S",
		"height" : 18
	},
	"8->" : {
		"width" : 23,
		"alt" : "emoticon_daydreaming",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/105.gif",
		"text" : "8->",
		"regexp" : "8->",
		"height" : 18
	},
	":d" : {
		"width" : 18,
		"alt" : "emoticon_big_grin",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/4.gif",
		"text" : ":D",
		"regexp" : ":D",
		"height" : 18
	},
	"\\:d/" : {
		"width" : 26,
		"alt" : "emoticon_dancing",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/69.gif",
		"text" : "\\:D/",
		"regexp" : "\\\\:D\\x2f",
		"height" : 18
	},
	":-b" : {
		"width" : 24,
		"alt" : "emoticon_nerd",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/26.gif",
		"text" : ":-B",
		"regexp" : ":-B",
		"height" : 18
	},
	":-@" : {
		"width" : 36,
		"alt" : "emoticon_chatterbox",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/76.gif",
		"text" : ":-@",
		"regexp" : ":-@",
		"height" : 18
	},
	":-h" : {
		"width" : 28,
		"alt" : "emoticon_wave",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/103.gif",
		"text" : ":-h",
		"regexp" : ":-h",
		"height" : 18
	},
	":-c" : {
		"width" : 28,
		"alt" : "emoticon_call_me",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/101.gif",
		"text" : ":-c",
		"regexp" : ":-c",
		"height" : 18
	},
	"=p~" : {
		"width" : 18,
		"alt" : "emoticon_drooling",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/38.gif",
		"text" : "=P~",
		"regexp" : "=P~",
		"height" : 18
	},
	"(:|" : {
		"width" : 18,
		"alt" : "emoticon_yawn",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/37.gif",
		"text" : "(:|",
		"regexp" : "\\(:\\|",
		"height" : 18
	},
	":-o" : {
		"width" : 18,
		"alt" : "emoticon_surprise",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/13.gif",
		"text" : ":-O",
		"regexp" : ":-O",
		"height" : 18
	},
	"o->" : {
		"width" : 18,
		"alt" : "emoticon_hiro",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/72.gif",
		"text" : "o->",
		"regexp" : "o->",
		"height" : 18
	},
	":))" : {
		"width" : 18,
		"alt" : "emoticon_laughing",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/21.gif",
		"text" : ":))",
		"regexp" : ":\\)\\)",
		"height" : 18
	},
	"/:)" : {
		"width" : 18,
		"alt" : "emoticon_raised_eyebrow",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/23.gif",
		"text" : "/:)",
		"regexp" : "\\x2f:\\)",
		"height" : 18
	},
	"*-:)" : {
		"width" : 30,
		"alt" : "emoticon_idea",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/58.gif",
		"text" : "*-:)",
		"regexp" : "\\*-:\\)",
		"height" : 18
	},
	":)]" : {
		"width" : 31,
		"alt" : "emoticon_on_the_phone",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/100.gif",
		"text" : ":)]",
		"regexp" : ":\\)\\]",
		"height" : 18
	},
	":-ss" : {
		"width" : 36,
		"alt" : "emoticon_nailbiting",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/42.gif",
		"text" : ":-SS",
		"regexp" : ":-SS",
		"height" : 18
	},
	"(%)" : {
		"width" : 18,
		"alt" : "emoticon_yin_yang",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/75.gif",
		"text" : "(%)",
		"regexp" : "\\(%\\)",
		"height" : 18
	},
	":-*" : {
		"width" : 18,
		"alt" : "emoticon_kiss",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/11.gif",
		"text" : ":-*",
		"regexp" : ":-\\*",
		"height" : 18
	},
	"~x(" : {
		"width" : 44,
		"alt" : "emoticon_at_wits_end",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/102.gif",
		"text" : "~X(",
		"regexp" : "~X\\(",
		"height" : 18
	},
	"o=>" : {
		"width" : 18,
		"alt" : "emoticon_billy",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/73.gif",
		"text" : "o=>",
		"regexp" : "o=>",
		"height" : 18
	},
	":-??" : {
		"width" : 40,
		"alt" : "emoticon_I_dont_know",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/106.gif",
		"text" : ":-??",
		"regexp" : ":-\\?\\?",
		"height" : 18
	},
	"@-)" : {
		"width" : 18,
		"alt" : "emoticon_hypnotized",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/43.gif",
		"text" : "@-)",
		"regexp" : "@-\\)",
		"height" : 18
	},
	"3:-o" : {
		"width" : 18,
		"alt" : "emoticon_cow",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/50.gif",
		"text" : "3:-O",
		"regexp" : "3:-O",
		"height" : 18
	},
	"=d>" : {
		"width" : 18,
		"alt" : "emoticon_applause",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/41.gif",
		"text" : "=D>",
		"regexp" : "=D>",
		"height" : 18
	},
	":-w" : {
		"width" : 23,
		"alt" : "emoticon_waiting",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/45.gif",
		"text" : ":-w",
		"regexp" : ":-w",
		"height" : 18
	},
	":x" : {
		"width" : 18,
		"alt" : "emoticon_love_struck",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/8.gif",
		"text" : ":x",
		"regexp" : ":x",
		"height" : 18
	},
	":-$" : {
		"width" : 18,
		"alt" : "emoticon_dont_tell_anyone",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/32.gif",
		"text" : ":-$",
		"regexp" : ":-\\$",
		"height" : 18
	},
	"~:>" : {
		"width" : 18,
		"alt" : "emoticon_chicken",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/52.gif",
		"text" : "~:>",
		"regexp" : "~:>",
		"height" : 18
	},
	"=:)" : {
		"width" : 20,
		"alt" : "emoticon_bug",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/60.gif",
		"text" : "=:)",
		"regexp" : "=:\\)",
		"height" : 18
	},
	"(*)" : {
		"width" : 18,
		"alt" : "emoticon_star",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/79.gif",
		"text" : "(*)",
		"regexp" : "\\(\\*\\)",
		"height" : 18
	},
	":|" : {
		"width" : 18,
		"alt" : "emoticon_straight_face",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/22.gif",
		"text" : ":|",
		"regexp" : ":\\|",
		"height" : 18
	},
	":((" : {
		"width" : 22,
		"alt" : "emoticon_crying",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/20.gif",
		"text" : ":((",
		"regexp" : ":\\(\\(",
		"height" : 18
	},
	"8-x" : {
		"width" : 18,
		"alt" : "emoticon_skull",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/59.gif",
		"text" : "8-X",
		"regexp" : "8-X",
		"height" : 18
	},
	"o:-)" : {
		"width" : 30,
		"alt" : "emoticon_angel",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/25.gif",
		"text" : "O:-)",
		"regexp" : "O:-\\)",
		"height" : 18
	},
	">:p" : {
		"width" : 18,
		"alt" : "emoticon_phbbbbt",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/47.gif",
		"text" : ">:P",
		"regexp" : ">:P",
		"height" : 18
	},
	">-)" : {
		"width" : 18,
		"alt" : "emoticon_alien",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/61.gif",
		"text" : ">-)",
		"regexp" : ">-\\)",
		"height" : 18
	},
	"=((" : {
		"width" : 18,
		"alt" : "emoticon_broken_heart",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/12.gif",
		"text" : "=((",
		"regexp" : "=\\(\\(",
		"height" : 18
	},
	"l-)" : {
		"width" : 24,
		"alt" : "emoticon_loser",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/30.gif",
		"text" : "L-)",
		"regexp" : "L-\\)",
		"height" : 18
	},
	":@)" : {
		"width" : 18,
		"alt" : "emoticon_pig",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/49.gif",
		"text" : ":@)",
		"regexp" : ":@\\)",
		"height" : 18
	},
	">:/" : {
		"width" : 23,
		"alt" : "emoticon_bring_it_on",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/70.gif",
		"text" : ">:/",
		"regexp" : ">:\\x2f",
		"height" : 18
	},
	"b-(" : {
		"width" : 18,
		"alt" : "emoticon_feeling_beat_up",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/66.gif",
		"text" : "b-(",
		"regexp" : "b-\\(",
		"height" : 18
	},
	"$-)" : {
		"width" : 18,
		"alt" : "emoticon_money_eyes",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/64.gif",
		"text" : "$-)",
		"regexp" : "\\$-\\)",
		"height" : 18
	},
	":-?" : {
		"width" : 18,
		"alt" : "emoticon_thinking",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/39.gif",
		"text" : ":-?",
		"regexp" : ":-\\?",
		"height" : 18
	},
	":)>-" : {
		"width" : 22,
		"alt" : "emoticon_peace_sign",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/67.gif",
		"text" : ":)>-",
		"regexp" : ":\\)>-",
		"height" : 18
	},
	":-j" : {
		"width" : 26,
		"alt" : "emoticon_oh_go_on",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/78.gif",
		"text" : ":-j",
		"regexp" : ":-j",
		"height" : 18
	},
	"%%-" : {
		"width" : 18,
		"alt" : "emoticon_good_luck",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/54.gif",
		"text" : "%%-",
		"regexp" : "%%-",
		"height" : 18
	},
	"%-(" : {
		"width" : 52,
		"alt" : "emoticon_not_listening",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/107.gif",
		"text" : "%-(",
		"regexp" : "%-\\(",
		"height" : 18
	},
	":p" : {
		"width" : 18,
		"alt" : "emoticon_tongue",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/10.gif",
		"text" : ":P",
		"regexp" : ":P",
		"height" : 18
	},
	"^:)^" : {
		"width" : 32,
		"alt" : "emoticon_not_worthy",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/77.gif",
		"text" : "^:)^",
		"regexp" : "\\^:\\)\\^",
		"height" : 18
	},
	":-\"" : {
		"width" : 22,
		"alt" : "emoticon_whistling",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/65.gif",
		"text" : ":-\"",
		"regexp" : ":-\\x22",
		"height" : 18
	},
	":-<" : {
		"width" : 24,
		"alt" : "emoticon_sigh",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/46.gif",
		"text" : ":-<",
		"regexp" : ":-<",
		"height" : 18
	},
	":o3" : {
		"width" : 31,
		"alt" : "emoticon_puppy_dog_eyes",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/108.gif",
		"text" : ":o3",
		"regexp" : ":o3",
		"height" : 18
	},
	">:)" : {
		"width" : 18,
		"alt" : "emoticon_devil",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/19.gif",
		"text" : ">:)",
		"regexp" : ">:\\)",
		"height" : 18
	},
	"=;" : {
		"width" : 18,
		"alt" : "emoticon_talk_to_the_hand",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/27.gif",
		"text" : "=;",
		"regexp" : "=;",
		"height" : 18
	},
	"8-|" : {
		"width" : 18,
		"alt" : "emoticon_rolling_eyes",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/29.gif",
		"text" : "8-|",
		"regexp" : "8-\\|",
		"height" : 18
	},
	"**==" : {
		"width" : 25,
		"alt" : "emoticon_flag",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/55.gif",
		"text" : "**==",
		"regexp" : "\\*\\*==",
		"height" : 18
	},
	"o-+" : {
		"width" : 18,
		"alt" : "emoticon_april",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/74.gif",
		"text" : "o-+",
		"regexp" : "o-+",
		"height" : 18
	},
	"8-}" : {
		"width" : 24,
		"alt" : "emoticon_silly",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/35.gif",
		"text" : "8-}",
		"regexp" : "8-}",
		"height" : 18
	},
	"=))" : {
		"width" : 30,
		"alt" : "emoticon_rolling_on_the_floor",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/24.gif",
		"text" : "=))",
		"regexp" : "=\\)\\)",
		"height" : 18
	},
	":-l" : {
		"width" : 18,
		"alt" : "emoticon_frustrated",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/62.gif",
		"text" : ":-L",
		"regexp" : ":-L",
		"height" : 18
	},
	"b-)" : {
		"width" : 18,
		"alt" : "emoticon_cool",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/16.gif",
		"text" : "B-)",
		"regexp" : "B-\\)",
		"height" : 18
	},
	";)" : {
		"width" : 18,
		"alt" : "emoticon_winking",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/3.gif",
		"text" : ";)",
		"regexp" : ";\\)",
		"height" : 18
	},
	":>" : {
		"width" : 18,
		"alt" : "emoticon_smug",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/15.gif",
		"text" : ":>",
		"regexp" : ":>",
		"height" : 18
	},
	":-&" : {
		"width" : 18,
		"alt" : "emoticon_sick",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/31.gif",
		"text" : ":-&",
		"regexp" : ":-&",
		"height" : 18
	},
	"<):)" : {
		"width" : 18,
		"alt" : "emoticon_cowboy",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/48.gif",
		"text" : "<):)",
		"regexp" : "<\\):\\)",
		"height" : 18
	},
	":-s" : {
		"width" : 18,
		"alt" : "emoticon_worried",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/17.gif",
		"text" : ":-S",
		"regexp" : ":-S",
		"height" : 18
	},
	";))" : {
		"width" : 18,
		"alt" : "emoticon_hee_hee",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/71.gif",
		"text" : ";))",
		"regexp" : ";\\)\\)",
		"height" : 18
	},
	"[-o<" : {
		"width" : 18,
		"alt" : "emoticon_praying",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/63.gif",
		"text" : "[-O<",
		"regexp" : "\\[-O<",
		"height" : 18
	},
	"@};-" : {
		"width" : 18,
		"alt" : "emoticon_rose",
		"src" : "/service/zimlet/com_zimbra_ymemoticons/img/53.gif",
		"text" : "@};-",
		"regexp" : "@};-",
		"height" : 18
	}
};

