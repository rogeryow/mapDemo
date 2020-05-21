function XMLRequest(url) {
	return new Promise(function(resolve, reject) {
		const xhr = new XMLHttpRequest()

		xhr.onload = function() {
			if(this.readyState == 4 && this.status == 200){
				const response = JSON.parse(this.responseText)
				resolve(response)
			}
		}

		xhr.onerror = function() {
			reject(new Error('Network Error'))
		}

		xhr.open('GET', url, true)
		xhr.send()
	})	
}

function zoom(event) {
	event.preventDefault()

	let scale = returnOnlyNumbers(this.style.transform) || 1
	scale += (event.deltaY/4.5) * -0.01
	scale = Math.min(Math.max(1, scale), 4)
	this.style.transform = `scale(${scale})`
}

function resetZoom(node) {
	console.log(node)
	node.style.transform = `scale(${1})`	
}

function returnOnlyNumbers(string) {
    return parseFloat(string.replace(/\(|\)|scale/g,''))
}

function getFullScreen() {
	return document.fullscreenElement
		|| document.webkitfullscreenElement
		|| document.mozfullscreenElement
		|| document.msfullscreenElement
}

function fullScreenChange(callback) {
	document.addEventListener('fullscreenchange', function () {
		callback()
	})
}

function toggleFullScreen(node) {
	if (getFullScreen()) {
		document.exitFullscreen()
	} else {
		node.requestFullscreen()
	}
}

export { 
	XMLRequest, 
	zoom,
	resetZoom,
	returnOnlyNumbers,
	getFullScreen,
	fullScreenChange, 
	toggleFullScreen,
}