var canvas;
var ctx;

var lastMainLoopTime;
var lastSecondTime;
var keysDown = {};
var mouseButtonsDown = {};

var frames = 0;
var fps = 0;
var imageRepository = new ImageRepository();
var currentLevel;
var doDraw, doLogic;

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
			
			imageRepository.loadImages(['bob','grass1','grass2','tree1','stump1'],['images/Bob.png','images/Grass1.png','images/Grass2.png','images/Tree1.png','images/Stump1.png'],
			function(){postLoad();}  );
			
		}
	}
}

function saveLevel(){
	var data = JSON.stringify(
		{moduleName: currentLevel.moduleName, gameFocus: currentLevel.gameFocus,
		done: currentLevel.done, tutorialText: currentLevel.tutorialText, persistTutorial: currentLevel.persistTutorial,
		camera: currentLevel.camera, spellbookTabs: currentLevel.spellbook.tabs,
		characters: currentLevel.characters, thingsToDraw: currentLevel.thingsToDraw,
		map: currentLevel.map}
		, function(key, value){
		if(key !== '' && value === currentLevel){
			return '@currentLevel';
		}
		if(value instanceof Array){
			return value;
		}
		if(value.constructor.name == "Tree" || value.constructor.name == "Character"){
			for(var i = 0;i<currentLevel.gameObjects.length;i++){
				if(currentLevel.gameObjects[i] === value)
					return {value: i, protoHack: value.constructor.name};
			}
		}
		if(value.constructor.name === "HTMLImageElement"){
			return {value: imageRepository.findKeyForImage(value), protoHack: value.constructor.name};
		}
		if(typeof value === 'object' && key !== 'value' && key !== ''){
			return {value: value, protoHack: value.constructor.name};
		}
		return value;
	});

	var data2 = JSON.stringify(currentLevel.gameObjects, function(key, value){
		if(key !== '' && value === currentLevel){
			return '@currentLevel';
		}
		if(value instanceof Array){
			return value;
		}
		if(value.constructor.name === "HTMLImageElement"){
			return {value: imageRepository.findKeyForImage(value), protoHack: value.constructor.name};
		}
		if(typeof value === 'object' && key !== 'value' && key !== ''){
			return {value: value, protoHack: value.constructor.name};
		}
		return value;
	});

	localStorage.setItem("uncleBob.savedLevel", data);

	localStorage.setItem("uncleBob.savedGameObjects", data2);
	setTimeout(saveLevel, 1000*15);
}

function loadLevel(){
	var someObjs = JSON.parse(localStorage.getItem("uncleBob.savedGameObjects"), function(key, value){
		if(value === "@currentLevel")
			return currentLevel;
		if(value instanceof Object && value.protoHack !== undefined){
			if(value.protoHack === "HTMLImageElement") return imageRepository.getImage(value.value);
			var obj = Object.create(window[value.protoHack].prototype);
			copyProperties(obj, value.value);
			return obj;
		}
		return value;
	});

	var someObj = JSON.parse(localStorage.getItem("uncleBob.savedLevel"), function(key, value){
		if(value === "@currentLevel")
			return currentLevel;
		if(value instanceof Object && value.protoHack !== undefined){
			if(typeof value.value == 'number') return someObjs[value.value];
			if(value.protoHack === "HTMLImageElement") return imageRepository.getImage(value.value);
			var obj = Object.create(window[value.protoHack].prototype);
			copyProperties(obj, value.value);
			return obj;
		}
		return value;
	});

	if(currentLevel !== undefined) currentLevel.destroy();
	currentLevel = window[someObj.moduleName];
	currentLevel.setCtx(ctx);
	currentLevel.setImageRepository(imageRepository);
	currentLevel.start();

	copyProperties(currentLevel, someObj);

	currentLevel.spellbook.tabs = currentLevel.spellbookTabs;
	delete currentLevel.spellbookTabs;
	for(var k = 0; k < currentLevel.spellbook.tabs.length; k++){
		currentLevel.spellbook.pointerTab = k;
		currentLevel.spellbook.saveText();
	}

	currentLevel.gameObjects = someObjs;

	return someObj;
}

function copyProperties(recipient, source){
	for(var i in source){
		if(!source.hasOwnProperty(i)) continue;
		recipient[i] = source[i];
	}
}

function postLoad(){
	if(localStorage.getItem("uncleBob.savedLevel") !== undefined && localStorage.getItem("uncleBob.savedLevel") !== "") {
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

	setTimeout(saveLevel, 1000*5);
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
	
	requestAnimationFrame(mainLoop);
}

lastMainLoopTime = Date.now();
init();
