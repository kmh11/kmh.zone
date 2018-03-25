var database = firebase.database();
var username = ""

function writeSpeed(userId, score) {
  database.ref("/users/"+firebase.auth().currentUser.uid+"/scores").push(score)
  database.ref("/scores").push({score: score, user: firebase.auth().currentUser.uid, name: userId})
}

function setUsername() {
  getTopAll()
  var tempusername = $("#nameInput").val()
  password = $("#passwordInput").val()
  firebase.auth().signOut();
  firebase.auth().createUserWithEmailAndPassword(tempusername+"@kmh.zone", password).catch(function(error) {
    var code = error.code;
    var message = error.message;
    if (code == "auth/weak-password") {
      alert("The password is too weak (make it at least 6 characters)")
    } else if (code == "auth/email-already-in-use") {
      firebase.auth().signInWithEmailAndPassword(tempusername+"@kmh.zone", password).catch(function(error) {
        alert(error.message);
      })
    } else if (code == "auth/invalid-email") {
      alert("Make sure you username only consists of letters and numbers.")
    } else {
      alert(message)
    }
  })
  firebase.auth().onAuthStateChanged(function(user) {
    username = tempusername
    database.ref("/users/"+user.uid+"/name").set(username)
    database.ref("/users/"+user.uid+"/scores").once("value").then(displayScores)
  });
}

function updateScores() {
  database.ref("/users/"+firebase.auth().currentUser.uid+"/scores").once("value").then(displayScores)
}

function showScores() {
  updateScores();
  getTopAll();
}

displayScores = function(scores) {
  scores = scores.val()
  scoreList = []
  var sum = 0
  for (s in scores) {
    sum += parseInt(scores[s])
    scoreList.push(scores[s])
  }
  scoreList.sort(function(a,b){return a-b})
  var top = scoreList[scoreList.length-1]
  var avg = Math.round(sum/scoreList.length*100)/100
  if (scoreList.length == 0) {
    top = 0;
    avg = 0;
  }
  $("#topScore").text(top+" ("+Math.round(top/5*100)/100+" cps)");
  $("#avgScore").text(avg+" ("+Math.round(avg/5*100)/100+" cps)");
}

function checkKey(event) {
	if (event.keyCode === 13) {
		setUsername()
	}
}

function imgClick() {
  if (clickStart == false) {
    bgColor()
    clickStart = true;
    $("#timer").text(5)
    setTimeout(
      function() {
        clickStart = false;
        $("#cursor").height("5em")
        $("#cps").text(clickCount/5)
        $("#cursor").off("click")
        if (firebase.auth().currentUser != null) {
          writeSpeed(username, clickCount);
          showScores()
        }
        clickCount = 0;
        setTimeout(
          function() {
            $("#cursor").click(function() {imgClick()})
          }, 1000
        );
      }, 5000
    );
    timer()
    $("#clicks").text(++clickCount)
  } else {
    bgColor()
    $("#clicks").text(++clickCount)
    $("#cursor").height($("#cursor").height()+20)
  }
}

function timer() {
  setTimeout(
    function() {
      if ($("#timer").text() != 0) {
        $("#timer").text($("#timer").text()-1)
        timer()
      }
    }, 1000
  )
}

window.onload = function() {
  clickStart = false;
  clickCount = 0;
  $("#cursor").click(function() {imgClick()})
  $("body").css("background-color","rgb("+r+","+b+","+g+")")
  firebase.auth().signOut()
  getTopAll()
}

colorStage = 0
r = 255
b = 0
g = 0
function bgColor() {
  for (var c = 0; c < 120; c++) {
    if (colorStage == 0) {
      if (g < 255) {
        g++
      } else {
        colorStage = 1
      }
    } else if (colorStage == 1) {
      if (r > 0) {
        r--
      } else {
        colorStage = 2
      }
    } else if (colorStage == 2) {
      if (b < 255) {
        b++
      } else {
        colorStage = 3
      }
    } else if (colorStage == 3) {
      if (g > 0) {
        g--
      } else {
        colorStage = 4
      }
    } else if (colorStage == 4) {
      if (r < 255) {
        r++
      } else {
        colorStage = 5
      }
    } else if (colorStage == 5) {
      if (b > 0) {
        b--
      } else {
        colorStage = 0
      }
    }
    $("body").css("background-color","rgb("+r+","+g+","+b+")")
  }
}

displayTopAll = function(scores) {
  max = false
  scores = scores.val()
  for (s in scores) {
    if (max == false) {
      max = s
    } else {
      if (scores[s]["score"] > scores[max]["score"]) {
        max = s
      }
    }
  }
  var top = scores[max]["score"]
  $("#allTop").text(top+" ("+Math.round(top/5*100)/100+" cps) by "+scores[max]["name"])
}

function getTopAll() {
  database.ref("/scores").once("value").then(displayTopAll)
}
