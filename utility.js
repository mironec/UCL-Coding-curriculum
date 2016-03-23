"use strict";
requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.mozRequestAnimationFrame;

function copyProperties(recipient, source){
	for(var i in source){
		if(!source.hasOwnProperty(i)) continue;
		else recipient[i] = source[i];
	}
}

function BoundingBoxClip(x1, y1, width1, height1, x2, y2, width2, height2){
	if(width1 === undefined){
		width1 = x1.width;
		height1 = x1.height;
		x2 = y1.x;
		y2 = y1.y;
		width2 = y1.width;
		height2 = y1.height;
		y1 = x1.y;
		x1 = x1.x;
	}

	return (x1 <= x2 + width2 && x1 + width1 >= x2 && y1 <= y2 + height2 && y1 + height1 >= y2);
}

function BoundingBoxClipStrict(x1, y1, width1, height1, x2, y2, width2, height2){
	if(width1 === undefined){
		width1 = x1.width;
		height1 = x1.height;
		x2 = y1.x;
		y2 = y1.y;
		width2 = y1.width;
		height2 = y1.height;
		y1 = x1.y;
		x1 = x1.x;
	}

	return (x1 < x2 + width2 && x1 + width1 > x2 && y1 < y2 + height2 && y1 + height1 > y2);
}

function BoundingBoxDistance(x1, y1, width1, height1, x2, y2, width2, height2){
	if(width1 === undefined){
		width1 = x1.width;
		height1 = x1.height;
		x2 = y1.x;
		y2 = y1.y;
		width2 = y1.width;
		height2 = y1.height;
		y1 = x1.y;
		x1 = x1.x;
	}

	return (x1 <= x2 + width2 && x1 + width1 >= x2 && y1 <= y2 + height2 && y1 + height1 >= y2);
}

function pointInBoundingBox(xp, yp, xb, yb, widthb, heightb){
	return (xp >= xb && xp <= xb + widthb && yp >= yb && yp <= yb + heightb);
}