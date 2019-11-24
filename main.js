"use strict";

const dimension = 5;

let mainInner = document.getElementById("main-inner");

function populateGrid() {
	for (let i = 0; i < dimension; i++) {
		let squareRow = document.createElement("DIV");
		squareRow.className = "square-row";
		for (let j = 0; j < dimension; j++) {
			squareRow.innerHTML =
				squareRow.innerHTML +
				'<div class="dot-vline-cont row-cont"><span class="dot" value="' +
				"d".concat(i, "-", j) +
				'"></span>' +
				'<div class="vlineOut lineOut" value="' +
				"v".concat(i, "-", j) +
				'"><div class="vline line"></div></div> </div><div class="hline-cont row-cont"><div class="hlineOut lineOut" value="' +
				"h".concat(i, "-", j) +
				'"><div class="hline line"></div></div></div>';
		}
		squareRow.innerHTML =
			squareRow.innerHTML +
			'<div class="dot-vline-cont row-cont"><span class="dot" value="' +
			"d".concat(i, "-", dimension) +
			'"></span>' +
			'<div class="vlineOut lineOut" value="' +
			"v".concat(i, "-", dimension) +
			'"><div class="vline line"></div>';
		mainInner.appendChild(squareRow);
	}
	let squareRow = document.createElement("DIV");
	squareRow.className = "square-row";
	for (let j = 0; j < dimension; j++) {
		squareRow.innerHTML =
			squareRow.innerHTML +
			'<div class="dot-vline-cont row-cont"><span class="dot" value="' +
			"d".concat(dimension, "-", j) +
			'"></span>' +
			'</div> </div><div class="hline-cont row-cont"><div class="hlineOut lineOut" value="' +
			"h".concat(dimension, "-", j) +
			'"><div class="hline line"></div></div>';
	}
	squareRow.innerHTML =
		squareRow.innerHTML +
		'<div class="dot-vline-cont row-cont"><span class="dot" value="' +
		"d".concat(dimension, "-", dimension) +
		'"></span></div>';
	mainInner.appendChild(squareRow);
	console.log("hi there");

	//Register click events
	let lineConts = Array.from(document.getElementsByClassName("lineOut"));
	lineConts.forEach(element => {
		element.addEventListener("click", function() {
			handleClick(element);
		});
		element.addEventListener("hover", function() {
			handleHover(elem);
		});
	});
}

function handleClick(elem) {
	console.log(elem);
	let lineElem = elem.getElementsByClassName("line")[0];
	lineElem.classList.add("clicked");
	elem.classList.add("clicked");

	setDotColours(elem);
}

function setDotColours(elem) {
	let valueData = elem.getAttribute("value");
	let isHorizontal = valueData.substring(0, 1) == "h";
	let xCoord = Number(valueData.split("-")[1]);
	let yCoord = Number(valueData.split("-")[0].substring(1));

	let dot1;
	let dot2;
	//Get dots
	if (isHorizontal) {
		dot1 = document.querySelector(
			"span[value=d".concat(yCoord, "-", xCoord, "]")
		);
		dot2 = document.querySelector(
			"span[value=d".concat(yCoord, "-", xCoord + 1, "]")
		);
		console.log(dot1);
	} else {
		dot1 = document.querySelector(
			"span[value=d".concat(yCoord, "-", xCoord, "]")
		);
		dot2 = document.querySelector(
			"span[value=d".concat(yCoord + 1, "-", xCoord, "]")
		);
		console.log(dot1);
	}
	dot1.classList.add("clicked");
	dot2.classList.add("clicked");
}

function handleHover(elem) {}
