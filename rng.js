var save;
var game = newGame();

// Input for save
document.getElementById("saveInput").addEventListener("paste", (event) => {
	onSavePaste(event);
});

function onSavePaste(event) {
	let paste = event.clipboardData.getData("text");
	save = JSON.parse(LZString.decompressFromBase64(paste));
}

function createHeirloom(zone, fromBones, spireCore, forceBest){
	var slots = game.heirlooms.slots;
	var rarityNames = game.heirlooms.rarityNames;
	//Determine Type
	var seed = (fromBones) ? game.global.heirloomBoneSeed : game.global.heirloomSeed;
	if (forceBest) seed = game.global.bestHeirloomSeed;
	var type;
	var rarity;
	if (spireCore){
		type = "Core";
		rarity = Math.round((zone - 200) / 100);
		if (rarity > 6) rarity = 6;
		if (rarity < 0) rarity = 0;
		game.stats.coresFound.value++;
		seed = game.global.coreSeed;
	}
	else{
		type = (getRandomIntSeeded(seed++, 0, 2) == 0) ? "Shield" : "Staff";
		//Determine type rarity
		rarity = getHeirloomRarity(zone, seed++, fromBones, forceBest);
	}
	//Sort through modifiers and build a list of eligible items. Check filters if applicable
	var eligible = [];
	for (var item in game.heirlooms[type]){
		var heirloom = game.heirlooms[type][item];
		if (item == "empty" && (rarity == 0 || rarity == 1)) continue;
		if (typeof heirloom.filter !== 'undefined' && !heirloom.filter()) continue;
		if (heirloom.steps && heirloom.steps[rarity] === -1) continue;
		eligible.push(item);
	}

	slots = slots[rarity];
	var name = rarityNames[rarity] + " " + type;
	//Heirloom configuration
	//{name: "", type: "", rarity: #, mods: [[ModName, value, createdStepsFromCap, upgradesPurchased, seed]]}
	var buildHeirloom = {id: (game.stats.totalHeirlooms.valueTotal + game.stats.totalHeirlooms.value), nuMod: 1, name: name, type: type, repSeed: getRandomIntSeeded(seed++, 1, 10e6), rarity: rarity, mods: []};
	buildHeirloom.icon = ((type == "Core") ? 'adjust' : (type == "Shield") ? '*shield3' : 'grain')
	var x = 0;
	if (!game.heirlooms.canReplaceMods[rarity]){
		x++;
		buildHeirloom.mods.push(["empty", 0, 0, 0, getRandomIntSeeded(seed++, 0, 1000)]);
	}
	for (x; x < slots; x++){
		var roll = getRandomIntSeeded(seed++, 0, eligible.length);
		var thisMod = eligible[roll];
		eligible.splice(roll, 1);
		var steps = (typeof game.heirlooms[type][thisMod].steps !== 'undefined') ? game.heirlooms[type][thisMod].steps : game.heirlooms.defaultSteps;
		steps = getRandomBySteps(steps[rarity], null, seed++);
		buildHeirloom.mods.push([thisMod, steps[0], steps[1], 0, getRandomIntSeeded(seed++, 0, 1000)]);
	}
	seed += 6 - (x * 2);
	buildHeirloom.mods.sort(function(a, b){
		a = a[0].toLowerCase();
		b = b[0].toLowerCase();
		if (a == "empty") return 1;
		if (b == "empty" || b > a) return -1;
		return a > b
	})
	if (game.global.challengeActive == "Daily" && !fromBones){
		buildHeirloom.nuMod *= (1 + (getDailyHeliumValue(countDailyWeight()) / 100));
	}
	if (autoBattle.oneTimers.Nullicious.owned && game.global.universe == 2) buildHeirloom.nuMod *= autoBattle.oneTimers.Nullicious.getMult();
	game.global.heirloomsExtra.push(buildHeirloom);
	displaySelectedHeirloom(false, 0, false, "heirloomsExtra", game.global.heirloomsExtra.length - 1, true);
	if ((game.stats.totalHeirlooms.value + game.stats.totalHeirlooms.valueTotal) == 0) document.getElementById("heirloomBtnContainer").style.display = "block";
	game.stats.totalHeirlooms.value++;
	checkAchieve("totalHeirlooms");
	if (heirloomsShown) displayExtraHeirlooms();
	if (spireCore) game.global.coreSeed = seed;
	else if (fromBones) game.global.heirloomBoneSeed = seed;
	else if (forceBest) game.global.bestHeirloomSeed = seed;
	else game.global.heirloomSeed = seed;
}

function getRandomBySteps(steps, mod, seed){
		if (mod && typeof mod[4] !== 'undefined'){
			seed = mod[4]++;
		}
		var possible = ((steps[1] - steps[0]) / steps[2]);
		var roll = getRandomIntSeeded(seed, 0, possible + 1);
		var result = steps[0] + (roll * steps[2]);
		result = Math.round(result * 100) / 100;
		return ([result, Math.round(possible - roll)]);
}

function getHeirloomZoneBreakpoint(zone, forBones){
	if (!zone) zone = game.global.world;
	var rarityBreakpoints = game.heirlooms.rarityBreakpoints;
	var universeBreakpoints = game.heirlooms.universeBreakpoints;
	var universe = game.global.universe;
	if (forBones && game.global.totalRadPortals > 0) universe = 2;
	for (var x = 0; x < rarityBreakpoints.length; x++){
		if (zone < rarityBreakpoints[x] && universe <= universeBreakpoints[x]) return x;
		if (universe < universeBreakpoints[x]) return x;
	}
	return rarityBreakpoints.length;
}

function getHeirloomRarityRanges(zone, forBones, forceIndex){
	if (forBones){
		if (game.global.totalRadPortals > 0) zone = game.global.highestRadonLevelCleared + 1;
		else zone = game.global.highestLevelCleared + 1;
	}
	var useBreakpoint = (typeof forceIndex !== 'undefined') ? forceIndex : getHeirloomZoneBreakpoint(zone, forBones); 
	var rarities = game.heirlooms.rarities[useBreakpoint];
	var canLower = 0;
	var addBonus = false;
	if (Fluffy.isRewardActive("stickler") && !(forBones && game.global.universe == 1 && game.global.totalRadPortals > 0)){
		canLower = 500;
		addBonus = true;
	}
	var newRarities = [];
	for (var x = 0; x < rarities.length; x++){
		if (rarities[x] == -1) {
			newRarities.push(-1);
			continue;
		}
		var newRarity = rarities[x];
		if (canLower > 0){
			if (newRarity > canLower){
				newRarity -= canLower;
				canLower = 0;
			}
			else {
				canLower -= newRarity;
				newRarities.push(-1);
				continue;
			}
		}
		if (addBonus && ((rarities.length - 1 == x) || rarities[x + 1] == -1)){
			newRarity += 500;
		}
		newRarities.push(newRarity);
	}
	return newRarities;
}

function getHeirloomRarity(zone, seed, fromBones, forceBest){ //Zone is optional, and will override world
	if (!zone) zone = game.global.world;
	var rarities = getHeirloomRarityRanges(zone, fromBones);
	var nextTest = 0;
	var selectedRarity;
	var rarityRoll = getRandomIntSeeded(seed, 0, 10000);
	if (forceBest) rarityRoll = 9999;
	for (var y = 0; y < rarities.length; y++){
		if (rarities[y] == -1) continue;
		nextTest += rarities[y];
		if (rarityRoll < nextTest) {
			selectedRarity = y;
			break;
		}
	}
	if (zone >= 146 && selectedRarity == 1) giveSingleAchieve("Consolation Prize");
	return selectedRarity;
}

function seededRandom(seed){
	var x = Math.sin(seed++) * 10000;
	return parseFloat((x - Math.floor(x)).toFixed(7));
}

function getRandomIntSeeded(seed, minIncl, maxExcl) {
	var toReturn = Math.floor(seededRandom(seed) * (maxExcl - minIncl)) + minIncl;
	return (toReturn === maxExcl) ? minIncl : toReturn;
}
