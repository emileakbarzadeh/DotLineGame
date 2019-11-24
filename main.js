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
				'<div class="dot-vline-cont row-cont"><span class="dot"></span>' +
				'<div class="vline line"></div> </div><div class="hline-cont row-cont"><div class="hline line"></div></div>';
		}
		squareRow.innerHTML =
			squareRow.innerHTML +
			'<div class="dot-vline-cont row-cont"><span class="dot"></span>' +
			'<div class="vline line"></div>';
		mainInner.appendChild(squareRow);
	}
	let squareRow = document.createElement("DIV");
	squareRow.className = "square-row";
	for (let j = 0; j < dimension; j++) {
		squareRow.innerHTML =
			squareRow.innerHTML +
			'<div class="dot-vline-cont row-cont"><span class="dot"></span>' +
			'</div> </div><div class="hline-cont row-cont"><div class="hline line"></div></div>';
	}
	squareRow.innerHTML =
		squareRow.innerHTML +
		'<div class="dot-vline-cont row-cont"><span class="dot"></span></div>';
	mainInner.appendChild(squareRow);
	console.log("hi there");
}
