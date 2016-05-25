//stage
var p = new Point();
var v = new Point();

var stage00 = function(ball, wall){
	for(var i=0; i<wall.length; i++){
		wall[i].initialize();
	}
	for(var i=1; i<ball.length; i++){
		ball[i].initialize();
	}
	wall[00].set(   0, 497, 800, 316, 0, 0, 3, 0);
	wall[01].set(-300,-300, 300, 812, 0, 0, 3, 0);
	wall[02].set( 800,-300, 300, 812, 0, 0, 3, 0);
	nowStage = 0;
};

var stage01 = function(ball, wall){
	for(var i=0; i<wall.length; i++){
		wall[i].initialize();
	}
	for(var i=1; i<ball.length; i++){
		ball[i].initialize();
	}
	wall[00].set(   0, 497, 800, 316, 0, 0, 3, 0);
	wall[01].set(-300,-300, 300, 812, 0, 0, 3, 0);
	wall[02].set( 800,-300, 300, 812, 0, 0, 3, 0);
	wall[03].set( 400,   0,  50, 450, 0, 0, 3, 0);
	wall[01].set(-300,   0, 320, 497, 0, 0, 3, 0);
	wall[02].set( 780,   0, 300, 437, 0, 0, 3, 0);
	wall[04].set( 780, 437,  20,  60, 0, 0, 3, 0);
	wall[06].set( 600, 160, 150,  40, 0, 0, 3, 0);
	wall[07].set( 600,   0,  25, 160, 0, 0, 1, 0);
	wall[08].set( 720, 200,  30,  50, 0, 0, 3, 0);
	wall[09].set( 720, 250,  60,  30, 0, 0, 3, 0);
	wall[11].set( 755, 240,  20,  10, 0, 0, 2, 0);
	nowStage = 1;
};

var stage02 = function(ball, wall){
	for(var i=0; i<wall.length; i++){
		wall[i].initialize();
	}
	for(var i=1; i<ball.length; i++){
		ball[i].initialize();
	}
	//チュートリアル用ステージ
	p.x = 100, p.y = 50;
	//test
	//p.x = 700, p.y = 400;
	ball[0].set(p, ball[0].size, v, 0);
	p.x = 285, p.y = 120;
	ball[1].set(p, 43, v, 1);
	p.x = 650, p.y = 135;
	ball[2].set(p, 15, v, 2);
	p.x = 700, p.y = 135;
	ball[3].set(p, 15, v, 1);
	p.x = 750, p.y = 135;
	ball[4].set(p, 15, v, 2);
	p.x = 240, p.y = 480;
	ball[5].set(p, 22, v, 1);
	p.x = 220, p.y = 420;
	ball[6].set(p, 22, v, 2);

	wall[00].set(   0, 497, 800, 316, 0, 0, 3, 0);
	wall[01].set(-300,-300, 300, 812, 0, 0, 3, 0);
	wall[02].set( 800,-300, 300, 812, 0, 0, 3, 0);
	wall[03].set(   0, 140, 220,  10, 0, 0, 3, 0);
	wall[04].set(   0, 150, 760,  30, 0, 0, 3, 0);
	wall[05].set( 200,   0, 150,  80, 0, 0, 3, 0);
	wall[06].set( 350,   0,  40, 100, 0, 0, 3, 0);
	wall[07].set( 600,   0, 200, 110, 0, 0, 3, 0);
	wall[08].set( 280, 467, 200,  30, 0, 0, 3, 0);
	wall[09].set( 280, 400, 200,  67, 0, 0, 2, 0);
	wall[10].set( 280, 310, 200,  90, 0, 0, 3, 0);
	wall[11].set( 180, 350,  20, 147, 0, 0, 3, 0);
	wall[12].set( 680, 447, 120,  50, 0, 0, 3, 0);
	wall[13].set( 720, 397,  80,  50, 0, 0, 3, 0);
	wall[14].set( 760, 347,  40,  50, 0, 0, 3, 0);
	wall[15].set( 280, 280, 420,  30, 0, 0, 3, 0);
	wall[16].set( 180, 180,  20, 120, 0, 0, 3, 0);
	wall[17].set( 200, 280,  80,  20, 0, 0, 0, 0);
	f1 = false;
	nowStage = 2;
};

var stage03 = function(ball, wall){
	for(var i=0; i<wall.length; i++){
		wall[i].initialize();
	}
	for(var i=1; i<ball.length; i++){
		ball[i].initialize();
	}
	

	wall[00].set(   0, 497, 800, 316,      0, 0, 3, 0, NaN);
	wall[01].set(-300,-300, 300, 812,      0, 0, 3, 0, NaN);
	wall[02].set( 800,-300, 300, 812,      0, 0, 3, 0, NaN);
	//wall[03].set( 200, 350, 200,  30,      0, 0, 3, 2, 600,  4, 10,  0);
	wall[04].set( 400, 350, 200,  30,      0, 0, 2, 0, NaN);
	wall[05].set( 600, 350, 150,  30,      0, 0, 1, 0, NaN);
	wall[06].set( 750, 350,  20,  30,      0, 0, 3, 0, NaN);
	wall[07].set( 770, 360,  30,  50,      0, 0, 3, 2, 600,  9,  20,    0);
	wall[08].set( 700, 100,  30,  30, PI_2/2, 0, 3, 1, NaN,  3);
	wall[09].set( 200, 100,  50,  50,      0, 0, 3, 4, 250,  9, NaN, NaN);
	wall[10].set( 100, 100,  50,  50,      0, 0, 3, 4, 250,  9, NaN, NaN);
	
	wall[03].set( 200, 367, 200,  80,      0, 0, 3, 3,16000,  5,  50, -50);
	wall[05].set( 600, 367, 150,  30,      0, 0, 3, 3, 4500,  3,  50, -50);
	wall[04].set( 400, 350, 200,  30,      0, 0, 3, 4, 6000,  4, 0.5,-0.5);
	wall[04].set( 400, 350, 200,  30,      0, 0, 3, 4, 6000,  4, NaN, NaN);
	wall[04].set( 400, 350, 200,  30,      0, 0, 3, 4, 6000,  4, 40,-40);
	//wall[04].set( 500, 250,  30, 200,      0, 0, 3, 4, 6000,  4, NaN, NaN);
	//wall[04].set( 415, 335, 200,  30,      0, 0, 3, 4, 6000,  4, NaN, NaN);
	nowStage = 3;
};

var stage04 = function(ball, wall){
	for(var i=0; i<wall.length; i++){
		wall[i].initialize();
	}
	for(var i=1; i<ball.length; i++){
		ball[i].initialize();
	}

	wall[00].set(   0, 497, 800, 316, 0, 0, 3, 0);
	wall[01].set(-300,-300, 300, 812, 0, 0, 3, 0);
	wall[02].set( 800,-300, 300, 812, 0, 0, 3, 0);
	wall[03].set(   0, 150, 380, 100, 0, 0, 3, 0);
	wall[04].set( 415, 150, 600, 100, 0, 0, 3, 0);
	//wall[03].set( 200, 350, 400,  30, 0, 0, 3, 0);
	//wall[04].set( 400, 350, 200,  30, 0, 0, 2, 0);
	//wall[04].set( 400, 470, 100,  30, 0, 0, 3, 0);
	nowStage = 4;
};

var stage05 = function(ball, wall){
	for(var i=0; i<wall.length; i++){
		wall[i].initialize();
	}
	for(var i=1; i<ball.length; i++){
		ball[i].initialize();
	}
	

	wall[00].set(   0, 497, 800, 316, 0, 0, 3, 0);
	wall[01].set(-300,-300, 300, 812, 0, 0, 3, 0);
	wall[02].set( 800,-300, 300, 812, 0, 0, 3, 0);
	wall[03].set( 200, 350, 200,  30, 0, 0, 3, 0);
	wall[04].set( 400, 350, 200,  30, 0, 0, 2, 0);
	wall[05].set( 600, 350, 200,  30, 0, 0, 1, 0);
	// wall[06].set( 200, 380, 400,  30, 0, 0, 3, 0);
	//wall[07].set( 400, 380,  30, 117, 0, 0, 3, 0);
	nowStage = 5;
};



