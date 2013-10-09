define('MAF.keyboard.ReuseKeyboard', function (config) {
	var USE_INPUT_METHOD = false;
	var internals = {
		Tables: {
			CharacterDefinitions: {
				"char-a":			{label:"a",value:"a",unicode:"\u0061"},
				"char-A":			{label:"A",value:"A",unicode:"\u0041"},
				"char-agrave":		{label:"à",value:"à",unicode:"\u00E0"},
				"char-aacute":		{label:"á",value:"á",unicode:"\u00E1"},
				"char-acirc":		{label:"â",value:"â",unicode:"\u00E2"},
				"char-auml":		{label:"ä",value:"ä",unicode:"\u00E4"},
				"char-aring":		{label:"å",value:"å",unicode:"\u00E5"},
				"char-atilde":		{label:"ã",value:"ã",unicode:"\u00E3"},
				"char-Agrave":		{label:"À",value:"À",unicode:"\u00C0"},
				"char-Aacute":		{label:"Á",value:"Á",unicode:"\u00C1"},
				"char-Acirc":		{label:"Â",value:"Â",unicode:"\u00C2"},
				"char-Auml":		{label:"Ä",value:"Ä",unicode:"\u00C4"},
				"char-Aring":		{label:"Å",value:"Å",unicode:"\u00C5"},
				"char-Atilde":		{label:"Ã",value:"Ã",unicode:"\u00C3"},
				"char-aelig":		{label:"æ",value:"æ",unicode:"\u00E6"},
				"char-AElig":		{label:"Æ",value:"Æ",unicode:"\u00C6"},
				"char-b":			{label:"b",value:"b",unicode:"\u0062"},
				"char-B":			{label:"B",value:"B",unicode:"\u0042"},
				"char-c":			{label:"c",value:"c",unicode:"\u0063"},
				"char-C":			{label:"C",value:"C",unicode:"\u0043"},
				"char-ccedil":		{label:"ç",value:"ç",unicode:"\u00E7"},
				"char-Ccedil":		{label:"Ç",value:"Ç",unicode:"\u00C7"},
				"char-d":			{label:"d",value:"d",unicode:"\u0064"},
				"char-D":			{label:"D",value:"D",unicode:"\u0044"},
				"char-e":			{label:"e",value:"e",unicode:"\u0065"},
				"char-E":			{label:"E",value:"E",unicode:"\u0045"},
				"char-egrave":		{label:"è",value:"è",unicode:"\u00E8"},
				"char-eacute":		{label:"é",value:"é",unicode:"\u00E9"},
				"char-ecirc":		{label:"ê",value:"ê",unicode:"\u00EA"},
				"char-euml":		{label:"ë",value:"ë",unicode:"\u00EB"},
				"char-Egrave":		{label:"È",value:"È",unicode:"\u00C8"},
				"char-Eacute":		{label:"É",value:"É",unicode:"\u00C9"},
				"char-Ecirc":		{label:"Ê",value:"Ê",unicode:"\u00CA"},
				"char-Euml":		{label:"Ë",value:"Ë",unicode:"\u00CB"},
				"char-f":			{label:"f",value:"f",unicode:"\u0066"},
				"char-F":			{label:"F",value:"F",unicode:"\u0046"},
				"char-g":			{label:"g",value:"g",unicode:"\u0067"},
				"char-G":			{label:"G",value:"G",unicode:"\u0047"},
				"char-h":			{label:"h",value:"h",unicode:"\u0068"},
				"char-H":			{label:"H",value:"H",unicode:"\u0048"},
				"char-i":			{label:"i",value:"i",unicode:"\u0069"},
				"char-I":			{label:"I",value:"I",unicode:"\u0049"},
				"char-igrave":		{label:"ì",value:"ì",unicode:"\u00EC"},
				"char-iacute":		{label:"í",value:"í",unicode:"\u00ED"},
				"char-icirc":		{label:"î",value:"î",unicode:"\u00EE"},
				"char-iuml":		{label:"ï",value:"ï",unicode:"\u00EF"},
				"char-Igrave":		{label:"Ì",value:"Ì",unicode:"\u00CC"},
				"char-Iacute":		{label:"Í",value:"Í",unicode:"\u00CD"},
				"char-Icirc":		{label:"Î",value:"Î",unicode:"\u00CE"},
				"char-Iuml":		{label:"Ï",value:"Ï",unicode:"\u00CF"},
				"char-j":			{label:"j",value:"j",unicode:"\u006A"},
				"char-J":			{label:"J",value:"J",unicode:"\u004A"},
				"char-k":			{label:"k",value:"k",unicode:"\u006B"},
				"char-K":			{label:"K",value:"K",unicode:"\u004B"},
				"char-l":			{label:"l",value:"l",unicode:"\u006C"},
				"char-L":			{label:"L",value:"L",unicode:"\u004C"},
				"char-m":			{label:"m",value:"m",unicode:"\u006D"},
				"char-M":			{label:"M",value:"M",unicode:"\u004D"},
				"char-n":			{label:"n",value:"n",unicode:"\u006E"},
				"char-N":			{label:"N",value:"N",unicode:"\u004E"},
				"char-ntilde":		{label:"ñ",value:"ñ",unicode:"\u00F1"},
				"char-Ntilde":		{label:"Ñ",value:"Ñ",unicode:"\u00D1"},
				"char-o":			{label:"o",value:"o",unicode:"\u006F"},
				"char-O":			{label:"O",value:"O",unicode:"\u004F"},
				"char-ograve":		{label:"ò",value:"ò",unicode:"\u00F2"},
				"char-oacute":		{label:"ó",value:"ó",unicode:"\u00F3"},
				"char-ocirc":		{label:"ô",value:"ô",unicode:"\u00F4"},
				"char-ouml":		{label:"ö",value:"ö",unicode:"\u00F5"},
				"char-oslash":		{label:"ø",value:"ø",unicode:"\u00F8"},
				"char-otilde":		{label:"õ",value:"õ",unicode:"\u00F6"},
				"char-Ograve":		{label:"Ò",value:"Ò",unicode:"\u00D2"},
				"char-Oacute":		{label:"Ó",value:"Ó",unicode:"\u00D3"},
				"char-Ocirc":		{label:"Ô",value:"Ô",unicode:"\u00D4"},
				"char-Ouml":		{label:"Ö",value:"Ö",unicode:"\u00D5"},
				"char-Oslash":		{label:"Ø",value:"Ø",unicode:"\u00D8"},
				"char-Otilde":		{label:"Õ",value:"Õ",unicode:"\u00D6"},
				"char-oelig":		{label:"œ",value:"œ",unicode:"\u0153"},
				"char-OElig":		{label:"Œ",value:"Œ",unicode:"\u0152"},
				"char-p":			{label:"p",value:"p",unicode:"\u0070"},
				"char-P":			{label:"P",value:"P",unicode:"\u0050"},
				"char-q":			{label:"q",value:"q",unicode:"\u0071"},
				"char-Q":			{label:"Q",value:"Q",unicode:"\u0051"},
				"char-r":			{label:"r",value:"r",unicode:"\u0072"},
				"char-R":			{label:"R",value:"R",unicode:"\u0052"},
				"char-s":			{label:"s",value:"s",unicode:"\u0073"},
				"char-S":			{label:"S",value:"S",unicode:"\u0053"},
				"char-t":			{label:"t",value:"t",unicode:"\u0074"},
				"char-T":			{label:"T",value:"T",unicode:"\u0054"},
				"char-u":			{label:"u",value:"u",unicode:"\u0075"},
				"char-U":			{label:"U",value:"U",unicode:"\u0055"},
				"char-ugrave":		{label:"ù",value:"ù",unicode:"\u00F9"},
				"char-uacute":		{label:"ú",value:"ú",unicode:"\u00FA"},
				"char-ucirc":		{label:"û",value:"û",unicode:"\u00FB"},
				"char-uuml":		{label:"ü",value:"ü",unicode:"\u00FC"},
				"char-Ugrave":		{label:"Ù",value:"Ù",unicode:"\u00D9"},
				"char-Uacute":		{label:"Ú",value:"Ú",unicode:"\u00DA"},
				"char-Ucirc":		{label:"Û",value:"Û",unicode:"\u00DB"},
				"char-Uuml":		{label:"Ü",value:"Ü",unicode:"\u00DC"},
				"char-v":			{label:"v",value:"v",unicode:"\u0076"},
				"char-V":			{label:"V",value:"V",unicode:"\u0056"},
				"char-w":			{label:"w",value:"w",unicode:"\u0077"},
				"char-W":			{label:"W",value:"W",unicode:"\u0057"},
				"char-x":			{label:"x",value:"x",unicode:"\u0078"},
				"char-X":			{label:"X",value:"X",unicode:"\u0058"},
				"char-y":			{label:"y",value:"y",unicode:"\u0079"},
				"char-Y":			{label:"Y",value:"Y",unicode:"\u0059"},
				"char-yuml":		{label:"ÿ",value:"ÿ",unicode:"\u00FF"},
				"char-yacute":		{label:"ý",value:"ý",unicode:"\u00FD"},
				"char-Yacute":		{label:"Ý",value:"Ý",unicode:"\u00DD"},
				"char-z":			{label:"z",value:"z",unicode:"\u007A"},
				"char-Z":			{label:"Z",value:"Z",unicode:"\u005A"},
				"char-eth":			{label:"ð",value:"ð",unicode:"\u00F0"},
				"char-thorn":		{label:"þ",value:"þ",unicode:"\u00FE"},
				"char-ETH":			{label:"Ð",value:"Ð",unicode:"\u00D0"},
				"char-THORN":		{label:"Þ",value:"Þ",unicode:"\u00DE"},
				"char-szlig":		{label:"ß",value:"ß",unicode:"\u00DF"},
				"char-scaron":		{label:"š",value:"š",unicode:"\u0161"},
				"char-Scaron":		{label:"Š",value:"Š",unicode:"\u0160"},
				"char-excl":		{label:"!",value:"!",unicode:"\u0021"},
				"char-iexcl":		{label:"¡",value:"¡",unicode:"\u00A1"},
				"char-quest":		{label:"?",value:"?",unicode:"\u003F"},
				"char-iquest":		{label:"¿",value:"¿",unicode:"\u00BF"},
				"char-dollar":		{label:"$",value:"$",unicode:"\u0024"},
				"char-euro":		{label:"€",value:"€",unicode:"\u20AC"},
				"char-pound":		{label:"£",value:"£",unicode:"\u00A3"},
				"char-yen":			{label:"¥",value:"¥",unicode:"\u00A5"},
				"char-atsign":		{label:"@",value:"@",unicode:"\u0040"},
				"char-colon":		{label:":",value:":",unicode:"\u003A"},
				"char-semicolon":	{label:";",value:";",unicode:"\u003B"},
				"char-caret":		{label:"^",value:"^",unicode:"\u005E"},
				"char-lt":			{label:"<",value:"<",unicode:"\u003C"},
				"char-gt":			{label:">",value:">",unicode:"\u003E"},
				"char-equal":		{label:"=",value:"=",unicode:"\u003D"},
				"char-number":		{label:"#",value:"#",unicode:"\u0023"},
				"char-apos":		{label:"\'",value:"\'",unicode:"\u0027"},
				"char-quot":		{label:"\"",value:"\"",unicode:"\u0022"},
				"char-amp":			{label:"&",value:"&",unicode:"\u0026"},
				"char-lparen":		{label:"(",value:"(",unicode:"\u0028"},
				"char-rparen":		{label:")",value:")",unicode:"\u0029"},
				"char-lcurly":		{label:"{",value:"{",unicode:"\u007B"},
				"char-rcurly":		{label:"}",value:"}",unicode:"\u007D"},
				"char-lsquare":		{label:"[",value:"[",unicode:"\u005B"},
				"char-rsquare":		{label:"]",value:"]",unicode:"\u005D"},
				"char-vertline":	{label:"|",value:"|",unicode:"\u007C"},
				"char-grave":		{label:"`",value:"`",unicode:"\u0060"},
				"char-tilde":		{label:"~",value:"~",unicode:"\u007E"},
				"char-asterisk":	{label:"*",value:"*",unicode:"\u002A"},
				"char-comma":		{label:",",value:",",unicode:"\u002C"},
				"char-hyphen":		{label:"-",value:"-",unicode:"\u002D"},
				"char-underscore":	{label:"_",value:"_",unicode:"\u005F"},
				"char-period":		{label:".",value:".",unicode:"\u002E"},
				"char-plus":		{label:"+",value:"+",unicode:"\u002B"},
				"char-percent":		{label:"%",value:"%",unicode:"\u0025"},
				"char-divide":		{label:"÷",value:"÷",unicode:"\u00F7"},
				"char-doubledagger":{label:"‡",value:"‡",unicode:"\u2021"},
				"char-degree":		{label:"°",value:"°",unicode:"\u00B0"},
				"char-bullet":		{label:"•",value:"•",unicode:"\u2022"},
				"char-ellipsis":	{label:"…",value:"…",unicode:"\u2026"},
				"char-slash":		{label:"\/",value:"\/",unicode:"\u002F"}, // TODO check output needs on slashes, quotes
				"char-backslash":	{label:"\\",value:"\\",unicode:"\u005C"},
				"digit-0":			{label:"0",value:"0",unicode:"\u0030"},
				"digit-1":			{label:"1",value:"1",unicode:"\u0031"},
				"digit-2":			{label:"2",value:"2",unicode:"\u0032"},
				"digit-3":			{label:"3",value:"3",unicode:"\u0033"},
				"digit-4":			{label:"4",value:"4",unicode:"\u0034"},
				"digit-5":			{label:"5",value:"5",unicode:"\u0035"},
				"digit-6":			{label:"6",value:"6",unicode:"\u0036"},
				"digit-7":			{label:"7",value:"7",unicode:"\u0037"},
				"digit-8":			{label:"8",value:"8",unicode:"\u0038"},
				"digit-9":			{label:"9",value:"9",unicode:"\u0039"},
				"char-space":		{label:"space",value:" ",unicode:"\u0020"}, // TODO localize label for spacebar
				// numpad / tripletap keys have two labels
				"numpad-0":		{label:"0",sublabel:"",value:"0"},
				"numpad-1":		{label:"1",sublabel:"",value:"1"},
				"numpad-2":		{label:"2",sublabel:"abc",value:"2"},
				"numpad-3":		{label:"3",sublabel:"def",value:"3"},
				"numpad-4":		{label:"4",sublabel:"ghi",value:"4"},
				"numpad-5":		{label:"5",sublabel:"jkl",value:"5"},
				"numpad-6":		{label:"6",sublabel:"mno",value:"6"},
				"numpad-7":		{label:"7",sublabel:"pqrs",value:"7"},
				"numpad-8":		{label:"8",sublabel:"tuv",value:"8"},
				"numpad-9":		{label:"9",sublabel:"wxyz",value:"9"}
			},
			KeyDefinitions: {
				"key-a":{
					normal:"char-a",
					shift:"char-A",
					extended:["char-a","char-agrave","char-aacute","char-acirc","char-auml","char-aring","char-aelig"],
					shiftextended:["char-A","char-Agrave","char-Aacute","char-Acirc","char-Auml","char-Aring","char-AElig"]
				},
				"key-b":{
					normal:"char-b",
					shift:"char-B"
				},
				"key-c":{
					normal:"char-c",
					shift:"char-C",
					extended:["char-c","char-ccedil"],
					shiftextended:["char-C","char-Ccedil"]
				},
				"key-d":{
					normal:"char-d",
					shift:"char-D",
					extended:["char-d","char-eth","char-thorn"],
					shiftextended:["char-D","char-ETH","char-THORN"]
				},
				"key-e":{
					normal:"char-e",
					shift:"char-E",
					extended:["char-e","char-egrave","char-eacute","char-ecirc","char-euml"],
					shiftextended:["char-E","char-Egrave","char-Eacute","char-Ecirc","char-Euml"]
				},
				"key-f":{
					normal:"char-f",
					shift:"char-F"
				},
				"key-g":{
					normal:"char-g",
					shift:"char-G"
				},
				"key-h":{
					normal:"char-h",
					shift:"char-H"
				},
				"key-i":{
					normal:"char-i",
					shift:"char-I",
					extended:["char-i","char-igrave","char-iacute","char-icirc","char-iuml"],
					shiftextended:["char-I","char-Igrave","char-Iacute","char-Icirc","char-Iuml"]
				},
				"key-j":{
					normal:"char-j",
					shift:"char-J"
				},
				"key-k":{
					normal:"char-k",
					shift:"char-K"
				},
				"key-l":{
					normal:"char-l",
					shift:"char-L"
				},
				"key-m":{
					normal:"char-m",
					shift:"char-M"
				},
				"key-n":{
					normal:"char-n",
					shift:"char-N",
					extended:["char-ntilde"],
					shiftextended:["char-Ntilde"]
				},
				"key-o":{
					normal:"char-o",
					shift:"char-O",
					extended:["char-o","char-ograve","char-oacute","char-ocirc","char-ouml","char-oslash","char-otilde","char-oelig"],
					shiftextended:["char-O","char-Ograve","char-Oacute","char-Ocirc","char-Ouml","char-Oslash","char-Otilde","char-OElig"]
				},
				"key-p":{
					normal:"char-p",
					shift:"char-P"
				},
				"key-q":{
					normal:"char-q",
					shift:"char-Q"
				},
				"key-r":{
					normal:"char-r",
					shift:"char-R"
				},
				"key-s":{
					normal:"char-s",
					shift:"char-S",
					extended:["char-s","char-szlig"],
					shiftextended:["char-S","char-szlig"]
				},
				"key-t":{
					normal:"char-t",
					shift:"char-T"
				},
				"key-u":{
					normal:"char-u",
					shift:"char-U",
					extended:["char-u","char-ugrave","char-uacute","char-ucirc","char-uuml"],
					shiftextended:["char-U","char-Ugrave","char-Uacute","char-Ucirc","char-Uuml"]
				},
				"key-v":{
					normal:"char-v",
					shift:"char-V"
				},
				"key-w":{
					normal:"char-w",
					shift:"char-W"
				},
				"key-x":{
					normal:"char-x",
					shift:"char-X"
				},
				// TODO better management of key definitions
				// with sparse/empty/mismatched counts by state
				"key-y":{
					normal:"char-y",
					shift:"char-Y",
					extended:["char-y","char-yacute","char-yuml"],
					shiftextended:["char-Y","char-Yacute"]
				},
				"key-z":{
					normal:"char-z",
					shift:"char-Z"
				},
				"key-currency":{
					normal:"char-dollar",
					shift:"char-dollar",
					extended:["char-dollar","char-euro","char-pound","char-yen"],
					shiftextended:["char-dollar","char-euro","char-pound","char-yen"]
				},
				"key-currency2":{
					normal:"char-euro",
					shift:"char-euro",
					extended:["char-dollar","char-euro","char-pound","char-yen"],
					shiftextended:["char-dollar","char-euro","char-pound","char-yen"]
				},
				"key-excl":{
					normal:"char-excl",
					shift:"char-excl",
					extended:["char-excl","char-iexcl"],
					shiftextended:["char-excl","char-iexcl"]
				},
				"key-quest":{
					normal:"char-quest",
					shift:"char-quest",
					extended:["char-quest","char-iquest"],
					shiftextended:["char-quest","char-iquest"]
				},
				"key-lparen":{
					normal:"char-lparen",
					shift:"char-lparen"
				},
				"key-rparen":{
					normal:"char-rparen",
					shift:"char-rparen"
				},
				"key-lcurly":{
					normal:"char-lcurly",
					shift:"char-lcurly"
				},
				"key-rcurly":{
					normal:"char-rcurly",
					shift:"char-rcurly"
				},
				"key-lsquare":{
					normal:"char-lsquare",
					shift:"char-lsquare"
				},
				"key-rsquare":{
					normal:"char-rsquare",
					shift:"char-rsquare"
				},
				"key-atsign":{
					normal:"char-atsign",
					shift:"char-atsign"
				},
				"key-period":{
					normal:"char-period",
					shift:"char-period"
				},
				"key-underscore":{
					normal:"char-underscore",
					shift:"char-underscore"
				},
				"key-comma":{
					normal:"char-comma",
					shift:"char-comma"
				},
				"key-semicolon":{
					normal:"char-semicolon",
					shift:"char-semicolon"
				},
				"key-colon":{
					normal:"char-colon",
					shift:"char-colon"
				},
				"key-caret":{
					normal:"char-caret",
					shift:"char-caret"
				},
				"key-plus":{
					normal:"char-plus",
					shift:"char-plus"
				},
				"key-tilde":{
					normal:"char-tilde",
					shift:"char-tilde"
				},
				"key-grave":{
					normal:"char-grave",
					shift:"char-grave"
				},
				"key-vertline":{
					normal:"char-vertline",
					shift:"char-vertline"
				},
				"key-amp":{
					normal:"char-amp",
					shift:"char-amp"
				},
				"key-percent":{
					normal:"char-percent",
					shift:"char-percent"
				},
				"key-divide":{
					normal:"char-divide",
					shift:"char-divide"
				},
				"key-hash":{
					normal:"char-number",
					shift:"char-number"
				},
				"key-doubledagger":{
					normal:"char-doubledagger",
					shift:"char-doubledagger"
				},
				"key-degree":{
					normal:"char-degree",
					shift:"char-degree"
				},
				"key-lt":{
					normal:"char-lt",
					shift:"char-lt"
				},
				"key-gt":{
					normal:"char-gt",
					shift:"char-gt"
				},
				"key-slash":{
					normal:"char-slash",
					shift:"char-slash"
				},
				"key-backslash":{
					normal:"char-backslash",
					shift:"char-backslash"
				},
				"key-apos":{
					normal:"char-apos",
					shift:"char-apos"
				},
				"key-quot":{
					normal:"char-quot",
					shift:"char-quot"
				},
				"key-hyphen":{
					normal:"char-hyphen",
					shift:"char-hyphen"
				},
				"key-equal":{
					normal:"char-equal",
					shift:"char-equal"
				},
				"key-bullet":{
					normal:"char-bullet",
					shift:"char-bullet"
				},
				"key-asterisk":{
					normal:"char-asterisk",
					shift:"char-asterisk"
				},
				// duplicate character IDs for shift and normal keeps digits active when shift is on
				"key-0":{ normal:"digit-0", shift:"char-hyphen" },
				"key-1":{ normal:"digit-1", shift:"char-excl" },
				"key-2":{ normal:"digit-2", shift:"char-atsign" },
				"key-3":{ normal:"digit-3", shift:"char-number" },
				"key-4":{ normal:"digit-4", shift:"char-euro" },
				"key-5":{ normal:"digit-5", shift:"char-colon" },
				"key-6":{ normal:"digit-6", shift:"char-slash" },
				"key-7":{ normal:"digit-7", shift:"char-period" },
				"key-8":{ normal:"digit-8", shift:"char-comma" },
				"key-9":{ normal:"digit-9", shift:"char-quest" },
				// no shift state on numpad keys? 
				// need to deal with this on the shift control as well, or just dupe up the shift value here too
				"numkey-0":{ normal:"numpad-0" },
				"numkey-1":{ normal:"numpad-1" },
				"numkey-2":{ normal:"numpad-2" },
				"numkey-3":{ normal:"numpad-3" },
				"numkey-4":{ normal:"numpad-4" },
				"numkey-5":{ normal:"numpad-5" },
				"numkey-6":{ normal:"numpad-6" },
				"numkey-7":{ normal:"numpad-7" },
				"numkey-8":{ normal:"numpad-8" },
				"numkey-9":{ normal:"numpad-9" },
				"numkey-decimal":{ normal:"char-period" },
				"numkey-comma": { normal: "char-comma"},
				// adding duplicate value for shift on space, plus an event trigger
				"key-space":{
					normal:"char-space", 
					shift:"char-space",
					//extended:["char-space"], // *** TODO no popup on space/extended?
					//shiftextended:["char-space"],
					event:"space"        
				},
				"action-shift":{
					code: 'shift',
					label:FontAwesome.get('arrow-up'),
					glyph:"shift",
					event:"shiftselect"
				},
				"action-extended":{
					label:"âëí",
					event:"extendedselect"
				},
				"action-backspace":{
					code: 'back',
					label:FontAwesome.get('arrow-left'),
					glyph:"delete",
					event:"backspace"
				},
				"action-closeextendedpanel":{ // TODO better name
					label:FontAwesome.get('undo'),
					glyph:"cancel",
					event:"extendedselect"
				},
				"action-nextlayout":{
					label:"",
					glyph:"",
					event:"layoutchanged"
				}
			},
			KeyLayouts: [{
				id: "alphanumeric",
				label: "abc",
				glyph: "",
				keyrows: [
					[{keyid:"key-a"},
					{keyid:"key-b"},
					{keyid:"key-c"},
					{keyid:"key-d"},
					{keyid:"key-e"},
					{keyid:"key-f"},
					{keyid:"key-g"},
					{keyid:"key-h"},
					{keyid:"key-i"}],
					[{keyid:"key-j"},
					{keyid:"key-k"},
					{keyid:"key-l"},
					{keyid:"key-m"},
					{keyid:"key-n"},
					{keyid:"key-o"},
					{keyid:"key-p"},
					{keyid:"key-q"},
					{keyid:"key-r"}],
					[{keyid:"key-s"},
					{keyid:"key-t"},
					{keyid:"key-u"},
					{keyid:"key-v"},
					{keyid:"key-w"},
					{keyid:"key-x"},
					{keyid:"key-y"},
					{keyid:"key-z"},
					{keyid:"key-0"}],
					[{keyid:"key-1"},
					{keyid:"key-2"},
					{keyid:"key-3"},
					{keyid:"key-4"},
					{keyid:"key-5"},
					{keyid:"key-6"},
					{keyid:"key-7"},
					{keyid:"key-8"},
					{keyid:"key-9"}]
				],
				controlrow:[
					{keyid:"action-nextlayout"},
					{keyid:"action-shift"},
					{keyid:"key-space"},
					{keyid:"action-extended"},
					{keyid:"action-backspace"}
				]
			},{
				id: "symbols",
				label: ".@#",
				glyph: "",
				keyrows: [
					[{keyid:"key-currency"},
					{keyid:"key-currency2"},
					{keyid:"key-lparen"},
					{keyid:"key-rparen"},
					{keyid:"key-lcurly"},
					{keyid:"key-rcurly"},
					{keyid:"key-tilde"},
					{keyid:"key-grave"},
					{keyid:"key-vertline"}],
					[{keyid:"key-comma"},
					{keyid:"key-amp"},
					{keyid:"key-lsquare"},
					{keyid:"key-rsquare"},
					{keyid:"key-caret"},
					{keyid:"key-percent"},
					{keyid:"key-divide"},
					{keyid:"key-hash"},
					{keyid:"key-degree"}],
					[{keyid:"key-excl"},
					{keyid:"key-quest"},
					{keyid:"key-lt"},
					{keyid:"key-gt"},
					{keyid:"key-colon"},
					{keyid:"key-semicolon"},
					{keyid:"key-plus"},
					{keyid:"key-asterisk"},
					{keyid:"key-bullet"}],
					[{keyid:"key-period"},
					{keyid:"key-atsign"},
					{keyid:"key-backslash"},
					{keyid:"key-slash"},
					{keyid:"key-apos"},
					{keyid:"key-quot"},
					{keyid:"key-hyphen"},
					{keyid:"key-equal"},
					{keyid:"key-underscore"}]
				],
				controlrow:[
					{keyid:"action-nextlayout"},
					{keyid:"action-shift"},
					{keyid:"key-space"},
					{keyid:"action-extended"},
					{keyid:"action-backspace"}
				],
				noShift:true,
				noExtended:true
			},{
				id: "digits",
				label: "123",
				glyph: "",
				keyrows: [
					[], // empty
					[{"keyid":"key-1"},
					{"keyid":"key-2"},
					{"keyid":"key-3"},
					{"keyid":"key-4"},
					{"keyid":"key-5"}],
					[{"keyid":"key-6"},
					{"keyid":"key-7"},
					{"keyid":"key-8"},
					{"keyid":"key-9"},
					{"keyid":"key-0"}],
					[] // empty
				],
				controlrow:[
					{"keyid":"action-nextlayout"},
					{"keyid":"action-shift"},
					{"keyid":"action-extended"},
					{"keyid":"key-space"},
					{"keyid":"action-backspace"}
				]
			},{
				id: "pinentry",
				label: "PIN",
				glyph: "",
				keyrows:[
					[{keyid:"numkey-1"},
					{keyid:"numkey-2"},
					{keyid:"numkey-3"}],
					[{keyid:"numkey-4"},
					{keyid:"numkey-5"},
					{keyid:"numkey-6"}],
					[{keyid:"numkey-7"},
					{keyid:"numkey-8"},
					{keyid:"numkey-9"}],
					[{keyid:"spacer-numkey"},
					{keyid:"numkey-0"},
					{keyid:"action-backspace"}]
				],
				controlrow:[],
				needNumericBackspace: true, 
				isPin: true, // allows release down
				isNumeric: true // triggers correct size of backspace key, padding
			},{
				id: "numeric-decimal",
				label: "123",
				glyph: "",
				keyrows:[
					[{keyid:"numkey-1"},
					{keyid:"numkey-2"},
					{keyid:"numkey-3"}],
					[{keyid:"numkey-4"},
					{keyid:"numkey-5"},
					{keyid:"numkey-6"}],
					[{keyid:"numkey-7"},
					{keyid:"numkey-8"},
					{keyid:"numkey-9"}]
				],
				controlrow:[
					{keyid: Number.DECIMAL === "," ? "numkey-comma" : "numkey-decimal"},
					{keyid:"numkey-0"},
					{keyid:"action-backspace"}
				],
				needNumericBackspace: true,
				isNumeric: true  // triggers correct size of backspace key, padding
			}],
			KeyLayoutSets: {
				'normal': ['alphanumeric', 'symbols'],
				'pin':    ['pinentry'],
				'decimal':['numeric-decimal']
			},
			ControlDimensions: {
				'standard':{
					'container':{width:522,height:331},
					'key':{width:58,height:63},
					'action':{width:87,height:63},
					'space':{width:198,height:63},
					'numkey':{width:116,height:63},
					'keypadding':6,
					'rowpadding':2,
					'keypadding-pinentry':4,
					'rowpadding-pinentry':1
				},
				'small':{
					'container':{width:522,height:331},
					'key':{width:52,height:63},
					'action':{width:77,height:63},
					'space':{width:176,height:63},
					'numkey':{width:116,height:63},
					'keypadding':4,
					'rowpadding':4,
					'keypadding-pinentry':4,
					'rowpadding-pinentry':1
				}
			},
			KeyImageSources: {}
		}
	};

	var getCharacterDefinitionById = function (chardef_id) { return internals.Tables.CharacterDefinitions[chardef_id]; };
	var getKeyDefinitionById = function (keyid) { return internals.Tables.KeyDefinitions[keyid]; };
	var getDimensions = function () {  return internals.Tables.ControlDimensions[internals[this._classID].state.controlSize]; };

	var getClassnameByKeyId = function (key_id) {
		var type = '',
			dims = getDimensions.call(this);
		switch (key_id) {
			case "action-nextlayout":
			case "action-shift":
			case "action-extended":
			case "action-backspace":
				type = "action";
				// special case for large backspace key in numpad layout
				if (internals[this._classID].state.currentLayout.isNumeric) {
					type = "numkey";
				}
				break;
			case "key-space":
				type = "space";
				break;
			case "numkey":
			case "spacer-numkey":
				type = "numkey";
				break;
			default:
				break;
		}

		if (key_id && key_id.indexOf('numkey-') === 0)
			type = "numkey";

		if (key_id && key_id.indexOf('key-')===0 && !type)
			type = "key";

		return type;
	};

	var setAvailableLayouts = function (input){
		var sets = internals.Tables.KeyLayoutSets,
			layouts = internals.Tables.KeyLayouts,
			internal = internals[this._classID];
		
		if (!input) input = 'normal';
		if (typeOf(input) === 'string') input = sets[input] || [input];
		
		internal.availableLayouts = input.map(function(id){
			return layouts.filter(function(kl){return kl.id==id;})[0];
		});
		
		if (!internal.availableLayouts.length) {
			//log('setAvailableLayouts - bad input',JSON.stringify(input));
			internal.availableLayouts = sets.normal.map(function(id){
				return layouts.filter(function(kl){return kl.id==id;})[0];
			});
		}
	};

	var getLayoutById = function (layout_id) {
		return internals.Tables.KeyLayouts.filter(function(kl) {
			return kl.id == layout_id;
		})[0];
	};

	var getNextLayout = function () {
		var internal = internals[this._classID],
			layouts = internal.availableLayouts,
			current = layouts.indexOf(internal.state.currentLayout);

		if (current < 0) {
			return internal.state.currentLayout;
		}

		var next = current + 1 < layouts.length ? current + 1 : 0;
		return layouts[next];
	};

	var onBodyGainFocus = function (event) {
		var internal = internals[this._classID];
		focusNewKey.call(this, internal.state.current_focused_key, internal.body.firstChild.firstChild);
	};

	var onBodyLoseFocus = function (event) {
		if (internals[this._classID].state.current_focused_key)
			internals[this._classID].state.current_focused_key.removeClass('focused');
	};

	var focusNewKey = function (keyframe, target) {
		var state = internals[this._classID].state;
		state.current_focused_key = keyframe || target;
		state.current_focused_key.focus();
	};

	var updateKeyframe = function (keyframe, keyid, options) {
		var internal = internals[this._classID],
			keydef = getKeyDefinitionById(keyid),
			label,
			sublabel,
			code,
			glyph;

		keyframe.store('definition', keydef);
		keyframe.store('keyid', keyid);

		if (keyid.indexOf('spacer-') === 0) {
			keyframe.opacity = 0;
			keyframe.wantsFocus = false;
			return;
		}

		if (keyid.indexOf('action-') === 0) {
			label = keyid === 'action-nextlayout' ? getNextLayout.call(this).label : keydef.label;
			code = keydef.code || label;
		} else {
			var chardef_id = keydef[internal.state.showShift ? 'shift' : 'normal'];
			var chardef = getCharacterDefinitionById(chardef_id);

			label = chardef.label;
			code = chardef.code || label;
			sublabel = chardef.sublabel;
			glyph = chardef.glyph ? true : glyph;
		}

		if (label) {
			var labelEl = keyframe.retrieve('label');
			if (!labelEl) {
				labelEl = (new Text()).inject(keyframe);
				labelEl.addClass('ReuseKeyboardLabel');
				keyframe.store('label', labelEl);
			}

			var keyinfo = keyframe.retrieve('key');
			internal.indexing['key-' + code] = keyinfo && keyinfo.key || 0;

			if (label === 'space') {
				labelEl.data = widget.getLocalizedString('SPACE');
			} else {
				labelEl.data = label;
			}
		}

		var show_key = false;
		if (internal.state.showExtended) {
			if (keydef.extended && !internal.extendedOverlay.visible) show_key = true;
			if (keyframe.retrieve('key').row === 'control' && !internal.extendedOverlay.visible) { show_key = true; }
		} else {
			show_key = true;
		}

		keyframe.disabled = show_key ? false : true;

		if (keyid === 'action-extended') { keyframe.disabled = internal.state.currentLayout.noExtended ? true : keyframe.disabled; }
		if (keyid === 'action-shift') { keyframe.disabled =  internal.state.currentLayout.noShift ? true : keyframe.disabled; }
		if (keyid === 'action-nextlayout') { keyframe.disabled = internal.state.showExtended ? true : keyframe.disabled; }
	};

	var updateExtendedKeyframe = function (keyframe, chardef_id) {
		var chardef = getCharacterDefinitionById(chardef_id);

		if (!chardef && chardef_id=='action-closeextendedpanel') chardef = getKeyDefinitionById(chardef_id);
		
		var label = chardef.label,
			sublabel = chardef.sublabel,
			glyph = null;//_getGlyphSource( chardef.glyph );

		keyframe.store('definition', chardef);
		keyframe.store('keyid', chardef_id);

		var labelEl = keyframe.retrieve('label');
		if (!labelEl) {
			labelEl = (new Text()).inject(keyframe);
			labelEl.addClass('ReuseKeyboardLabel');
			keyframe.store('label', labelEl);
		}

		if (label && labelEl) {
			labelEl.data = label;
		} else if (labelEl) {
			labelEl.data = "";
		}
		/*
		if (sublabel) {
			keyframe._sublabel = keyframe._sublabel || keyframe.appendChild( new Text() );
			keyframe._sublabel.data = sublabel;
		} else if (keyframe._sublabel) {
			keyframe._sublabel.data = "";
		}
		
		if (glyph) {
			keyframe._glyph = keyframe._glyph || keyframe.appendChild( new Image() );
			keyframe._glyph.src = glyph;
		} else if (keyframe._glyph) {
			keyframe._glyph.src = null;
		}*/
	};

	var grabKeyAt = function (row, key) {
		var k = NavMap[row] && NavMap[row][key];
		if (typeOf(k) === 'number' && k > 0) {
			return internals[this._classID].body.firstChild.childNodes.item(k - 1);
		}
		
	};

	var getNavTarget = function (dir, cur) {
		var target = {};
			
		return target;
	};

	var onBodyNavEvent = function (dir, event) {
		var current = internals[this._classID].state.current_focused_key,
			target = getNavTarget(dir);

		if (!target.release) {
			var candidate = grabKeyAt(target.row, target.key),
				opacity = candidate && candidate.getStyle('opacity') || 1;

			//log('candidate', candidate, opacity, current, candidate && opacity == 1,candidate !== current);
			if (candidate && (opacity == 1) && candidate !== current) {
				focusNewKey(candidate, target);
			}
		}
		if (!target.release) {
			event.preventDefault();
		}
	};

	var checkForFocus = function (key) {
		var internal = internals[this._classID],
			index = internal.indexing['key-'+key];
		if (isNumber(index)) {
			var child = internal.body.firstChild.childNodes[index];
			if (!child.disabled) {
				child.focus();
				child.select();
				return true;
			}
		}
		return false;
	};

	var onBodyKeyDown = function (event) {
		var target = event.target;
		//log('onBodyKeyDown', event, event.keyCode, event.key, event.isChar);
		//target.owner.fireEvent('keydown', event);
		if (event.isChar || event.isNumeric) {
			if (!checkForFocus.call(target.owner, event.key))
				return target.owner.appendToValue(event.key);
		} else if (this.visible){
			switch (event.key) {
				case 'shift':
					if (!internals[target.owner._classID].state.currentLayout.noShift && !internals[target.owner._classID].state.showShift) {
						target.owner.setShiftState(true);
					}
					break;
				case 'back':
				case 'delete':
					event.preventDefault();
					if (!checkForFocus.call(target.owner, event.key))
						return target.owner.deleteFromValue();
					break;
				case 'space':
					if (!checkForFocus.call(target.owner, event.key))
						return target.owner.appendToValue(' ');
					break;
			}
		}
		return event;
	};

	var onBodyKeyUp = function (event) {
		var target = event.target;
		if (event.key === 'shift') {
			var internal = internals[target.owner._classID];
			if (!internal.state.currentLayout.noShift) {
				target.owner.setShiftState(false);
			}
		}
	};

	var generateExtendedOverlay = function (key) {
		var internal = internals[this._classID], 
			overlay = internal.extendedOverlay || new Frame(),
			//dims = getDimensions,
			definition = key.retrieve('definition')[internal.state.showShift ? 'shiftextended' : 'extended'] || [],
			character_ids = definition.slice();

		character_ids.push('action-closeextendedpanel');

		overlay.store('type', 'view');
		overlay.addClass('extendedOverlay');
		overlay.store('focusTarget', key.retrieve('key').key || 0);
		var list = (new List()).inject(overlay),
			fragment = createDocumentFragment();

		character_ids.forEach(function (char_id, c) {
			var keyframe = new Item({ focus: true }),
			//	className = this.ClassName+getClassnameByKeyId(value.keyid),
			//	styles = Theme.getStyles(className) || {},
				row_height = 0;
			keyframe.addClass('ReuseKeyboardkey');
			if (this.config.controlSize === 'small') {
				keyframe.addClass('small');
			}
			keyframe.addEventListener('select', onBodySelectEvent, this);
			keyframe.owner = key.owner;
			fragment.appendChild(keyframe);
			updateExtendedKeyframe.call(this, keyframe, char_id);
		}, this);

		list.appendChild(fragment);

		var keyBounds = key.getBounds(),
			keyinfo = key.retrieve('key'),
			posClass = this,
			classBounds = posClass.element.getBounds(),
			voffsetC = classBounds.top,
			hoffsetC = classBounds.left,
			spillover = Math.min(0, (keyinfo.keysonrow - keyinfo.column) - character_ids.length),
			keyWidth = internal.body.width / keyinfo.keysonrow;

		overlay.hOffset = keyBounds.left - hoffsetC - (posClass.width - internal.body.width) + (spillover * keyWidth) || 0;
		overlay.vOffset = keyBounds.top - voffsetC || 0;
		overlay.width = list.width = keyWidth * character_ids.length;
		list.height = Theme.getStyles('extendedOverlay', 'height');
		internal.body.appendChild(overlay);
		internal.body.firstChild.allowNavigation = false;
		overlay.visible = true;
		focusNewKey.call(this, overlay.lastChild.firstChild);
	};

	var removeExendedOverlay = function () {
		var internal = internals[this._classID],
			overlay = internal.extendedOverlay.firstChild;
		overlay.destroy(true);
		internal.extendedOverlay.visible = false;
		internal.body.firstChild.allowNavigation = true;
	};

	var generateKeyDown = function (keytype, keyvalue, shift) {
		var packet = {};
		switch (keytype) {
			case 'key':
			case 'numkey':
				packet.shiftKey = shift;
				packet.isChar = true;
				packet.isNumeric = true;
				packet.key = keyvalue;
				packet.keyCode = 13;
				break;
			case 'char':
				packet.shiftKey = shift;
				packet.isChar = true;
				packet.key = keyvalue;
				packet.keyCode = 13;
				break;
			case 'backspace':
				packet.key = 'back';
				break;
		}
		this.fireEvent('keydown', packet);
	};

	var onBodySelectEvent = function (event) {
		var internal = internals[this.owner._classID || event.target.owner._classID],
			current  = event.target || internal.state.current_focused_key,
			keydef   = current.retrieve('definition')||current._characterDefinition,
			verb     = String(current.retrieve('keyid')||current._charDefId).split('-')[0],
			subject  = String(current.retrieve('keyid')||current._charDefId).split('-')[1],
			shift    = internal.state.showShift,
			chardef  = null,
			refocus  = null,
			coords   = null,
			extended = internal.state.showExtended;

		//log('onBodySelectEvent',current.retrieve('key'), keydef, verb, subject, shift, chardef, coords, extended);
		switch (verb) {
			case 'key':
			case 'numkey':
				if (extended && subject !== 'space') {
					generateExtendedOverlay.call(this.owner, current);
					current.owner.fire('extendedselect');
				} else {
					chardef = getCharacterDefinitionById(keydef[ shift ? 'shift' : 'normal' ]);
					current.owner.appendToValue(chardef.value || '');
					generateKeyDown.call(current.owner, verb, chardef.value, shift);
				}
				break;
			case 'char':
				refocus = internal.extendedOverlay.retrieve('focusTarget');
				current.owner.appendToValue(keydef.value || '');
				generateKeyDown.call(current.owner, verb, keydef.value, shift);
				current.owner.toggleExtended();
				if (shift) {
					current.owner.toggleShift();
				}
				removeExendedOverlay.call(this.owner);
				if (isNumber(refocus)) {
					internal.body.firstChild.childNodes[refocus].focus();
				}
				break;
			case 'action':
				switch (subject) {
					case 'shift':
						current.owner.toggleShift();
						break;
					case 'extended':
						current.owner.toggleExtended();
						break;
					case 'backspace':
						current.owner.deleteFromValue();
						generateKeyDown.call(current.owner, subject);
						break;
					case 'nextlayout':
						current.owner.loadLayout(getNextLayout.call(this.owner), { focusTarget: current.retrieve('key').key });
						break;
					case 'closeextendedpanel':
						refocus = internal.extendedOverlay.retrieve('focusTarget');
						current.owner.toggleExtended();
						removeExendedOverlay.call(this.owner);
						if (isNumber(refocus)) {
							internal.body.firstChild.childNodes[refocus].focus();
						}
						break;
				}
				break;
		}
	};

	var sendSignal = function (event) {
		//log('sendSignal', this, event.type, event.target);
		var el = internals[this._classID].body.firstChild.firstChild;
		do {
			if (el.nodeType === 1) {
				updateKeyframe.call(this, el, el.retrieve('keyid'), event.type === 'shiftselect' ? 'shift' : 'extended');
			}
			el = el.nextSibling;
		} while (el);
	};

	var EventMap = {
		space:              'onSpace',
		keydown:            'onKeyDown',
		backspace:          'onBackspace',
		valuechanged:       'onValueChanged',
		layoutchanged:      'onLayoutChanged',
		shiftselect:        'onShiftSelect',
		extendedselect:     'onExtendedSelect',
		closeextendedpanel: 'onCloseExtendedPanel',
		maxlengthexceeded:  'onMaxLengthExceeded'
	};
	return new MAF.Class({
		ClassName: 'ReuseKeyboard',
		Extends: MAF.element.Core,

		config: {
			controlSize: 'standard',
			autoAdjust: true,
			allowSpace: true,
			maxLength: 99,
			keyPadding: false,
			rowPadding: false,
			wrapNavigation: true
		},

		initialize: function () {
			var internal = internals[this._classID] = {
				value: [],
				body: new Frame({
					frozen: true
				}),
				extendedOverlay: new Frame(),
				state: {
					showShift: false,
					showExtended: false,
					controlSize: this.config.controlSize
				}
			};
			this.config.element = internals[this._classID].body;
			this.parent();

			['CharacterDefinitions', 'KeyDefinitions', 'KeyLayouts', 'KeyLayoutSets', 'ControlDimensions', 'KeyLabelPresentation', 'KeyImageSources'].forEach(function(table_name){
				if (this.config[table_name]) {
					internals.Tables[table_name] = this.config[table_name];
				}
			}, this);

			this.body = new List();

			this.body.inject(this.element);
			//log('---ReuseKeyboard Internals----', internals);
			setAvailableLayouts.call(this, this.config.availableLayouts);

			var body = internal.body;
			body.addEventListener('focus', onBodyGainFocus);
			body.addEventListener('blur', onBodyLoseFocus);
			body.addEventListener('keydown', onBodyKeyDown, this);
			body.addEventListener('keyup', onBodyKeyUp, this);
			// Send back navigation to parent if outofbounds
			body.addEventListener('navigateoutofbounds', function(event) {
				var direction = event.detail && event.detail.direction,
					target = event.target,
					bodyBounds = body.getBounds() || {},
					targetBounds = target.getBounds() || {};
				switch (direction) {
					case 'left':
						target.navigate(direction, [bodyBounds.width || 0, targetBounds.top || 0]);
						break;
					case 'right':
						target.navigate(direction, [bodyBounds.left || 0, targetBounds.top || 0]);
						break;
				}
			});

			sendSignal.subscribeTo(this, ['shiftselect', 'extendedselect'], this);

			internal.extendedOverlay.visible = false;

			if (this.config.startShifted) {
				internal.state.showShift = true;
			}

			this.setValue(this.config.value);

			this.loadLayout(this.config.layout || internal.availableLayouts[0]);

			if (this.config.startFocused) {
				this.focus();
			}
		},
		appendTo: function (node) {
			if (node) {
				var body = internals[this._classID].body;
				body.inject(node);
				body.frozen = false;
			}
			return this;
		},
		loadLayout: function (layout, options) {
			var internal = internals[this._classID];

			layout = typeOf(layout) === 'string' ? getLayoutById(layout) : layout;
			if (internal.state.currentLayout === layout) {
				return;
			}

			options = options || {};

			var refocus = false;
			var dims = getDimensions.call(this);
			internal.indexing = {};

			internal.state.currentLayout = layout;

			if (this.body) {
				this.body.destroy(true);
				this.body = (new List()).inject(internal.body, 'top');
			}

			var row_max = 0,
				column_max = 0,
				key_idx = 0,
				fragment = createDocumentFragment();

			if (this.config.autoAdjust) {
				var externalStyles = Theme.getStyles('ReuseKeyboard .item'),
					externalWidth = 0,
					externalHeight = 0;

				['border', 'borderLeftWidth', 'borderRightWidth', 'marginLeft', 'marginRight'].forEach(function (type) {
					var value = (type === 'border') ? parseInt(externalStyles[type], 10) * 2 : externalStyles[type];
					externalWidth += value || 0;
				}, this);
				['border', 'borderTopWidth', 'borderBottomWidth', 'marginTop', 'marginBottom'].forEach(function (type) {
					var value = (type === 'border') ? parseInt(externalStyles[type], 10) * 2 : externalStyles[type];
					externalHeight += value || 0;
				}, this);
			}
			layout.keyrows.forEach(function (row, rowKey) {
				var running_width = 0,
					running_height = 0;

				row.forEach(function (value, columnKey) {
					var keyframe = new Item({ focus: true }),
						className = this.ClassName + getClassnameByKeyId.call(this, value.keyid),
						styles = (this.config.controlSize === 'small') ? Theme.getStyles(className, 'small') || {} : Theme.getStyles(className),
						row_height = 0;
					keyframe.addClass(className);
					if (this.config.controlSize === 'small') {
						keyframe.addClass('small');
					}
					keyframe.addEventListener('select', onBodySelectEvent, this);
					keyframe.owner = this;
					fragment.appendChild(keyframe);

					keyframe.store('key', { row: rowKey, column: columnKey, key: key_idx++, keysonrow: row.length || 0 });
					updateKeyframe.call(this, keyframe, value.keyid);

					if (this.config.autoAdjust) {
						running_width += externalWidth + styles.width || 0;
						row_height += externalHeight + styles.height || 0;

						running_height = Math.max(row_height, running_height);
					}
				}, this);

				row_max = Math.max(row_max, running_width);
				column_max += running_height;
			}, this);

			// Most keys are in the keyrows, so only keyrows are used in calculation the width of the keyboard when autoAdjust is set.
			var control_height = 0;
			layout.controlrow.forEach(function (value, columnKey) {
				var keyframe = new Item({ focus: true }),
					className = this.ClassName + getClassnameByKeyId.call(this, value.keyid),
					styles = (this.config.controlSize === 'small') ? Theme.getStyles(className, 'small') || {} : Theme.getStyles(className),
					row_height = 0;

				keyframe.addClass(className);
				if (this.config.controlSize === 'small') {
					keyframe.addClass('small');
				}
				keyframe.addEventListener('select', onBodySelectEvent, this);
				keyframe.owner = this;
				fragment.appendChild(keyframe);

				keyframe.store('key', { row: 'control', column: columnKey, key: key_idx++ });
				updateKeyframe.call(this, keyframe, value.keyid);

				if (this.config.autoAdjust) {
					row_height += externalHeight + styles.height || 0;
					control_height = Math.max(row_height, control_height);
				}

			}, this);
			column_max += control_height;

			this.setStyles({
				width: this.config.autoAdjust ? row_max : dims.container.width,
				height: this.config.autoAdjust ? column_max : dims.container.height
			});
			this.body.setStyles({
				width: this.config.autoAdjust ? row_max : dims.container.width,
				height: this.config.autoAdjust ? column_max : dims.container.height
			});

			this.body.appendChild(fragment);

			if (options.focusTarget) {
				this.body.childNodes[options.focusTarget].focus();
			}
		},
		getValue: function () {
			if (USE_INPUT_METHOD) {
				return;
			}
			return internals[this._classID].value.join('');
		},
		setValue: function (value) {
			if (USE_INPUT_METHOD) {
				return;
			}

			var oldval = this.getValue(),
				newval = String(value||''),
				maxlen = parseInt(this.config.maxLength, 10);

			if (!this.config.allowSpace) {
				value.replace(/\s/g,"");
			}
			
			if (newval.length > maxlen) {
				this.fire('maxlengthexceeded');
				newval.length = maxlen;
			}
			
			internals[this._classID].value = newval.split('');

			if (oldval != newval) {
				this.fireEvent('valuechanged', {oldValue:oldval,newValue:newval});
			}
			return newval;
		},
		appendToValue: function (characters) {
			if (USE_INPUT_METHOD) {
				return;
			}
			return this.setValue(this.getValue() + String(characters||''));
		},
		deleteFromValue: function (count) {
			if (USE_INPUT_METHOD) return;
			count = parseInt(count, 10) || 1;
			var value = internals[this._classID].value.slice();
			value.length = Math.max(0, value.length - count);
			return this.setValue(value.join(''));
		},
		clearValue: function () {
			if (USE_INPUT_METHOD) return;
			return this.setValue('');
		},
		setShiftState: function (state) {
			var internal = internals[this._classID];
			return internal.state.showShift === Boolean(state) ? internal.state.showShift : this.toggleShift();
		},
		getShiftState: function () {
			return internals[this._classID].state.showShift;
		},
		toggleShift: function () {
			var internal = internals[this._classID];
			internal.state.showShift = !internal.state.showShift;
			this.fire('shiftselect');
		},
		setExtendedState: function (state) {
			var internal = internals[this._classID];
			return internal.state.showExtended === Boolean(state) ? internal.state.showExtended : this.toggleExtended();
		},
		getExtendedState: function () {
			return internals[this._classID].state.showExtended;
		},
		toggleExtended: function () {
			var internal = internals[this._classID];
			internal.state.showExtended = !internal.state.showExtended;
			this.fire('extendedselect');
		},
		focus: function () {
			onBodyGainFocus.call(this);
		},
		resetFocus: emptyFn,
		clearFocus: function () {
			internals[this._classID].state.current_focused_key = null;
		},
		fireEvent: function (type) {
			var args = Array.slice(arguments,1);
			this.fire(arguments);
			var dom = this[EventMap[type]];
			if (dom && dom.apply) {
				dom.apply(this,args);
			}
		},
		reset: function (options) {
			var internal = internals[this._classID];
			removeExendedOverlay.call(this);
		
			options = options || {};
			for (var n in options) {
				this.config[n] = options[n];
			}
			internal.state.controlSize = this.config.controlSize;
			internal.state.showShift = this.config.startShifted===true;
			this.fire('shiftselect');
		
			internal.state.showExtended = this.config.startExtended===true;
			this.fire('extendedselect');

			if (internal.state.current_focused_key) {
				internal.state.current_focused_key._applyState('normal');
			}

			internal.state.current_focused_key = null;

			this.setValue(this.config.value || '');

			this.loadLayout(this.config.layout || internal.availableLayouts[0] );

			if (this.config.startFocused) {
				this.focus();
			}
		},
		suicide: function () {
			Object.forEach(EventMap, function (value, key) {
				if (this[key]) {
					delete this[key];
				}
			}, this);
			this.element.owner = this;
			var internal = internals[this._classID],
				body = internal.body.firstChild,
				overlay = internal.extendedOverlay;
			if (body) {
				body.destroy(true);
			}
			if (overlay) {
				delete internal.overlay;
				overlay.destroy();
			}
			delete internal.body;
			delete internals[this._classID];
			this.parent();
		}
	});
}, {
	ReuseKeyboard: {
		normal: {
			styles: {
				width: 'inherit'
			}
		}
	},
	'ReuseKeyboard .item': {
		normal: {
			styles: {
				border: '2px solid white',
				backgroundColor: 'black',
				borderRadius: '10px',
				boxSizing: 'content-box',
				marginLeft: 2,
				marginRight: 2,
				marginBottom: 2,
				'float': 'left'
			}
		},
		focused: {
			styles: {
				backgroundColor: Theme.getStyles('BaseFocus', 'backgroundColor')
			}
		},
		disabled: {
			styles: {
				opacity: 0.3
			}
		}
	},
	ReuseKeyboardkey: {
		normal: {
			styles: {
				width: 57,
				height: 63
			}
		},
		small: {
			styles: {
				width: 52,
				height: 63
			}
		}
	},
	ReuseKeyboardaction: {
		normal: {
			styles: {
				width: 87,
				height: 63
			}
		},
		small: {
			styles: {
				width: 82,
				height: 63
			}
		}
	},
	ReuseKeyboardspace: {
		normal: {
			styles: {
				width: 196,
				height: 63
			}
		},
		small: {
			styles: {
				width: 171,
				height: 63
			}
		}
	},
	ReuseKeyboardnumkey: {
		normal: {
			styles: {
				width: 116,
				height: 63
			}
		},
		small: {
			styles: {
				width: 116,
				height: 63
			}
		}
	},
	ReuseKeyboardLabel: {
		styles: {
			width: 'inherit',
			height: 'inherit',
			fontSize: 32,
			anchorStyle: 'center'
		}
	},
	extendedOverlay: {
		styles: {
			height: 67/*,
			background: 'url(' + Image.WHITE + ')',
			backgroundSize: '90% 50%',
			backgroundPosition: 'center',
			backgroundRepeat: 'no-repeat'*/
		}
	}
});
