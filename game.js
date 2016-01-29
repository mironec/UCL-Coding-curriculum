var canvas;
var ctx;

var lastMainLoopTime;
var keysDown = {};
var mouseButtonsDown = {};

var drawCycle = 0;
var thingsToDraw = [];
var grassPattern1, grassPattern2;

const FOCUS_GAME = 0;
const FOCUS_SCRIPT_BAR = 1;
var gameFocus=FOCUS_GAME;
var scriptBar = "";
var characters = new CharacterList();
var imageRepository = new ImageRepository();

var camera = {
	x: 0.0,
	y: 0.0
};
var startClick = {
	x: 0.0,
	y: 0.0
};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
	
	if(gameFocus == FOCUS_SCRIPT_BAR && (e.keyCode == 8 || e.keyCode == 46)) {
		e.preventDefault();
		
		onKeyPress(e.keyCode);
	}
}, false);

addEventListener("keypress", function (e) {
	onKeyPress(e.keyCode);
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

function onKeyPress(keyCode){
	if(13 == keyCode || 10 == keyCode){
		if(gameFocus == FOCUS_GAME) {gameFocus=FOCUS_SCRIPT_BAR; scriptBar = "";}
		else if(gameFocus == FOCUS_SCRIPT_BAR) {
			gameFocus=FOCUS_GAME;
			eval(scriptBar);
		}
	}
	
	if(gameFocus == FOCUS_SCRIPT_BAR && keyCode != 10 && keyCode != 13){
		if(keyCode == 8) scriptBar=scriptBar.substring(0,scriptBar.length-1);	//Backspace
		//else if(keyCode == 46) scriptBar=scriptBar.substring(1,scriptBar.length);	//Delete
		else scriptBar += String.fromCharCode(keyCode);
	}
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

function onMouseDown(x, y, b){
	startClick.x = x;
	startClick.y = y;
	mouseButtonsDown[b] = true;
}

function onMouseUp(x, y, b){
	camera.x += x-startClick.x;
	camera.y += y-startClick.y;
	delete mouseButtonsDown[b];
}

function onMouseMove(x, y, b){
	if(!(b in mouseButtonsDown)) return;
	camera.x += x-startClick.x;
	camera.y += y-startClick.y;
	startClick.x=x;
	startClick.y=y;
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
	grassPattern1 = ctx.createPattern(imageRepository.getImage('grass1'), "repeat");
	grassPattern2 = ctx.createPattern(imageRepository.getImage('grass2'), "repeat");
	
	var bob = new Character("Bob",0,0);
	bob.getImageFromRepo('bob',imageRepository);
	addCharacter(bob);
	
	var tree1 = new Tree(300,0,imageRepository.getImage('tree1'),imageRepository.getImage('stump1'));
	thingsToDraw.push(tree1);
	
	mainLoop();
}

function draw(delta){
	var seed = 3824723.4358;
	var pseudoRand = seed;
	
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	ctx.save();
	ctx.translate(camera.x, camera.y);
	
	for(x=-canvas.width;x<canvas.width*2;x+=64){
		for(y=-canvas.height;y<canvas.height*2;y+=64){
			pseudoRand = ('0.'+Math.sin(pseudoRand).toString().substr(6));
			if(pseudoRand<0.5 && grassPattern1) ctx.fillStyle = grassPattern1;
			else if(pseudoRand>=0.5 && grassPattern2) ctx.fillStyle = grassPattern2;
			else ctx.fillStyle = "#009900";
			ctx.fillRect(x,y,64,64);
		}
	}
	
	
	
	ctx.save();
	ctx.translate(canvas.width/2,canvas.height/2);
	for(i=0;i<thingsToDraw.length;i++){
		thingsToDraw[i].draw(ctx);
	}
	ctx.restore();
	
	ctx.restore();
	ctx.fillStyle = "#000000";
	ctx.fillText(drawCycle,10,10);
	
	if(gameFocus == FOCUS_SCRIPT_BAR){
		ctx.fillStyle = "rgba(0,0,0,0.3)";
		ctx.fillRect(0,canvas.height-18,canvas.width, 18);
		ctx.fillStyle = "rgba(255,255,255,0.7)";
		ctx.font="14px Arial";
		ctx.fillText(scriptBar,5,canvas.height-4);
	}
	
	drawCycle++;
}

function update(delta){
	characters.update(delta);
}

var mainLoop = function(){
	var now = Date.now();
	var delta = now - lastMainLoopTime;

	update(delta);
	draw(delta);

	lastMainLoopTime = now;
	
	requestAnimationFrame(mainLoop);
}

function getCharacter(name){
	var retCharacterList = new CharacterList();
	var func = function(){if(this.name == name) retCharacterList.add(this);}
	characters.forEach(func);
	return retCharacterList;
}

function addCharacter(character){
	characters.add(character);
	thingsToDraw.push(character);
}

lastMainLoopTime = Date.now();
init();
