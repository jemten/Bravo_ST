
/*
Adapted from truseq_nano.js by Joel Gruselius / AJ
*/
runset.clear();


var path = "C:/VWorks Workspace/Protocol Files/development/aj/ST/";
var form = "ST.VWForm";

//Check this sentence with JG
run("C:/VWorks Workspace/Protocol Files/truseq-nano/resources/clear_inventory.bat", true);


var runsetMode = false;	// Alt settings for library prep runset (true/false)


if (typeof formRows !== 'undefined'){
	//formRows set in VWForm
	formRows = parseInt(formRows, 10);
} else {
	var formRows = 1;
};

 // Commented out, bring back for time managment
if (parseInt(formTimeMod,10) === 0){
	var timeMod = 60;
} else if (parseInt(formTimeMod) === 1){
	var timeMod = 1;
} else {
	throw "Weird time mode";
};
print("This is formTimeMod, " + formTimeMod);

// Staring parameters.
var strtVariables = {
	tipBox:"TipBox1",
	tips:[1,2,3,4,5,6,7,8],
	trashTipBox:"EmptyTipBox",
	trashposition:1,
	trashTips:[1,2,3,4,5,6,7,8],
	oilPlate:"BeadPlate",
	oilPosition:6,
	waterPlate:"BeadPlate",
	waterPosition:5
};

var presets = {};

presets["Second strand synthesis"] = {
	sampleRow:1,
	sampleVolume:65,
	secondSSRow:2,
	secondSSMixVolume:5,
	secondSSReactionRow:1,
	secondSSIncubationTemp:16,
	// incubation time in min
	secondSSIncubationTime:120 * timeMod,
	infillMixRow:3,
	infillReactionRow:2,
	infillMixVolume:5,
	// incubation time in min
	infillIncubationTime:20 * timeMod,
	infillIncubationTemp:16,
	stopMixRow:4,
	stopMixVolume:25
	};

presets["First SPRI cleanup"] = {
	//samplePlate:"EnzymePlate",
	sampleRow:4,
	sampleVolume:100,
	//beadPlate:"BeadPlate",
	beadRow:1,
	beadVolume:100,
	//bindPlate:"BeadPlate",
	//bindPlate:"CleanUpPlate",
	bindRow:8,
	//sepPlate:"ReactionPlate",
	sepRow:3,
	//elutionPlate:"EnzymePlate",
	eluteInRow:6,
	elutionMixPlate:"EnzymePlate",
	elutionMixRow:5,
	elutionMixVolume:12,
	//ethanolPlate:"BeadPlate",
	ethanolRow:2,
	bindTime:5 * timeMod,
	elutionTime:2 * timeMod,
	ethanolDryTime:10 * timeMod,
	pelletTime:1 * timeMod,
	pelletTimeShort:0.5 * timeMod,
	pelletTimeLong:3 * timeMod,
	nextTemp4:4,
	nextTemp6:37
	};

presets["In vitro transcription"] = {
	sampleRow:6,
	sampleVolume:16,
	ivtRow:4,
	ivtTemp:37,
	// incubation time in hours to seconds
	ivtTime:14 * timeMod * timeMod,
	postIvtRow:7,
	dilutionRow:4,
	dilutionVolume:14
	};

presets["Second SPRI cleanup"] = {
	sampleRow:7,
	sampleVolume:30,
	beadRow:1,
	beadVolume:54,
	//bindRow:4,
	bindRow:7,
	//sepRow:4,
	sepRow:7,
	eluteInRow:8,
	elutionMixRow:4,
	elutionMixVolume:10,
	ethanolRow:3,
	bindTime:5 * timeMod,
	elutionTime:2 * timeMod,
	ethanolDryTime:10 * timeMod,
	pelletTime:1 * timeMod,
	pelletTimeShort:0.5 * timeMod,
	pelletTimeLong:3 * timeMod,
	nextTemp4:4,
	nextTemp6:21
	};

presets["Adapter ligation"] = {
	sampleRow:1,
	sampleVolume:10.5,
	ligationRow:1,
	adapterDenatTemp:70,
	adapterDenatTime:2 * timeMod,
	t4RnaLigaseRow:2,
	t4RnaLigaseVolume:4.5,
	ligationTemp:25,
	ligationTime:60 * timeMod,
	dilutionRow:4,
	dilutionVolume:15
	};

presets["Adapter SPRI cleanup"] = {
	sampleRow:2,
	sampleVolume:30,
	beadRow:1,
	beadVolume:54,
	bindRow:2,
	sepRow:2,
	eluteInRow:3,
	elutionMixRow:4,
	elutionMixVolume:10,
	ethanolRow:2,
	bindTime:5 * timeMod,
	elutionTime:2 * timeMod,
	ethanolDryTime:10 * timeMod,
	pelletTime:1 * timeMod,
	pelletTimeShort:0.5 * timeMod,
	pelletTimeLong:3 * timeMod,
	nextTemp4:4,
	nextTemp6:65
	};

presets["cDNA synthesis"] = {
	sampleRow:3,
	sampleVolume:12,
	cdnaSynthesisRow:3,
	primerDenatTemp:65,
	primerDenatTime:5 * timeMod,
	superscriptRow:4,
	superscriptVolume:8,
	cdnaSynthesisTemp:50,
	cdnaSynthesisTime:60 * timeMod,
	dilutionRow:4,
	dilutionVolume:10
	};

presets["cDNA SPRI cleanup"] = {
	sampleRow:4,
	sampleVolume:30,
	beadRow:1,
	beadVolume:54,
	bindRow:4,
	sepRow:4,
	eluteInRow:8,
	elutionMixRow:4,
	elutionMixVolume:10,
	ethanolRow:3,
	bindTime:5 * timeMod,
	elutionTime:2 * timeMod,
	ethanolDryTime:10 * timeMod,
	pelletTime:1 * timeMod,
	pelletTimeShort:0.5 * timeMod,
	pelletTimeLong:3 * timeMod,
	nextTemp4:4,
	nextTemp6:21
	};

var settings = {};

var fileNames = {};
fileNames["Second strand synthesis"] = "ST_second_strand_synthesis.pro";
fileNames["First SPRI cleanup"] = "ST_large_vol_SPRI.pro";
fileNames["ST part 1"] = "ST_part1.rst";
fileNames["ST part 2"] = "ST_part2.rst";

var runsetOrder = [];

// Check the alteration of runsetMode betweeen True and False
if(formProtocol === "ST part 1") {
	runsetMode = true;
	runsetOrder = ["Second strand synthesis","First SPRI cleanup", "In vitro transcription", "Second SPRI cleanup"];
	runset.openRunsetFile(path+fileNames[formProtocol], form);
} else if(formProtocol === "ST part 2") {
	runsetMode = true;
	runsetOrder = ["Adapter ligation","Adapter SPRI cleanup", "cDNA synthesis", "cDNA SPRI cleanup"];
	runset.openRunsetFile(path+fileNames[formProtocol], form);
} else {
	runsetMode = true;
	runset.appendProtocolFileToRunset(path+fileNames[formProtocol], 1, "", form);
	updateSettings(formProtocol);
}

function updateSettings(protocol) {
	settings = {};
	if(protocol in presets) {
		for(var s in presets[protocol]) {
			settings[s] = presets[protocol][s];
		}
	} else {
		throw "EXCEPTION__UndefinedSetting:"+protocol;
	}
	print(protocol + " preset loaded");
}

//Check this
var runsetIndex = 0;
function updateRunset() {
	updateSettings(runsetOrder[runsetIndex++]);
}

// Dynamic Pipetting Height 2.0:
function dph(vol, endHeight) {
	var v = parseFloat(vol);
	var e = parseFloat(endHeight);
	if(v > 0 && e > 0 && !isNaN(v+e)) {
		return 0.078 - 9.501E-5*v + (0.734-e)/v;
	} else {
		throw "ValueException";
	}
}

/* Pipette tip counter
	Returns an object with the number of tips that are left.
	If a new tipBox is required the tipBox varaible will change
	access by tipCounter.tipsLeft and tipCoutner.tipBox*/
function tipCounter(rows, tipsUsed){
	/*
	if (tipsLeft < rows ){
		tipBox = "TipBox2";
		tipsLeft = 9;
	}
	*/
	var tipsLeft = tipsLeft - rows;
	/*
	if (tipsLeft < rows ){
		tipBox = "TipBox2";
		tipsLeft = 9;
		throw "Time to change box"
	}
	*/
	return {tipBox:tipBox, tipsLeft:tipsLeft};
}

function tipTrashPosition(rows, trashPosition){
	if (trashPosition == 0 || (8 - trashPosition - rows) <= 0){
		trashPosition = 1;
	}else{
		var trashPosition = trashPosition + rows;
	}
	return trashPosition;
}

/*
function tipsInTrash(rows, rowsUsed){
	var rowsUsed = rowsUsed + rows;
	var nextRow = rowsUsed + 1;
	if ((9 - nextRow - rows) < 0 ) {
		nextRow = 1;
		rowsUsed = 0;
	}
	return {rowsUsed:rowsUsed, nextRow:nextRow};
}
*/
function tipsInTrash(trashTips, headMode){
	var rows = parseInt(headMode.split(",")[2], 10);
	var direction = parseInt(headMode.split(",")[1], 10);
	// direction = 2; the headmode is set to use the back rows
	// direction = 3: the headmode is set to use the front rows
	if (direction === 1 || direction === 2){
		// starting array is [1,2,3,4,5,6,7,8]
		// 1 and 2 signals that the back rows are used
		var trashTipRow = trashTips[0];
		trashTips = trashTips.slice(rows, trashTips.length);
	}else if (direction === 0 || direction === 3){
		// 0 and 3 signals that the front rows are used.
		var trashTipRow = trashTips[0] + rows - 1;
		trashTips = trashTips.slice(rows, trashTips.length);
	}else{
		throw "Weird headMode";
	}	return {trashTips:trashTips, trashTipRow:trashTipRow};
}


function tipTracker(tips, headMode){
	var rows = parseInt(headMode.split(",")[2], 10);
	var direction = parseInt(headMode.split(",")[1], 10);
	// direction = 2; the headmode is set to use the back rows
	// direction = 3: the headmode is set to use the front rows
	if (direction === 1 || direction === 2){
		// 1 and 2 signals that the back rows are used
		var tipRow = tips[tips.length-rows];
		// tipRow is the upmost tip row that will be used
		tips = tips.slice(0, tips.length - rows);
		// tips is an array that looks like this at the start [1,2,3,4,5,6,7,8]
	}else if (direction === 0 || direction === 3){
		// 0 and 3 signals that the front rows are used.
		var tipRow = tips[rows - 1];
		tips = tips.slice(rows, tips.length);
	}else{
		throw "Weird headMode";
	}
	return {tips:tips, tipRow:tipRow};
}

function dispRows(rows, dispPosition){
	var dispArray = new Array(rows);
	for (i = 0; i < rows; i++){
		dispArray[i] = [(i+dispPosition), 1];
	}
	return dispArray;
}
