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

function postLoad(){
	//currentLevel = new Level(ctx, imageRepository);
	level1.setCtx(ctx);
	level1.setImageRepository(imageRepository);
	currentLevel = level1;
	currentLevel.start();
	
	doDraw = doLogic = true;
	lastSecondTime = Date.now();
	
	mainLoop();
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
