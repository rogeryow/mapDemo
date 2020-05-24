import * as util from './util.js'
const colors = {
	red: [
		'#FFD254',
		'#FFB31F',
		'#FF9102',
		'#FE6800',
		'#DC3F11',
	],
	yellow: [
		'#FFF0A3',
		'#FFE273',
		'#FDD22F',
		'#EBB323',
		'#D9980D',
	],
	green: [
		'#BDFFCF',
		'#7EF7A0',
		'#14DC71',
		'#1BBD66',
		'#17A258',
	],
	blue: [
		'#9DF1FA',
		'#27DBF5',
		'#13B8E8',
		'#0989C2',
		'#17698E',
	]
}

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
	.then(({barangays, info}) => {
		setMapColor(barangays)
		addMapClick()
		addMapHoverOver()
		addMapHoverOut()
		addMapColorfilter()
		addMapKeyEvents()
		addMapZoom()
		moveMap()

		function setMapColor(barangays, option) {
			option = Object.assign(
				{
					red: true, 
					yellow: true, 
					green: true, 
					blue: true,
					filter: 'total',
					sequential: false,
					colorIntensity: 4,
				},
				option
			)

			let {
				red, 
				yellow, 
				green, 
				blue, 
				filter, 
				sequential, 
				colorIntensity
			} = option

			const {total} = info

			for (let index = 0; index < barangays.length; index++) {
				const {name, statistics} = barangays[index]
				const filteredStat = {}
				
				if(red) filteredStat.red = statistics[filter].red
				if(yellow) filteredStat.yellow = statistics[filter].yellow
				if(green) filteredStat.green = statistics[filter].green
				if(blue) filteredStat.blue = statistics[filter].blue

				const getColor = Object.keys(filteredStat).reduce((now, current) => filteredStat[now] > filteredStat[current] ? now : current )
				
				if(sequential) {
					const colorIntensityArray = splitNumberToArray(total[getColor])	
					const colorStat = statistics[filter][getColor]
					colorIntensity = getColorIntensity(colorStat, colorIntensityArray)
				} 

				fillColor(name, getColor, colorIntensity)
			}
		}

		function fillColor(barangay, color, colorIntensity) {
			const barangayNode = document.querySelector(`[data-name='${barangay}']`)
			switch(color) {
				case 'red': barangayNode.style.fill = colors.red[colorIntensity]
					break
				case 'yellow': barangayNode.style.fill = colors.yellow[colorIntensity]
					break
				case 'green': barangayNode.style.fill = colors.green[colorIntensity]
					break
				case 'blue': barangayNode.style.fill = colors.blue[colorIntensity]
					break
				default: barangayNode.style.fill = 'grey'
			}
		}

		function getColorIntensity(number, array) {
			let current = 0
			let index = array.findIndex((value, index) => {
				console.log(value)
				if(number >= current && number < value ) {
					return index
				}
				current = value
			})
			if(index == -1) index = 4
			return index
		}

		function addMapClick() {
			map.addEventListener('click', function({target: barangayNode}) {
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
			return barangays.find(({name}) => name == barangayName)
		}

		function displayBarangayInfo(barangayInfo) {
			// todo			
			if(barangayInfo == undefined) return
			const {barangay, totalPuroks, statistics} = barangayInfo
		}

		function displayPuroks(barangayInfo) {
			// todo
			if(barangayInfo == undefined) return
			let sample = ''

			const {name, puroks, statistics} = barangayInfo
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
			// const {barangay, stats} = data

			// const barangayText = document.getElementById('barangay-text')
			// const redText = document.getElementById('red-text')
			// const yellowText = document.getElementById('yellow-text')
			// const greenText = document.getElementById('green-text')
			// const blueText = document.getElementById('blue-text')

			// barangayText.innerHTML = barangay
			// redText.innerHTML = stats.red
			// yellowText.innerHTML = stats.yellow
			// greenText.innerHTML = stats.green
			// blueText.innerHTML = stats.blue
		}

		function addMapColorfilter() {
			// todo
			const colorFilterNodes = Array.from(document.getElementsByClassName('filter-color'))

			colorFilterNodes.forEach((node) => {
				node.addEventListener('click', function() {
					if(node.hasAttribute('color')) {
						const color = node.getAttribute('color')
						const option = Object.assign(
							{
								red: false, 
								yellow: false, 
								green: false, 
								blue: false,
								sequential: true, 
							}
						)

						option[color] = true
						setMapColor(barangays, option)
					} else setMapColor(barangays)
				})
			})
		}

		function splitNumberToArray(number) {
			const sequence = []
			const startNumber = number/5
			
			for (let index = 1; index <= 5; index++) {
				sequence.push(startNumber * index)
			}
			
			return sequence
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

		function moveMap() {
			$( "#map-davao" ).draggable()
		}

	})
	.catch((errorMessage) => {
		console.log(errorMessage)
	})
	
}

