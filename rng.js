var save

// Input for save
document.getElementById("saveInput").addEventListener("paste", (event) => {
	onSavePaste(event);
});

function onSavePaste(event) {
	let paste = event.clipboardData.getData("text");
	save = JSON.parse(decompressFromBase64(paste));
}

