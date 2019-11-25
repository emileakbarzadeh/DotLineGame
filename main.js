"use strict";

const dimension = 3;

let mainInner = document.getElementById("main-inner");
let outputBox = document.getElementById("outputBox");
let currentPlayerBox = document.getElementById("current-player");

let scores = [0, 0];
let clickList = [];

let currentPlayerTurn = 0;
let playerCount = 2;

let playerAddresses = [];
let peerArray = [];
let connArray = [];
let currentID = "";

let intervalID = setInterval(refreshClickData, 1000);

function populateGrid() {
	mainInner.innerHTML = "";
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
				'"><div class="hline line"></div></div><div class="square-in" value="' +
				"s".concat(i, "-", j) +
				'"></div></div>';
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

	//Register click events
	let lineConts = Array.from(document.getElementsByClassName("lineOut"));
	lineConts.forEach(element => {
		element.addEventListener("click", function() {
			handleClick(element);
		});
	});
}

function generateID() {
	currentID = dimension + "-" + playerCount + "-" + UUIDGEN();
	let idBox = document.getElementById("current-id");
	idBox.innerText = currentID;
}

function handleClick(elem) {
	//Get line element
	let lineElem = elem.getElementsByClassName("line")[0];

	//check for already selected
	if (elemIsSelected(lineElem)) return;
	//add to click list
	clickList.push(lineElem.getAttribute("value"));
	//send click
	sendClicks();

	//Add class
	lineElem.classList.add("clicked");
	elem.classList.add("clicked");

	outputBox.innerText = elem.getAttribute("value");

	setDotColours(elem);
	//returns amount of boxes filled
	let increaseScoreBy = checkForSquare(elem);
	scores[currentPlayerTurn] += increaseScoreBy;

	updateScores();
	//Check win condition
	if (checkWin()) setWin();

	//next turn
	if (increaseScoreBy == 0) nextTurn();
}
////////////////////////////////////////////////////////////
//////Peeerr////////////////////////////////////////////////
function sendClicks() {
	let clickListString = JSON.stringify(clickList);

	connArray.forEach(conn => {
		conn.send(clickListString);
	});
}

function refreshClickData() {}

function connectToPeer() {
	peerArray.push(new Peer(currentID, { config: { debug: 2 } }));
	let peerid = document.getElementById("peer-id");

	let conn = peerArray[0].connect(peerid);
	// on open will be launch when you successfully connect to PeerServer
	conn.on("open", function() {
		// here you have conn.id
		conn.send("hi! the peer worked");
	});
	peerArray[0].on("connection", function(conn) {
		conn.on("data", recieveClicks(data));
	});
	connArray.push(conn);
}

function recieveClicks(data) {
	let clickArray = JSON.parse(data);
	clickArray.forEach(clickVal => {
		let clickElem = document.querySelector("div[value=" + clickVal + "]");
		handleClick(clickElem);
	});
}
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
function checkWin() {
	let total = 0;
	scores.forEach(score => {
		total = total + score;
	});
	return total == dimension * dimension;
}

function setWin() {
	let highScoreNumber = 0;
	let winIndex = 0;

	//check for draw
	for (let i = 0; i < playerCount; i++) {
		if (scores[winIndex] < scores[i]) winIndex = i;
	}
	scores.forEach(score => {
		if (scores[winIndex] == score) highScoreNumber++;
	});
	if (highScoreNumber != 1) {
		currentPlayerBox.innerText = "Draw!";
	} else {
		currentPlayerBox.innerText =
			"Congratulations to the winner, Player " + (winIndex + 1);
	}
}

function setDotColours(elem) {
	let valueData = getElemCoordsType(elem);
	let isHorizontal = valueData[2] == "h";
	let xCoord = valueData[0];
	let yCoord = valueData[1];

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

function setBoxColour(xCoord, yCoord) {
	let boxSelected = document.querySelector(
		"div[value=s".concat(yCoord, "-", xCoord, "]")
	);
	boxSelected.classList.add("box-select");
}

function handleHover(elem) {}

//returns true if the line is selected
function elemIsSelected(elem) {
	let classList;
	try {
		classList = Array.from(elem.classList);
	} catch (error) {
		console.log(error);
		return false;
	}

	if (classList.includes("clicked") || classList.includes("box-select")) {
		return true;
	}
	return false;
}

function coordIsSelected(type, xCoord, yCoord) {
	let valueText;

	valueText = type.concat(yCoord, "-", xCoord);
	try {
		let elem = document.querySelector("div[value='".concat(valueText, "']"));
		return elemIsSelected(elem);
	} catch (error) {
		console.log(error);
		return false;
	}
}

//Returns the element xcoord, ycoord and type
function getElemCoordsType(elem) {
	return parseCoordsType(elem.getAttribute("value"));
}

function parseCoordsType(valueData) {
	let type = valueData.substring(0, 1);
	let xCoord = Number(valueData.split("-")[1]);
	let yCoord = Number(valueData.split("-")[0].substring(1));
	return [xCoord, yCoord, type];
}

function checkForSquare(elem) {
	let valueData = getElemCoordsType(elem);
	let isHorizontal = valueData[2] == "h";
	let xCoord = valueData[0];
	let yCoord = valueData[1];

	let square1IsSelected = true;
	let square2IsSelected = true;

	if (isHorizontal) {
		//Check for above
		//If the square is selected, then check the next line. If 1 line is unselected then the entire thing is false
		let yCoordUpper = yCoord - 1;
		square1IsSelected = square1IsSelected
			? coordIsSelected("h", xCoord, yCoordUpper)
			: false;
		square1IsSelected = square1IsSelected
			? coordIsSelected("v", xCoord, yCoordUpper)
			: false;
		square1IsSelected = square1IsSelected
			? coordIsSelected("v", xCoord + 1, yCoordUpper)
			: false;

		//check for below
		square2IsSelected = square2IsSelected
			? coordIsSelected("h", xCoord, yCoord + 1)
			: false;

		square2IsSelected = square2IsSelected
			? coordIsSelected("v", xCoord, yCoord)
			: false;
		square2IsSelected = square2IsSelected
			? coordIsSelected("v", xCoord + 1, yCoord)
			: false;
		//
		//
		//Check for already selected
		if (coordIsSelected("s", xCoord, yCoord - 1)) square1IsSelected = false;
		if (coordIsSelected("s", xCoord, yCoord)) square2IsSelected = false;
	} else {
		//Check for above
		//If the square is selected, then check the next line. If 1 line is unselected then the entire thing is false
		square1IsSelected = square1IsSelected
			? coordIsSelected("h", xCoord - 1, yCoord)
			: false;
		square1IsSelected = square1IsSelected
			? coordIsSelected("h", xCoord - 1, yCoord + 1)
			: false;
		square1IsSelected = square1IsSelected
			? coordIsSelected("v", xCoord - 1, yCoord)
			: false;

		//check for below
		square2IsSelected = square2IsSelected
			? coordIsSelected("h", xCoord, yCoord)
			: false;

		square2IsSelected = square2IsSelected
			? coordIsSelected("h", xCoord, yCoord + 1)
			: false;
		square2IsSelected = square2IsSelected
			? coordIsSelected("v", xCoord + 1, yCoord)
			: false;

		//
		//
		//Check for already selected
		if (coordIsSelected("s", xCoord - 1, yCoord)) square1IsSelected = false;
		if (coordIsSelected("s", xCoord, yCoord)) square2IsSelected = false;
	}

	//Set box visibility
	if (isHorizontal) {
		if (square1IsSelected) setBoxColour(xCoord, yCoord - 1);
		if (square2IsSelected) setBoxColour(xCoord, yCoord);
	} else {
		if (square1IsSelected) setBoxColour(xCoord - 1, yCoord);
		if (square2IsSelected) setBoxColour(xCoord, yCoord);
	}

	//returns amount of boxes clicked
	let boxesClicked = (square1IsSelected ? 1 : 0) + (square2IsSelected ? 1 : 0);
	return boxesClicked;
}

function nextTurn() {
	currentPlayerTurn++;
	if (currentPlayerTurn >= playerCount) currentPlayerTurn = 0;

	currentPlayerBox.innerText = "Player ".concat(
		currentPlayerTurn + 1,
		"'s turn"
	);
}

function updateScores() {
	for (let i = 0; i < playerCount; i++) {
		let scoreBox = document.getElementById("score".concat(i + 1));
		scoreBox.innerText = scores[i];
	}
}

//Generate UUID
var lut = [];
for (var i = 0; i < 256; i++) {
	lut[i] = (i < 16 ? "0" : "") + i.toString(16);
}
function UUIDGEN() {
	var d0 = (Math.random() * 0xffffffff) | 0;
	var d1 = (Math.random() * 0xffffffff) | 0;
	var d2 = (Math.random() * 0xffffffff) | 0;
	var d3 = (Math.random() * 0xffffffff) | 0;
	return (
		lut[d0 & 0xff] +
		lut[(d0 >> 8) & 0xff] +
		lut[(d0 >> 16) & 0xff] +
		lut[(d0 >> 24) & 0xff] +
		"-" +
		lut[d1 & 0xff] +
		lut[(d1 >> 8) & 0xff] +
		"-" +
		lut[((d1 >> 16) & 0x0f) | 0x40] +
		lut[(d1 >> 24) & 0xff] +
		"-" +
		lut[(d2 & 0x3f) | 0x80] +
		lut[(d2 >> 8) & 0xff] +
		"-" +
		lut[(d2 >> 16) & 0xff] +
		lut[(d2 >> 24) & 0xff] +
		lut[d3 & 0xff] +
		lut[(d3 >> 8) & 0xff] +
		lut[(d3 >> 16) & 0xff] +
		lut[(d3 >> 24) & 0xff]
	);
}
