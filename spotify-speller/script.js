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

function getTrackName(uri) {
	var request = new XMLHttpRequest();
	request.open('GET', 'https://api.spotify.com/v1/tracks/'+uri.split(':')[2], false)
	request.setRequestHeader('Authorization', 'Bearer ' + token)
	request.send(null);
	return JSON.parse(request.responseText).name
}

function checkTracks (sentence, spelt, i, offset, orig_spelt, finish, nwords, dots) {
	if (memory[sentence.slice(spelt, i).join(' ').toLowerCase().replace(/[^0-9a-zA-Z ]/g, '')]) {
		sentenceTracks.push(memory[sentence.slice(spelt, i).join(' ').toLowerCase().replace(/[^0-9a-zA-Z ]/g, '')])
		spelt = i
		offset = 0
		finish(sentence, spelt, offset)
	}
	search(!dots ? sentence.slice(spelt, i).join(' ') : sentence.slice(spelt, i).join(' ').split('').join('.'), offset, function (data) {
		var tracks = data.items
		for (var t = 0; t < tracks.length; t++) {
			var track = tracks[t]
 			if (track.name.toLowerCase().replace(/[^0-9a-zA-Z ]/g, '') === sentence.slice(spelt, i).join(' ').toLowerCase().replace(/[^0-9a-zA-Z ]/g, '') || track.name.toLowerCase().split(' - ')[0].split(' (')[0].replace(/[^0-9a-zA-Z ]/g, '') === sentence.slice(spelt, i).join(' ').toLowerCase().replace(/[^0-9a-zA-Z ]/g, '')) {
 				memory[sentence.slice(spelt, i).join(' ').toLowerCase().replace(/[^0-9a-zA-Z ]/g, '')] = track.uri
				sentenceTracks.push(track.uri)
				spelt = i
				offset = 0
				break
			}
		}
		if (spelt > orig_spelt) finish(sentence, spelt, offset)
		else if (i-1 > spelt) checkTracks(sentence, spelt, i-1, offset, orig_spelt, finish, nwords)
		else if (i-1 === spelt && !dots) checkTracks(sentence, spelt, i, offset, orig_spelt, finish, nwords, true)
		else if (i-1 === spelt && sentence[spelt].indexOf("'s") !== -1 && sentence[spelt].indexOf("'s") === sentence[spelt].length - 2) checkTracks(sentence.slice(0, spelt).concat([sentence[spelt].slice(0, sentence[spelt].length - 2), 'is']).concat(sentence.slice(spelt+1)), spelt, i, offset, orig_spelt, finish, nwords)
		else if (i-1 === spelt && sentence[spelt].indexOf("'re") !== -1 && sentence[spelt].indexOf("'re") === sentence[spelt].length - 3) checkTracks(sentence.slice(0, spelt).concat([sentence[spelt].slice(0, sentence[spelt].length - 3), 'are']).concat(sentence.slice(spelt+1)), spelt, i, offset, orig_spelt, finish, nwords)
		else if (memory[sentence.slice(spelt, i).join(' ').toLowerCase().replace(/[^0-9a-zA-Z ]/g, '')] === null || offset > 5000) {
			var track = sentenceTracks.pop()
			if (!track || getTrackName(track).toLowerCase().split(' - ')[0].split('(')[0].replace(/[^0-9a-zA-Z ]/g, '').split(' ').length === 1) {
				$('.spinner').css('display', 'none')
				$('.failure').css('display', 'block')
			} else {
				memory[sentence.slice(spelt, i).join(' ').toLowerCase().replace(/[^0-9a-zA-Z ]/g, '')] = null
				spelt -= getTrackName(track).toLowerCase().split(' - ')[0].split('(')[0].replace(/[^0-9a-zA-Z ]/g, '').split(' ').length
				if (getTrackName(track).toLowerCase().split(' - ')[0].split('(')[0].replace(/[^0-9a-zA-Z ]/g, '').split(' ').length <= 1) numwords = undefined
				else numwords = getTrackName(track).toLowerCase().split(' - ')[0].split('(')[0].replace(/[^0-9a-zA-Z ]/g, '').split(' ').length - 1
				_spell(sentence, spelt, 0, numwords)
			}
		}
		else finish(sentence, spelt, offset + 50, nwords)
	})
}

function _spell (sentence, spelt, offset, numwords) {
	if (numwords === undefined) numwords = 7
 	if (spelt < sentence.length) checkTracks(sentence, spelt, Math.min(sentence.length, spelt+numwords), offset, spelt, _spell, numwords)
 	else if (!finished) finishedSpelling()
}

function spell () {
	sentenceTracks = []
	finished = false
	playlistname = $('#playlistname').val()
	var sentence = $('#sentenceInput').val().trim().split(/\s+/)
	if (sentence && playlistname) {
		$('#playlistname').val('')
		$('#sentenceInput').val('')
		var spelt = 0
		var offset = 0
		$('.loggedin').css('display', 'none')
		$('.spinner').css('display', 'block')
		_spell(sentence, spelt, offset)
	}
}

function finishedSpelling() {
	finished = true
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
	var split = false
	if (sentenceTracks.length >= 100) {
		split = true
	}
	$.ajax({
		method: 'post',
		url: 'https://api.spotify.com/v1/playlists/' + playlist + '/tracks?uris=' + sentenceTracks.slice(0, Math.min(sentenceTracks.length, 100)).join(','),
		headers: {
			'Authorization': 'Bearer ' + token
		}
	}).done(function (data) {
		location.href = 'https://open.spotify.com/user/'+id+'/playlist/'+playlist
		if (split) {
			sentenceTracks = sentenceTracks.slice(100)
			addTracks(playlist)
		}
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