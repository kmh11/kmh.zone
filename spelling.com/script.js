var phoneticA = {"a": "ay", "b": "bee", "c": "see", "d": "dee", "e": "ee", "f": "eff", "g": "jee", "h": "aitch", "i": "eye",
  "j": "jay", "k": "kay", "l": "ell", "m": "em", "n": "en", "o": "oh", "p": "pee", "q": "cue", "r": "are", "s": "ess",
  "t": "tee", "u": "yoo", "v": "vee", "w": "double-you", "x": "ex", "y": "why", "z": "zee", " ": "space", "%": "percent", "&": "ampersand",
  "#": "pound", "$": "dollar", "@": "at", "!": "exclamation-point", "(": "parantha-see", ")": "parantha-see", "*": "asterisk", "^": "care-ot",
  ".": "dot", "?": "question-mark", "-": "dash"
}

var audio = new Audio();
var date = new Date();
var tomorrow =  new Date();
tomorrow.setDate(date.getDate()+1)
spell = function() {
  var word = getQueryVariable("w")
  if (word) {
    spellWord(word)
  } else {
    document.getElementsByClassName("wotdHolder_box")[0].innerHTML = "<p id='wotdDesc' class='wotdHolder_word wotdHolder_word-small' style='padding: 0; margin: 0;'><i>Spelling.com</i> Word Of Tomorrow:</p><br>"+document.getElementsByClassName("wotdHolder_box")[0].innerHTML
    $jsonp.send('/api/wordoftheday.jsonp?api_key=KgprXEYKVnNSFSZ&past=0&future=1&crossDomain=true&dataType=jsonp&year='+date.getUTCFullYear()+'&month='+(date.getUTCMonth()+1)+'&day='+date.getUTCDate()+'&callback=jQuery21405083950325741895_1487445622479', {        callbackName: 'jQuery21405083950325741895_1487445622479',
        onSuccess: function(json){
            wotd = json.wordoftheday.results[tomorrow.getUTCFullYear()+"-"+("0"+(tomorrow.getUTCMonth()+1)).slice(-2)+"-"+("0"+(tomorrow.getUTCDate())).slice(-2)].word;
            spellWord(wotd)
        },
        onTimeout: function(){
            console.log('timeout!')
        },
        timeout: 5
    });
  }
}

function spellWord(word) {
  word = word.toLowerCase().replace(/%20/g, " ")
  document.getElementById("q").value = word;
  try {
    document.getElementsByClassName("wotdHolder_word")[1].innerHTML = word;
  } catch (e) {
    document.getElementsByClassName("wotdHolder_word")[0].innerHTML = word;
  }

  spelling = "<ol style=\"font-size: 2em; margin-left: 1.5em;\">"
  var dashed = ""
  var phonetic = ""
  for (char in word) {
    spelling += "<li><b>"+word[char]+"</b></li>"
    dashed+=word[char].toUpperCase()+"-"
    phonetic+=phoneticA[word[char].toString()]+"-"
  }
  document.getElementById("spelling").innerHTML = spelling+"</ol>"
  document.getElementById("dashed").innerHTML = dashed.slice(0,dashed.length-1)
  document.getElementById("phonetic").innerHTML = phonetic.slice(0,phonetic.length-1)
}

search = function() {
  window.location = window.location.href.split("?")[0]+"?w="+document.getElementById("q").value
}

function getQueryVariable(variable) {
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

window.onload = spell;

var $jsonp = (function(){
  var that = {};

  that.send = function(src, options) {
    var callback_name = options.callbackName || 'callback',
      on_success = options.onSuccess || function(){},
      on_timeout = options.onTimeout || function(){},
      timeout = options.timeout || 10; // sec

    var timeout_trigger = window.setTimeout(function(){
      window[callback_name] = function(){};
      on_timeout();
    }, timeout * 1000);

    window[callback_name] = function(data){
      window.clearTimeout(timeout_trigger);
      on_success(data);
    }

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = src;

    document.getElementsByTagName('head')[0].appendChild(script);
  }

  return that;
})();
