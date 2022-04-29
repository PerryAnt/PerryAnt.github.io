import { LZString } from "./lz-string.js";

let save

// Input for save
document.getElementById("saveInput").addEventListener("paste", (event) => {
	onSavePaste(event);
});

function onSavePaste(event) {
	let paste = event.clipboardData.getData("text");
	save = JSON.parse(LZString.decompressFromBase64(paste));
}

