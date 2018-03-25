function markov(order, dict, sentences, words, backoff) {
  var sentenceCount = 0;
  var maxSentenceCount = sentences;
  var key = getKey(order, words);
  while (sentenceCount < maxSentenceCount && key in dict) {
    word = dict[key][Math.floor(Math.random()*dict[key].length)];
    words.push(word);
    if (words[words.length-1][words[words.length-1].length-1] === ".") {
      sentenceCount += 1;
    }
    key = getKey(order, words);
  }
  return words.join(" ")
}

function getKey(order, list) {
  key = [];
  for (var i=order; i>=1; i--) {
    key.push(list[list.length-i]);
  }
  return key.join(" ");
}

function makeDict(order, text) {
  dict = {}
  text = text.split(/\s/)
  for (var i = 0; i < text.length-order; i++) {
    key = text.slice(i, i+order).join(" ")
    if (key in dict) {
      dict[key].push(text[i+order])
    } else {
      dict[key] = [text[i+order]]
    }
  }
  return dict
}

function getStartWords(order, text) {
  text = text.split(/\s/)
  var words = [text.slice(0, order)]
  for (var i = 0; i < text.length; i++) {
    if (text[i][text[i].length-1] === "." && text.length-i > order && text[i][text[i].length-2] !== ".") {
      words.push(text.slice(i+1, i+1+order))
    }
  }
  return words
}

function fillElements() {
  document.getElementById("sanity").value = sessionStorage.getItem("sanity")
  document.getElementById("sourceText").value = sessionStorage.getItem("text")
  document.getElementById("preset").value = sessionStorage.getItem("preset")
}

function makeSentence() {
  var order = parseInt(document.getElementById("sanity").value)
  var text = document.getElementById("sourceText").value
  var words = getStartWords(order, text)
  document.getElementById("output").innerHTML = markov(order, makeDict(order, text), 1, words[Math.floor(Math.random()*words.length)])
}

function fillText() {
  document.getElementById("sourceText").value = presets[document.getElementById("preset").value]
}

function setCustom() {
  document.getElementById("preset").value = "custom"
}

function buttonClick() {
  var order = parseInt(document.getElementById("sanity").value)
  var text = document.getElementById("sourceText").value
  var words = getStartWords(order, text)
  var quote = markov(order, makeDict(order, text), 1, words[Math.floor(Math.random()*words.length)])
  sessionStorage.setItem("quote", quote)
  sessionStorage.setItem("text", document.getElementById("sourceText").value)
  sessionStorage.setItem("preset", document.getElementById("preset").value)
  sessionStorage.setItem("sanity", document.getElementById("sanity").value)
  location.href = "quote.html"
}

function loadQuote() {
  document.getElementById("quote").innerHTML = sessionStorage.getItem("quote")
  var quote = document.getElementById("quote").innerHTML
  if (quote.length <= 65) {
    document.getElementById("quote").style["font-size"]= "10vw"
  } else if (quote.length <= 130) {
    document.getElementById("quote").style["font-size"] = "10vh"
  }
}
