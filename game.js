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
				'bob','grass1','grass2','grass3','grass4','grass5','grass6','tree1','stump1','redberry1','redberry2','redberry3','redberry4','redberry5','HouseBL1','HouseBL2','HouseBL3','HouseBR1', 'HouseBR2', 'HouseBR3', 'HouseTL1', 'HouseTL2', 'HouseTL3', 'HouseTR1', 'HouseTR2', 'HouseTR3'
				],[
				'images/Bob.png','images/Grass1.png','images/Grass2.png','images/Grass3.png','images/Grass4.png','images/Grass5.png','images/Grass6.png','images/Tree1.png','images/Stump1.png',
				'images/FarmingPatch1.png','images/FarmingPatch2.png','images/FarmingPatch3.png','images/FarmingPatch4.png','images/FarmingPatch5.png',
                //House images set of 4, BotLeft, BotRight, TopLeft, TopRight
                'images/HouseBL1.png', 'images/HouseBL2.png', 'images/HouseBL3.png','images/HouseBR1.png', 'images/HouseBR2.png', 'images/HouseBR3.png','images/HouseTL1.png', 'images/HouseTL2.png', 'images/HouseTL3.png','images/HouseTR1.png', 'images/HouseTR2.png', 'images/HouseTR3.png'
				], function(){postLoad();});
			
		}
	}
}

function postLoad(){
	if(localStorage.getItem("uncleBob.savedLevel") !== undefined && localStorage.getItem("uncleBob.savedLevel") !== "" &&
	   localStorage.getItem("uncleBob.savedGameObjects") !== undefined && localStorage.getItem("uncleBob.savedGameObjects") !== "" &&
	   localStorage.getItem("uncleBob.savedSpellbookTabs") !== undefined && localStorage.getItem("uncleBob.savedSpellbookTabs") !== "" &&
	   localStorage.getItem("uncleBob.savedLevelName") !== undefined && localStorage.getItem("uncleBob.savedLevelName") !== "") {
	   	if(currentLevel !== undefined) currentLevel.destroy();
	   	currentLevel = window[localStorage.getItem("uncleBob.savedLevelName")];
		currentLevel.setCtx(ctx);
		currentLevel.setImageRepository(imageRepository);
		currentLevel.start();
		currentLevel.load();
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

	saveFunctionHandle =  setTimeout(function(){currentLevel.save();}, 1000*5);
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
