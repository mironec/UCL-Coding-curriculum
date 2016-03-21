var canvas;
var ctx;

var lastMainLoopTime;
var lastSecondTime;
var keysDown;
var mouseButtonsDown;

var frames;
var fps;
var imageRepository;
var currentLevel;
var doDraw, doLogic;

var animationFrameHandle;
var saveFunctionHandle;

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keypress", function (e) {
	onKeyPress(e.keyCode);
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

function onKeyPress(keyCode){
	
}

addEventListener("mousedown", function (e){
	onMouseDown(e.pageX-canvas.offsetLeft, e.pageY-canvas.offsetTop, e.button);
}, false);

addEventListener("mousemove", function (e){
	onMouseMove(e.pageX-canvas.offsetLeft, e.pageY-canvas.offsetTop, e.button);
}, false);

addEventListener("mouseup", function (e){
	onMouseUp(e.pageX-canvas.offsetLeft, e.pageY-canvas.offsetTop, e.button);
}, false);

window.onfocus = function(e){
	doDraw = doLogic = true;
	lastMainLoopTime = Date.now();
}

window.onblur = function(e){
	doDraw = doLogic = false;
}

function onMouseDown(x, y, b){
	mouseButtonsDown[b] = true;
}

function onMouseUp(x, y, b){
	delete mouseButtonsDown[b];
}

function onMouseMove(x, y, b){
	
}

window.addEventListener("resize",function(e){resizeCanvas();},false);

function resizeCanvas(){
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;
}

function init(){
	canvas = document.getElementById("gameCanvas");
	if(canvas==null){
		setTimeout(function(){init();},0);
	}
	else{
		ctx = canvas.getContext("2d");
		if(ctx==null) document.write("Your browser does not support HTML5 Canvas.");
		else {
			resizeCanvas();
			
			imageRepository = new ImageRepository();
			frames = 0;
			fps = 0;
			mouseButtonsDown = {};
			keysDown = {};
			destroy();
			animationFrameHandle = undefined;
			saveFunctionHandle = undefined;
			imageRepository.loadImages([
				'bob','grass1','grass2','grass3','grass4','grass5','grass6','tree1','stump1','redberry1','redberry2','redberry3','redberry4','redberry5'
				],[
				'images/Bob.png','images/Grass1.png','images/Grass2.png','images/Grass3.png','images/Grass4.png','images/Grass5.png','images/Grass6.png','images/Tree1.png','images/Stump1.png',
				'images/FarmingPatch1.png','images/FarmingPatch2.png','images/FarmingPatch3.png','images/FarmingPatch4.png','images/FarmingPatch5.png'
				], function(){postLoad();});
			
		}
	}
}

function savingFunc(key, value){
	if(key !== '' && value === currentLevel){
		return '@currentLevel';
	}
	if(value instanceof Array){
		return value;
	}
	if(value instanceof Object && key !== 'value' && value.constructor.name == "Order" && value.data !== undefined && value.data.callback !== undefined){
		return {value: value, callback: value.data.callback.name, protoHack: value.constructor.name};
	}
	if(value instanceof Object && value.constructor.name === "HTMLImageElement"){
		return {value: imageRepository.findKeyForImage(value), protoHack: value.constructor.name};
	}
	if(typeof value === 'object' && key !== 'value' && key !== ''){
		return {value: value, protoHack: value.constructor.name};
	}
	return value;
}

function savingFunc2(key, value){
	if(value instanceof Object && (value.constructor.name == "Tree" || value.constructor.name == "Character")){
		for(var i = 0;i<currentLevel.gameObjects.length;i++){
			if(currentLevel.gameObjects[i] === value)
				return {value: i, protoHack: value.constructor.name};
		}
	}
	return savingFunc(key, value);
}

function parsingFunc(key, value){
	if(value === "@currentLevel"){
		return currentLevel;
	}
	if(value instanceof Object && value.protoHack === 'Order' && value.callback !== undefined){
		var obj = Object.create(window[value.protoHack].prototype);
		copyProperties(obj, value.value);
		obj.data.callback = currentLevel.spellbook.getFunctionByName(value.callback);
		return obj;
	}
	if(value instanceof Object && value.protoHack !== undefined){
		if(typeof value.value == 'number') return currentLevel.gameObjects[value.value];
		if(value.protoHack === "HTMLImageElement") return imageRepository.getImage(value.value);
		var obj = Object.create(window[value.protoHack].prototype);
		copyProperties(obj, value.value);
		return obj;
	}
	return value;
}

function saveLevel(){
	localStorage.setItem("uncleBob.savedLevelName", currentLevel.moduleName);
	localStorage.setItem("uncleBob.savedSpellbookTabs", JSON.stringify(currentLevel.spellbook.tabs, savingFunc));

	var data = JSON.stringify(
		{gameFocus: currentLevel.gameFocus, done: currentLevel.done,
		persistTutorial: currentLevel.persistTutorial, tutorialText: currentLevel.tutorialText,
		camera: currentLevel.camera, characters: currentLevel.characters,
		thingsToDraw: currentLevel.thingsToDraw, map: currentLevel.map}
		, savingFunc2);

	var data2 = JSON.stringify(currentLevel.gameObjects, savingFunc);

	localStorage.setItem("uncleBob.savedLevel", data);

	localStorage.setItem("uncleBob.savedGameObjects", data2);
	saveFunctionHandle = setTimeout(saveLevel, 1000*15);
}

function loadLevel(){
	if(currentLevel !== undefined) currentLevel.destroy();

	currentLevel = window[localStorage.getItem("uncleBob.savedLevelName")];
	currentLevel.setCtx(ctx);
	currentLevel.setImageRepository(imageRepository);
	currentLevel.start();

	var spellbookTabs = JSON.parse(localStorage.getItem("uncleBob.savedSpellbookTabs"), parsingFunc);
	currentLevel.spellbook.tabs = spellbookTabs;
	for(var k = 0; k < currentLevel.spellbook.tabs.length; k++){
		currentLevel.spellbook.pointerTab = k;
		currentLevel.spellbook.saveText();
	}

	var someObjs = JSON.parse(localStorage.getItem("uncleBob.savedGameObjects"), parsingFunc);
	currentLevel.gameObjects = someObjs;

	var someObj = JSON.parse(localStorage.getItem("uncleBob.savedLevel"), parsingFunc);

	copyProperties(currentLevel, someObj);

	return someObj;
}

function copyProperties(recipient, source){
	for(var i in source){
		if(!source.hasOwnProperty(i)) continue;
		else recipient[i] = source[i];
	}
}

function postLoad(){
	if(localStorage.getItem("uncleBob.savedLevel") !== undefined && localStorage.getItem("uncleBob.savedLevel") !== "" &&
	   localStorage.getItem("uncleBob.savedGameObjects") !== undefined && localStorage.getItem("uncleBob.savedGameObjects") !== "" &&
	   localStorage.getItem("uncleBob.savedSpellbookTabs") !== undefined && localStorage.getItem("uncleBob.savedSpellbookTabs") !== "" &&
	   localStorage.getItem("uncleBob.savedLevelName") !== undefined && localStorage.getItem("uncleBob.savedLevelName") !== "") {
		loadLevel();
	}
	else{
		currentLevel = level1;
		currentLevel.setCtx(ctx);
		currentLevel.setImageRepository(imageRepository);
		currentLevel.start();
	}
	
	doDraw = doLogic = true;
	lastSecondTime = Date.now();
	
	mainLoop();

	saveFunctionHandle =  setTimeout(saveLevel, 1000*5);
}

function draw(delta){
	currentLevel.draw();
	
	ctx.fillStyle = "#000000";
	ctx.font = "12px Arial";
	ctx.fillText(fps,10,10);
}

function update(delta){
	currentLevel.update(delta);
}

var mainLoop = function(){
	var now = Date.now();
	var delta = now - lastMainLoopTime;
	if(delta>250){delta=250;}

	frames++;
	if(Date.now() - lastSecondTime >= 1000) {
		fps = frames;
		frames = 0;
		lastSecondTime += 1000;
	}
	
	if(doLogic) update(delta);
	if(doDraw) draw(delta);

	lastMainLoopTime = now;
	
	animationFrameHandle = requestAnimationFrame(mainLoop);
}

var destroy = function(){
	if(animationFrameHandle !== undefined) cancelAnimationFrame(animationFrameHandle);
	if(saveFunctionHandle !== undefined) clearTimeout(saveFunctionHandle);
}

lastMainLoopTime = Date.now();
