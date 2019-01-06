var CLIENT_ID = 'e9d2abeed1b84cd880a2abcc3e03a84e'
var token
var id
var playlistname

var sentenceTracks = []
var finished = false

function login () {
	location.href = 'https://accounts.spotify.com/authorize?' + $.param({ client_id: CLIENT_ID, response_type: 'token', redirect_uri: location.origin, scope: 'playlist-modify-public' })
}

function search (query, offset, callback) {
	$.ajax({
		url: "https://api.spotify.com/v1/search?" + $.param({ q: query, offset: offset, type: 'track', limit: 50, market: 'US' }),
		headers: {
			'Authorization': 'Bearer ' + token
		}
	}).done(function (data) {
		callback(data.tracks)
	})
}

function checkTracks (sentence, spelt, i, offset, orig_spelt, finish) {
	console.log(sentence.slice(spelt, i))
	search(sentence.slice(spelt, i).join(' '), offset, function (data) {
		var tracks = data.items
		for (var t = 0; t < tracks.length; t++) {
			var track = tracks[t]
 			if (track.name.toLowerCase() === sentence.slice(spelt, i).join(' ').toLowerCase() || track.name.toLowerCase().split(' - ')[0].split('(')[0] === sentence.slice(spelt, i).join(' ').toLowerCase()) {
				sentenceTracks.push(track)
				spelt = i
				offset = 0
				break
			}
		}
		if (spelt > orig_spelt) finish(sentence, spelt, i, offset, orig_spelt)
		else if (i-1 > spelt) checkTracks(sentence, spelt, i-1, offset, orig_spelt, finish)
		else if (offset > 1000) {
			$('.spinner').css('display', 'none')
			$('.failure').css('display', 'block')
		}
		else finish(sentence, spelt, i, offset + 50, orig_spelt)
	})
}

function _spell (sentence, spelt, i, offset, orig_spelt) {
 	if (spelt < sentence.length) checkTracks(sentence, spelt, sentence.length, offset, spelt, _spell)
 	else if (!finished) finishedSpelling()
}

function spell () {
	sentenceTracks = []
	finished = false
	playlistname = $('#playlistname').val()
	var sentence = $('#sentenceInput').val().split(' ')
	if (sentence && playlistname) {
		$('#playlistname').val('')
		$('#sentenceInput').val('')
		var spelt = 0
		var offset = 0
		$('.loggedin').css('display', 'none')
		$('.spinner').css('display', 'block')
		_spell(sentence, spelt, sentence.length, offset, spelt)
	}
}

function finishedSpelling() {
	finished = true
	for (var i = 0; i < sentenceTracks.length; i++) {
		var li = $("<li></li>")
		li.text(sentenceTracks[i].name + " - " + sentenceTracks[i].artists[0].name)
		console.log(li)
		$('#tracks').append(li)
	}
	$.ajax({
		url: 'https://api.spotify.com/v1/me',
		headers: {
			'Authorization': 'Bearer ' + token
		}
	}).done(function (data) {
		id = data.id
		createPlaylist()		
	})
}

function addTracks(playlist) {
	$.ajax({
		method: 'post',
		url: 'https://api.spotify.com/v1/playlists/' + playlist + '/tracks?uris=' + sentenceTracks.map(t => t.uri).join(','),
		headers: {
			'Authorization': 'Bearer ' + token
		}
	}).done(function (data) {
		location.href = 'https://open.spotify.com/user/'+id+'/playlist/'+playlist
	})
}

function createPlaylist () {
	$.ajax({
		method: 'post',
		url: 'https://api.spotify.com/v1/users/' + id + '/playlists',
		data: JSON.stringify({
			name: playlistname
		}),
		headers: {
			'Authorization': 'Bearer ' + token
		}
	}).done(function (data) {
		addTracks(data.id)
	})
}

$(function () {
	if (window.location.hash.indexOf('access_token') !== -1) {
		token = window.location.hash.split('=')[1].split('&')[0]
		window.history.replaceState(null, null, '/')
		$('.notloggedin').css('display', 'none')
		$('.loggedin').css('display', 'block')
	}
})