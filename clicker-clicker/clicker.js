var database = firebase.database()
var origGameDiv = $("#game").clone();
dropFunc = function(event, ui) {
  if (placed[parseInt($(this).parent().attr("data-id"))] < limit) {
    placed[parseInt($(this).parent().attr("data-id"))]+=1
    available[parseInt(ui.draggable.attr("data-id"))] -= 1
    placedDrag[parseInt(ui.draggable.attr("data-id"))][parseInt($(this).parent().attr("data-id"))]+=1
    ui.draggable.draggable("disable")
    $("#available").text(parseInt($("#available").text())-1)
    cps += cpsList[parseInt(ui.draggable.attr("data-id"))]*cpsList[parseInt($(this).attr("data-id"))]
    $("#cps").text(Math.round(cps*10)/10)
  } else {
    ui.draggable.draggable({revert: true})
    setTimeout(function() {ui.draggable.draggable({revert: false})}, 500)
  }
  saveGame()
}
setVars = function() {
  limit = 10
  cps = 0
  costMultipliers = {
    0: 1.1,
    1: 1.2,
    2: 1.5,
    3: 2,
    4: 4,
    5: 10,
    6: 1.5,
    7: 1.7,
    8: 2
  }
  available = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0
  }
  cpsList = {
    0: 1,
    1: 5,
    2: 25,
    3: 1.5,
    4: 1.5,
    5: 2,
    6: 1,
    7: 2,
    8: 5
  }
  placed = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0
  }
  buttons = {
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false
  }
  placedDrag = {
    0: {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0},
    1: {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0},
    2: {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0},
    3: {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0},
    4: {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0},
    5: {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0},
    6: {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0},
    7: {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0},
    8: {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0},
  }
  clickCount = 0;
  costs = {
    0: 50,
    1: 250,
    2: 1500,
    3: 10000,
    4: 20000,
    5: 100000000,
    6: 500,
    7: 1000,
    8: 2500
  }
  owned = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0
  }
  files = {
    0: "arrow.svg",
    1: "hand.svg",
    2: "hourglass.svg"
  }
  names = {
    0: "Arrow",
    1: "Hand",
    2: "Hourglass",
    3: "Click Upgrade",
    4: "Multiplier Upgrade",
    5: "CPS Upgrade",
    6: "Button",
    7: "Advertisement",
    8: "Fake News"
  }
  $("#tabs").tabs();
  $(".itemImg").attr("src", function() {
    return files[parseInt($(this).parent().parent().attr("data-id"))]
  })
  $(".cost").text(function() {
    return costs[parseInt($(this).parent().parent().attr("data-id"))]
  })
  $(".name").text(function() {
    return names[parseInt($(this).parent().parent().attr("data-id"))]
  })
  $(".cpsNum").text(function() {
    return Math.round(cpsList[parseInt($(this).parent().parent().attr("data-id"))]*10)/10
  })
  $(".droppable").droppable({drop: dropFunc})
  $(".owned").text(function() {
    return owned[parseInt($(this).parent().parent().attr("data-id"))]
  })
}
$(setVars)
function clickLoop() {
  setTimeout(function() {
    addClicks(cps)
    clickLoop()
  }, 1000)
}
clickLoop()

function updateText() {
  $(".cpsNum").text(function() {
    return Math.round(cpsList[parseInt($(this).parent().parent().attr("data-id"))]*10)/10
  })
  $(".cost").text(function() {
    return costs[parseInt($(this).parent().parent().attr("data-id"))]
  })
  $(".owned").text(function() {
    return owned[parseInt($(this).parent().parent().attr("data-id"))]
  })
}

function addClicks(clicks) {
  clickCount += clicks
  $("#clicks").text(Math.round(clickCount))
}

function recalcCps() {
  var newCps = 0;
  for (var c in placedDrag) {
    for (var b in placedDrag) {
      var mult = cpsList[parseInt($(".buttonContainer[data-id="+b+"]").children().first().attr("data-id"))]
      if (mult) {
        newCps += placedDrag[c][b]*cpsList[c]*mult
      }
    }
  }
  var twice = owned[5]
  for (var t = 0; t < twice; t++) {
    newCps *= cpsList[5]
  }
  cps = newCps
  $("#cps").text(Math.round(cps*10)/10)
  $(".cpsNum").text(function() {
    return Math.round(cpsList[parseInt($(this).parent().parent().attr("data-id"))]*10)/10
  })
}

function buy(item) {
  if (clickCount >= costs[item] && (item < 6 || (owned[6]+owned[7]+owned[8] < 8))) {
    clickCount -= costs[item]
    costs[item] = Math.round(costs[item]*costMultipliers[item])
    $(".cost").text(function() {
      return costs[parseInt($(this).parent().parent().attr("data-id"))]
    })
    $("#clicks").text(Math.round(clickCount))
    $("tr[data-id="+item+"] .owned").text(++owned[item])
    place(item)
    saveGame()
  }
}

var adActions = ["Lose all your weight", "Save your phone", "Increase brain power by 50%", "Extend your life by 20 years"]
var adProfessions = ["Doctors", "Philanthropists", "Philosophers", "Geneticists", "Teachers"]
var adImages = ["phone.jpg", "shark.jpg", "fruit.jpg"]

var newsNames = ["Hillary Clinton", "Donald Trump", "Steve Jobs", "The mainstream media", "Mike Pence", "Bernie Sanders", "A dumb liberal", "Obama"]
var newsActions = ["just killed", "is attacking", "lied about", "left", "was attacked by", "was killed by"]
var newsAdjectives = ["space", "idiotic", "sad", "loser", "glorious", "the best"]
var newsNames2 = ["lobsters", "stupidity", "Jeremy", "gun violence", "zombies", "government officials", "North Korea"]
var newsImages = ["trump.jpg", "clinton.jpg", "whitehouse.jpg", "galaxy.jpg"]

function choose(list) {
  return list[Math.floor(Math.random()*list.length)]
}

function button(item) {
  if (item == 6) {
    return "<button data-id="+(item)+" class=\"button droppable\" onmouseup=\"addClicks("+cpsList[item]+")\">"+names[item]+"</button>"
  }
  if (item == 7) {
    return "<div onclick=addClicks("+cpsList[item]+") data-id="+(item)+" class=\"droppable ad\">"+choose(adActions)+" with this one easy trick!<br>"+"<img class=\"aImage\" src=clickbait/"+choose(adImages)+"></img><br>"+choose(adProfessions)+" hate him!</div>"
  }
  if (item == 8) {
    return "<div onclick=addClicks("+cpsList[item]+") data-id="+(item)+" class=\"droppable ad\">BREAKING: "+choose(newsNames)+" "+choose(newsActions)+" "+choose(newsAdjectives)+" "+choose(newsNames2)+"!<img class=\"newsImage\" src=news/"+choose(newsImages)+"></img></div>"
  }
}

function place(item, auto=false) {
  if (item < 6) {
    if (item < 3) {
      var strAuto = ""
      if (auto) {
        var strAuto = "auto"
      }
      $("#tray").prepend("<img data-id="+item+" draggable=\"false\" class=\"draggable placed "+strAuto+"\" src=\""+files[item]+"\"></img>")
      $(".draggable").css({"z-index": 99})
      $(".draggable").draggable()
      if (!auto) {
        available[item] += 1
        $("#available").text(parseInt($("#available").text())+1)
      }
    } else {
      if (item == 3) {
        for (var m = 0; m < 3; m++) {
          cpsList[m] *= cpsList[item]
        }
      } else if (item == 4) {
        for (var m = 6; m < 9; m++) {
          cpsList[m] *= cpsList[item]
        }
      } else {
        cps *= cpsList[item]
        $("#cps").text(Math.round(cps*10)/10)
      }
      recalcCps()
    }
  } else {
    $(".buttonContainer").each(function(index) {
      if (!$.trim($(this).html())) {
        $(this).html(button(item))
        $(".droppable").droppable({drop: dropFunc})
        buttons[index] = item
        return false;
      }
    })
  }
}

function saveGame() {
  if (firebase.auth().currentUser) {
    database.ref("users/"+firebase.auth().currentUser.uid+"/save").set({cps: cps, c: clickCount, placed: placedDrag, buttons: buttons, available: available, owned: owned, costs: costs})
  }
}

restore = function(save) {
  var save = save.val()
  if (save) {
    $("#game").replaceWith(origGameDiv.clone())
    setVars()
    clickCount = save.c
    cps = save.cps
    $("#cps").text(Math.round(cps*10)/10)
    buttons = save.buttons
    placedDrag = save.placed
    availableNow = save.available
    owned = save.owned
    costs = save.costs
    for (var b = 0; b < 9; b++) {
      if (buttons[b]) {
        place(save.buttons[b])
      }
    }
    for (var k = 0; k < 9; k++) {
      for (var b = 0; b < 9; b++) {
        placed[b] += placedDrag[k][b]
        var count = placedDrag[k][b]
        for (var c = 0; c < count; c++) {
          place(k, true)
        }
        if (placedDrag[k][b] != 0) {
          $(".auto[data-id="+k+"]").each(function() {$(this).css({left: $(".buttonContainer[data-id="+b+"]").children().first().position().left + $(".buttonContainer[data-id="+b+"]").children().first().width()/3 + Math.floor(Math.random()*($(".buttonContainer[data-id="+b+"]").children().first().width()/2)), top: $(".buttonContainer[data-id="+b+"]").children().first().position().top + Math.floor(Math.random()*($(".buttonContainer[data-id="+b+"]").children().first().height()/2))})})
          $(".auto[data-id="+k+"]").draggable("disable")
          $(".auto[data-id="+k+"]").removeClass("auto")
        }
      }
    }
    for (var a in availableNow) {
      for (var c = 0; c < parseInt(availableNow[a]); c++) {
        place(parseInt(a))
      }
    }
    for (var o = 3; o < 6; o++) {
      var count = owned[o]
      for (var c = 0; c < count; c++) {
        place(o)
      }
    }
    updateText()
  } else {saveGame()}
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    database.ref("users/"+user.uid+"/save").once("value").then(restore)
    $("#currentuser").text(user.email.slice(0,user.email.length-9))
  } else {$("#currentuser").text("")}
})

function login() {
  firebase.auth().signInWithEmailAndPassword($("#usernameIn").val()+"@kmh.zone", $("#passwordIn").val()).catch(function(error) {
    alert(error.message)
  })
}

function create() {
  firebase.auth().createUserWithEmailAndPassword($("#usernameIn").val()+"@kmh.zone", $("#passwordIn").val()).catch(function(error) {
    alert(error.message)
  })
  saveGame()
}

function signOut() {
  if (firebase.auth().currentUser) {
    saveGame()
  }
  $("#game").replaceWith(origGameDiv.clone())
  firebase.auth().signOut()
  setVars()
}

function clearSaveData() {
  if (firebase.auth().currentUser && prompt("Type \"yes\" if you want to clear all save data from your account. This cannot be undone") === "yes") {
    $("#game").replaceWith(origGameDiv.clone())
    setVars()
    saveGame()
  }
}
