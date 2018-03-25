window.onscroll = function() {
	if (document.documentElement.scrollTop == document.documentElement.offsetHeight/2) {
		document.getElementsByClassName('arrowlink')[0].style.display = "block"
		document.getElementsByClassName('arrowlink')[0].classList = "arrowlink shown"
		document.getElementsByClassName('arrow')[0].classList = "up arrow"
		document.getElementsByClassName('arrowlink')[0].href = "#top"
		document.getElementsByClassName('arrowlink')[0].onclick = function(){document.getElementById('top').scrollIntoView({behavior:'smooth'});return false}
	} else if (document.documentElement.scrollTop == 0){
		document.getElementsByClassName('arrowlink')[0].classList = "arrowlink shown"
		document.getElementsByClassName('arrow')[0].classList = "arrow"
		document.getElementsByClassName('arrowlink')[0].href = "#projects"
		document.getElementsByClassName('arrowlink')[0].onclick = function(){document.getElementById('projects').scrollIntoView({behavior:'smooth'});return false}
	} else {
		document.getElementsByClassName('arrowlink')[0].classList = "arrowlink hidden"
	}
}
