window.onload = function() {
  canvas = document.getElementById("canvas")
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  canvas.style.position = "absolute"
  ctx = canvas.getContext("2d")
  setup()

  document.getElementById("cmdInput").onclick = function() {
    document.getElementById("cmdInput").innerHTML = ""
  }

  document.getElementById("cmdInput").onkeyup = function (e) {
    if (e.keyCode == 13) {
      document.getElementById("cmdInput").blur()
    }
  }

  document.getElementById("cmdInput").onblur = function (e) {
    document.getElementById("cmdInput").innerHTML = "Enter a command here, or type help to see a list of commands."
  }

  document.getElementById("cmdInput").onkeydown = function (e) {
    if (e.keyCode == 13) {
      e.preventDefault()
      command(document.getElementById("cmdInput").innerHTML)
      document.getElementById("cmdInput").innerHTML = ""
    }
  }

  document.onkeydown = function(e) {
    switch (e.keyCode) {
      case 40:
        e.preventDefault()
        var c = checkKill(px+1, py)
        try {if (c != false) {c--; if (attack(c, "player") == "dead") {
          inventory = inventory.concat(creatures[c].inventory); stats.kills++; commandOut("You killed <span style='color: "+colors[creatures[c].id]+"'>"+names[creatures[c].id]+"</span>! You gained "+creatures[c].inventory.length+(creatures[c].inventory.length != 1?" items.\n":" item.\n")); creatures.splice(c, 1);}} if (walkable.indexOf(map[px+1][py]) != -1 && !checkCreature(px+1, py)) {px++} else {blocked(px+1, py)}}
        catch(e){}
        turn()
        break
      case 39:
        e.preventDefault()
        var c = checkKill(px, py+1)
        try {if (c != false) {c--; if (attack(c, "player") == "dead") {
          inventory = inventory.concat(creatures[c].inventory); stats.kills++; commandOut("You killed <span style='color: "+colors[creatures[c].id]+"'>"+names[creatures[c].id]+"</span>! You gained "+creatures[c].inventory.length+(creatures[c].inventory.length != 1?" items.\n":" item.\n")); creatures.splice(c, 1);}} if (walkable.indexOf(map[px][py+1]) != -1 && !checkCreature(px, py+1)) {py++} else {blocked(px, py+1)}}
        catch(e){}
        turn()
        break
      case 38:
        e.preventDefault()
        var c = checkKill(px-1, py)
        try {if (c != false) {c--; if (attack(c, "player") == "dead") {
          inventory = inventory.concat(creatures[c].inventory); stats.kills++; commandOut("You killed <span style='color: "+colors[creatures[c].id]+"'>"+names[creatures[c].id]+"</span>! You gained "+creatures[c].inventory.length+(creatures[c].inventory.length != 1?" items.\n":" item.\n")); creatures.splice(c, 1);}} if (walkable.indexOf(map[px-1][py]) != -1 && !checkCreature(px-1, py)) {px--} else {blocked(px-1, py)}}
        catch(e){}
        turn()
        break
      case 37:
        e.preventDefault()
        var c = checkKill(px, py-1)
        try {if (c != false) {c--; if (attack(c, "player") == "dead") {
          inventory = inventory.concat(creatures[c].inventory); stats.kills++; commandOut("You killed <span style='color: "+colors[creatures[c].id]+"'>"+names[creatures[c].id]+"</span>! You gained "+creatures[c].inventory.length+(creatures[c].inventory.length != 1?" items.\n":" item.\n")); creatures.splice(c, 1);}} if (walkable.indexOf(map[px][py-1]) != -1 && !checkCreature(px, py-1)) {py--} else {blocked(px, py-1)}}
        catch(e){}
        turn()
        break
      default:
        if (document.getElementById("cmdInput") != document.activeElement) {
          document.getElementById("cmdInput").click()
          document.getElementById("cmdInput").focus()
        }
    }
  }
}

function blocked(x, y) {
  if (map[x][y] == 4) {
    commandOut("You open the door to find a ladder leading downwards. You climb down and find another floor.\n")
    nextFloor()
  }
  else if (names[map[x][y]] != undefined) {
    commandOut("There seems to be a "+names[map[x][y]]+" there.\n")
  }
}

function collect(obj1, obj2) {
  for (i in obj1) {
    obj2[i] = obj1[i]
  }
  return obj2
}

function copyMap(map) {
  var newmap = []
  for (m in map) {
    newmap.push([])
    for (e in map[m]) {
      newmap[m].push(map[m][e])
    }
  }
  return newmap
}

function attack(target, source) {
  if (target == "player") {
    playerhp -= 5
    if (playerhp > 0) {
      commandOut("You were attacked by <span style='color: "+colors[creatures[source].id]+"'>"+names[creatures[source].id]+"</span>. You lost 5 hp.\n")
    } else {
      return "dead"
    }
  } else if (source == "player") {
    creatures[target].hp -= 5
    if (creatures[target].hp > 0) {
      commandOut("You attacked <span style='color: "+colors[creatures[source].id]+"'>"+names[creatures[target].id]+"</span> and did 5 damage.\n")
    } else {
      return "dead"
    }
  }
}

function nearestItem(x, y) {
  var location = [0, 0, 99999999999999999]
  for (var xi = 0; xi < map.length; xi++) {
    for (var yi = 0; yi < map[0].length; yi++) {
      if (items.indexOf(map[xi][yi]) != -1) {
        var distance = Math.sqrt((xi-x)**2+(yi-y)**2)
        if (distance < location[2]) {
          location = [xi, yi, distance]
        }
      }
    }
  }
  return location
}

function checkKill(x, y) {
  for (var i = 0; i < creatures.length; i++) {
    if (creatures[i].x == x && creatures[i].y == y) {return i+1}
  }
  return false
}
var cnum;
function moveCreatures(cnum) {
  cnum = cnum
  if (creatures[cnum] != undefined) {
    easystar.findPath(creatures[cnum].y, creatures[cnum].x, py, px, function(path) {
      if (path != null && path.length > 0) {
        if (path[1].y != px || path[1].x != py) {
          creatures[cnum].x = path[1].y
          creatures[cnum].y = path[1].x
        } else {
          if (attack("player", cnum)) {
            commandOut("You were killed by <span style='color: "+colors[creatures[cnum].id]+"'>"+names[creatures[cnum].id]+"</span>! Reload to restart.\n")
            document.onkeydown = function(e) {if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) {e.preventDefault(); alert("You're dead! Reload to restart.")} else {        if (document.getElementById("cmdInput") != document.activeElement) {
                      document.getElementById("cmdInput").click()
                      document.getElementById("cmdInput").focus()
                    }}}
          }
        }
      } else {
        bnum = cnum
        coords = nearestItem(creatures[bnum].x, creatures[bnum].y)
        easystar.findPath(creatures[bnum].y, creatures[bnum].x, coords[1], coords[0], function(path) {
          if (path != null && path.length > 0) {
            creatures[bnum].x = path[1].y
            creatures[bnum].y = path[1].x
          }
        })
        easystar.calculate()
      }
      curmap[creatures[cnum].x][creatures[cnum].y] = 800
      easystar.setGrid(curmap)
      if (++cnum < creatures.length) {
        moveCreatures(cnum)
      }
    })
    easystar.calculate()
    if (items.indexOf(map[creatures[cnum].x][creatures[cnum].y]) != -1) {
      creatures[cnum].inventory.push(map[creatures[cnum].x][creatures[cnum].y])
      map[creatures[cnum].x][creatures[cnum].y] = 0
    }
  }
    /*switch (Math.floor(Math.random()*4)) {
      case 0:
        try {if (walkable.indexOf(map[creatures[i].x+1][creatures[i].y]) != -1 && !checkCreature(creatures[i].x+1, creatures[i].y)) {creatures[i].x++}}
        catch(e){}
        break
      case 1:
        try {if (walkable.indexOf(map[creatures[i].x][creatures[i].y+1]) != -1 && !checkCreature(creatures[i].x, creatures[i].y+1)) {creatures[i].y++}}
        catch(e){}
        break
      case 2:
        try {if (walkable.indexOf(map[creatures[i].x-1][creatures[i].y]) != -1 && !checkCreature(creatures[i].x-1, creatures[i].y)) {creatures[i].x--}}
        catch(e){}
        break
      case 3:
        try {if (walkable.indexOf(map[creatures[i].x][creatures[i].y-1]) != -1 && !checkCreature(creatures[i].x, creatures[i].y-1)) {creatures[i].y--}}
        catch(e){}
        break
    }
    if (items.indexOf(map[creatures[i].x][creatures[i].y]) != -1) {
      creatures[i].inventory.push(map[creatures[i].x][creatures[i].y])
      map[creatures[i].x][creatures[i].y] = 0
    }*/
}

function checkCreature(x, y) {
  if (px == x && py == y) {return true}
  for (var i = 0; i < creatures.length; i++) {
    if (creatures[i].x == x && creatures[i].y == y) {return i+1}
  }
  return false
}

function drawTile(x, y, color) {
  ctx.fillStyle = color
  ctx.fillRect(offsetX+x*blocksize, offsetY+y*blocksize, blocksize, blocksize)
}

function render() {
  ctx.fillStyle = "black"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  for (var ri = 0; ri < map.length; ri++) {
    r = map[ri]
    for (var ci = 0; ci < r.length; ci++) {
      drawTile(ci, ri, colors[r[ci]])
    }
  }
  for (var i = 0; i < creatures.length; i++) {
    drawTile(creatures[i].y, creatures[i].x, colors[creatures[i].id])
  }
  drawTile(py, px, colors[999])
}
var map;
function setup() {
  choices = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
             1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
             2, 2, 2, 3, 3]
  playerhp = 100
  stats = {"floor": 1, "kills": 0}
  easystar = new EasyStar.js()
  help = "Use the arrow keys to move.\n\nCommands:\nhelp: show this help page\ninventory: display inventory (alias: inv)\nstats: show info about player\nuse &lt;item name&gt;: use an item in your inventory. initials work for multi-word item names.\n"
  inventory = []
  creatures = [{id: 800, x: 1, y: 1, inventory: [500], hp: 25}, {id: 800, x: 1, y: 1, inventory: [], hp: 25}]
  blocksize = 60
  items = [2]
  walkable = [0, 2, 999]
  names = {2: "health pack", 1: "wall", 3: "locked door", 4: "door", 800: "Mister Purple the Evil One", 500: "key"}
  aliases = {"hp": 2}
  rnames = {}
  for (n in names) {
    rnames[names[n]] = n
  }
  rnames = collect(rnames, aliases)
  colors = {0: "#4c2f00", 1: "#211400", 2: "#770000", 3: "gray", 4: "#000000", 999: "#007707", 800: "purple", 500: "gold"}
  genMap()
  curmap = copyMap(map)
  easystar.setGrid(curmap)
  easystar.setAcceptableTiles(walkable)
  offsetX = Math.round(canvas.width/2-blocksize*map[0].length/2)
  document.getElementById("console").style.left = (canvas.width/2-blocksize*map[0].length/2).toString()+"px"
  offsetY = Math.round(canvas.height/3-blocksize*map.length/2)
  document.getElementById("console").style.top = (canvas.height/3-blocksize*map.length/2+map.length*blocksize+10).toString()+"px"
  turn()
}

function commandOut(message) {
  document.getElementById("cmdOut").innerHTML = message+"\n"+document.getElementById("cmdOut").innerHTML
}

function use(id) {
  if (playerhp > 0) {
    if (inventory.indexOf(id) != -1) {
      if (id == 2) {
        turn()
        if (playerhp < 100) {
          inventory.splice(inventory.indexOf(id), 1)
          commandOut("You restored "+(100-playerhp < 10 ? 100-playerhp : 10)+" HP!\n")
          playerhp+10 <= 100 ? playerhp += 10 : playerhp = 100
        } else {commandOut("Your HP is already full.\n")}
      } else if (id == 500) {
        commandOut("You hear locks unlatching all around you.\n")
        inventory.splice(inventory.indexOf(id), 1)
        for (var m = 0; m < map.length; m++) {
          map[m] = map[m].map(function (s) { return s == 3 ? 4 : s})
        }
        turn()
      } else {
        commandOut("That item is not usable.\n")
      }
    } else {
      commandOut("You don't have that item.\n")
    }
  } else {
    commandOut("You can't do that! You're dead!\n")
  }
}

function nextFloor() {
  if (choices.filter(e => e == 2).length > 1) {choices.splice(choices.indexOf(2), 1)}
  stats.floor++
  easystar = new EasyStar.js()
  creatures = [{id: 800, x: 1, y: 1, inventory: [500], hp: 25}, {id: 800, x: 1, y: 1, inventory: [], hp: 25}]
  genMap()
  curmap = copyMap(map)
  easystar.setGrid(curmap)
  easystar.setAcceptableTiles(walkable)
  turn()
}

function command(command) {
  message = ""
  if (command == "inventory" || command == "inv") {
    message = "Click on an item to use it:\n\n"
    for (var i = 0; i < inventory.length; i++) {
      message += "<a style='text-decoration: none; color: "+colors[inventory[i]]+";' href='javascript:void(0)' onclick='use("+inventory[i]+")'>"+names[inventory[i]]+"</a>\n"
    }
    if (message == "Click on an item to use it:\n\n") { message = "Your inventory is empty.\n"}
  } else if (command == "help") {
    message = help
  } else if (command == "stats") {
    message += "HP: "+(playerhp >= 0 ? playerhp : 0)+"\n"
    message += "Floor: "+stats.floor+"\n"
    message += "Monsters killed: "+stats.kills+"\n"
  } else if (command.split(" ")[0] == "use") {
    if (command.split(" ").slice(1).join(" ") in rnames) {
      use(parseInt(rnames[command.split(" ").slice(1).join(" ")]))
      return
    }
  }
  if (message == "") { message = "That command does not exist.\n"}
  commandOut(message)
}

function turn() {
  if (items.indexOf(map[px][py]) != -1) {
    commandOut("You picked up a <span style='color: "+colors[map[px][py]]+"'>"+names[map[px][py]]+"</span>!\n")
    inventory.push(map[px][py])
    map[px][py] = 0
  }
  curmap = copyMap(map)
  curmap[px][py] = 999
  moveCreatures(0)
  render()
}

function canWalk(x, y) {
  if (walkable.indexOf(map[x][y]) != -1) {
    return true
  }
  return false
}

function onMap(x, y) {
  if (x >= 0 && x < map[0].length && y >= 0 && y < map.length) {return true}
  return false
}

function genMap() {
  map = _genMap()
  var testpath = new EasyStar.js()
  testpath.setGrid(map)
  testpath.setAcceptableTiles(walkable)
  old = []
  for (c in creatures) {
    old.push(creatures[c].x)
    old.push(creatures[c].y)
  }
  for (c in creatures) {
    testpath.findPath(py, px, creatures[c].y, creatures[c].x, function(path) {
      var health = false
      var door = false
      for (m in map) {
        for (i in map[m]) {
          if (map[m][i] == 2) { health = true }
          if (map[m][i] == 3) { door = true }
        }
      }
      if (path == null || !door || !health) {
        map = _genMap()
        genMap()
        render()
      }
    })
    testpath.calculate()
  }
  map = map
}

function _genMap() {
  var width = 19
  var height = 8
  var map = []
  for (var h = 0; h < height; h++) {
    map.push([])
    for (var w = 0; w < width; w++) {
      map[h].push(choices[Math.floor(Math.random()*choices.length)])
    }
  }
  px = Math.floor(Math.random()*height)
  py = Math.floor(Math.random()*width)
  while (map[px][py] != 0) {
    px = Math.floor(Math.random()*height)
    py = Math.floor(Math.random()*width)
  }
  for (var c = 0; c < creatures.length; c++) {
    creatures[c].x = Math.floor(Math.random()*height)
    creatures[c].y = Math.floor(Math.random()*width)
    while (map[creatures[c].x][creatures[c].y] != 0) {
      creatures[c].x = Math.floor(Math.random()*height)
      creatures[c].y = Math.floor(Math.random()*width)
    }
  }
  return map
  /*return [[0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0,0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0,0, 0, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0,0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0,0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0,0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0,0, 1, 1, 1, 1, 0, 2, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0,0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0]]*/
}
