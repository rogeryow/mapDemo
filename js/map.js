import * as util from './util.js'

window.addEventListener('DOMContentLoaded', (event) => {
    startMap()
	util.fullScreenChange(test)
})

function test() {
	console.log('test')
}

function startMap() {
	const mapRoot = document.getElementById('map-root')
	const mapContainer = document.getElementById('map')
	const map = document.getElementById('map-davao')

	util.XMLRequest('../data/json/digos.json')
	.then((barangays) => {
		// setMapAttribute(barangays)
		setMapColor(barangays)
		addMapClick()
		addMapHoverOver()
		addMapHoverOut()
		addMapColorfilter()
		addMapKeyEvents()
		addMapZoom()
		
		function setMapColor(barangays, option) {
			option = Object.assign(
				{
					red: true, 
					yellow: true, 
					green: true, 
					blue: true,
					filter: 'total',
				},
				option
			)

			const {red, yellow, green, blue, filter} = option

			for (const [index, {barangay, statistics}] of barangays.entries()) {

				const filteredStat = {}
				if(red) filteredStat.red = statistics[filter].red
				if(yellow) filteredStat.yellow = statistics[filter].yellow
				if(green) filteredStat.green = statistics[filter].green
				if(blue) filteredStat.blue = statistics[filter].blue

				const getBarangayMaxStat = Object.keys(filteredStat).reduce((now, current) => filteredStat[now] > filteredStat[current] ? now : current )
				fillColor(barangay, getBarangayMaxStat)
			}
		}

		function fillColor(barangay, color) {
			const barangayNode = document.querySelector(`[data-name='${barangay}']`)

			switch(color) {
				case 'red': barangayNode.style.fill = '#ED5564'
					break
				case 'yellow': barangayNode.style.fill = '#FFCE54'
					break
				case 'green': barangayNode.style.fill = '#A0D568'
					break
				case 'blue': barangayNode.style.fill = '#4FC1E8'
					break
				default: barangayNode.style.fill = 'grey'
			}
		}

		function addMapClick() {
			map.addEventListener('click', function({target: barangayNode}) {
				console.log(barangayNode)
				const barangay = barangayNode.getAttribute('data-name') || undefined
				if(barangay) displayPuroks(getBarangayInfo(barangay))
			})	
		}

		function addMapHoverOver() {
				map.addEventListener('mouseover', function({target: barangayNode}) {
				const barangay = barangayNode.getAttribute('data-name') || undefined 
				if(barangay) displayBarangayInfo(getBarangayInfo(barangay)) 
			})
		}

		function placeMapMaker(barangayNode) {
			// todo
			const bbox = barangayNode.getBoundingClientRect()
			var center = {
				x: bbox.left + bbox.width,
				y: bbox.top  + bbox.height,
          	};

			var svgimg = document.createElementNS('http://www.w3.org/2000/svg', 'image')
			svgimg.setAttributeNS(null, 'height', 75)
			svgimg.setAttributeNS(null, 'width', 75)
			svgimg.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '../image/mapFinder.png')
			svgimg.setAttributeNS(null, 'x', center.x)
			svgimg.setAttributeNS(null, 'y', center.y)
			svgimg.setAttributeNS(null, 'visibility', 'visible')
			svgimg.setAttributeNS(null, 'opacity', 0.9)
			map.appendChild(svgimg)
		}

		function getBarangayInfo(barangayName) {
			if(barangayName == undefined) return
			return barangays.find(({barangay}) => barangay == barangayName) 
		}

		function displayBarangayInfo(barangayInfo) {
			if(barangayInfo == undefined) return
			const {barangay, totalPuroks, statistics} = barangayInfo
			console.log(statistics) 
		}

		function displayPuroks(barangayInfo) {
			if(barangayInfo == undefined) return
			let sample = ''
			const {barangay, puroks, statistics} = barangayInfo
			for (const [index, purok] of puroks.entries()) {
				sample += `<li>${purok.name}</li>`
			}

			document.getElementById('purok-list').innerHTML = sample
			
		}

		function addMapHoverOut() {
			// map.addEventListener('mouseout', function({target}) {
			// 	target.style.stroke = '#aeaeaf'
			// 	target.style.strokeWidth = '1px'
			// })
		}

		function formatText(data) {
			// todo
			const {barangay, stats} = data

			const barangayText = document.getElementById('barangay-text')
			const redText = document.getElementById('red-text')
			const yellowText = document.getElementById('yellow-text')
			const greenText = document.getElementById('green-text')
			const blueText = document.getElementById('blue-text')

			barangayText.innerHTML = barangay
			redText.innerHTML = stats.red
			yellowText.innerHTML = stats.yellow
			greenText.innerHTML = stats.green
			blueText.innerHTML = stats.blue
		}

		function addMapColorfilter() {
			// todo
			const checkNodes = Array.from(document.getElementsByClassName('filter-color'))
			const option = {}

			checkNodes.forEach((node) => {
				node.addEventListener('click', function() {
					console.log('clicked')
					checkNodes.map((node) => {
						let color = node.getAttribute('color')
						if(node.checked) option[color] = true
						else option[color] = false
					})
					// setMapColor(barangays, option)
					console.log(option)
				})
			})
		}

		function addMapZoom() {
			map.addEventListener('wheel', util.zoom)
		}

		function addMapKeyEvents() {
			document.addEventListener('keydown', function(event) {
				let key = event.key.toLowerCase()
				let getMapLeftCord = util.returnOnlyNumbers(mapContainer.style.left) || 0
				let getMapTopCord = util.returnOnlyNumbers(mapContainer.style.top) || 0 
				const INCREASE = 50

				if(key == 'a') {
					moveLeft()
				}
				if(key == 's') {
					moveDown() 
				}
				if(key == 'd') {
					moveRight()	
				}
				if(key == 'w') {
					moveTop()
				}
				if(key == 'f') {
					fullScreen()
				}
				if(key == 'r') {
					resetMapPlacement()
				}

				function moveLeft() {
					let newLeft = getMapLeftCord + INCREASE
					mapContainer.style.left = newLeft + 'px'
				}

				function moveRight() {
					let newLeft = getMapLeftCord - INCREASE
					mapContainer.style.left = newLeft + 'px'
				}

				function moveDown() {
					let newTop = getMapTopCord - INCREASE
					mapContainer.style.top = newTop + 'px'
				}

				function moveTop() {
					let newTop = getMapTopCord + INCREASE
					mapContainer.style.top = newTop + 'px'
				}

				function fullScreen() {
					util.toggleFullScreen(mapRoot)	
				}

				function resetMapPlacement() {
					util.resetZoom(map)
					mapContainer.style.top = '0'
					mapContainer.style.left = '0'
				}

			})
		}

	})
	.catch((errorMessage) => {
		console.log(errorMessage)
	})
	
}

