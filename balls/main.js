// -global ------------------------------------------------------------------------------------------------------------------------

var screenCanvas;
var run = true;
var fps = 1000 / 60;
var counter = 0;
var mouse = new Point();
var ctx;
var keyCode1 = new Array();
var keyCode2 = new Array();
var length;
var radian;
var radNum = 0;
var leftDown = false;
var rightDown = false;
var leftUp = false;
var rightUp = false;
var pauseFlag = false;
var jumpFlag1;
var jumpFlag2;
var jumpFrame = 0;
var creatFlag = false;
var nowStage = 0;

var lCounter = 0;
var test = new Array();

// -const ----------------------------------=========------------------------------------------------------

var cos = Math.cos;
var sin = Math.sin;
var tan = Math.tan;
var sqrt = Math.sqrt;
var PI = Math.PI;
var PI2 = Math.PI*2;
var PI_2 = Math.PI/2;
var PI_4 = Math.PI/4;
var SQRT2 = 1.41421356237;
var BALL_MAX_COUNT = 512;
var WALL_MAX_COUNT = 31;
var maxVel = 30;
var coefficientRestitution01 = 0.6;
var coefficientRestitution02 = 0.9;
var color = new Array();
var P0 = new Point();
color[00] = "rgba(  0, 255,   0, 0.75)";//緑
color[01]　= "rgba(  0,   0, 255, 0.75)";//青
color[02] = "rgba(255,   0,   0, 0.75)";//赤
color[03]　= "rgba( 85,  85,  85, 0.80)";//グレー
color[04] = "rgba(255, 255, 255, 1.00)";//白
color[05] = "rgba(255, 140,   0, 0.80)";//オレンジ
color[06] = "rgba(200,   0, 100, 0.80)";//暗赤
color[07] = "rgba(000, 000, 000, 1.00)";//黒
color[10] = "rgba(  0, 255,   0, 0.30)";//薄緑
color[11]　= "rgba(  0,   0, 255, 0.30)";//薄青
color[12] = "rgba(255,   0,   0, 0.30)";//薄赤
color[13]　= "rgba( 85,  85,  85, 0.30)";//薄グレー
color[14] = "rgba(255, 255, 255, 1.00)";//白
color[15] = "rgba(255, 140,   0, 0.80)";//薄オレンジ
color[16] = "rgba(200,   0, 100, 0.80)";//薄暗赤



// -main -------------------------------===----------------------------------------------------------------

//ページ読み込み時に起動するfunciton
window.onload = function(){

	//ローカル変数の定義
	var p = new Point();
	vector = new Point();
	var i; var j; var k; var l;


	//スクリーンの初期化
	screenCanvas = document.getElementById("screen");
	screenCanvas.width = 800;
	screenCanvas.height = 512;
	var canvasCenter = new Point();
	canvasCenter.x = screenCanvas.width/2;
	canvasCenter.y = screenCanvas.height/2;


	//2dコンテキスト
	ctx = screenCanvas.getContext("2d");


	//右クリックの禁止とドラッグの禁止
	window.addEventListener("contextmenu", function(e){
		e.preventDefault();
	}, false);

	//イベントの登録
	window.addEventListener("mousemove", mouseMove, true);
	window.addEventListener("mousedown", mouseDown, true);
	window.addEventListener("mouseup", mouseUp, true);
	window.addEventListener("keydown", keyDown, true);
	window.addEventListener("keyup", keyUp, true);


	//エレメント登録
	info = document.getElementById("info");


	//球初期化
	var ball = new Array(BALL_MAX_COUNT);
	for(i=0; i<ball.length; i++){
		ball[i] = new Character;
		ball[i].num = i;
	};
	dotLen = ball[0].dot.length;

	//壁初期化
	var wall =new Array(WALL_MAX_COUNT);
	for(i=0; i<wall.length; i++){
		wall[i] = new Wall;
		wall[i].num = i;
	};


	//自機初期化
	p.x = screenCanvas.width/2;
	p.y = screenCanvas.height/2-　15;
	ball[0].set(p, 15, P0, 0);

	//初期ステージ読み込み
	stage00(ball, wall);
//レンダリング処理を呼び出す-----------------------------------------------------------------------------------------------

	// var mode = MODE.SAVE;
	var mode = MODE.LOAD;
	var ballsIO = new BallsIO(mode,1000);
	// console.log((ball));
	// console.log(wall);
	// run = false;

(function(){
	//カウンターの値をインクリメントする
	counter++;

	ballsIO.next(counter);
	// if(counter==200) ballsIO.save_drive_recorder();

	if(keyCode1[32] && !keyCode2[32]) pauseFlag = !pauseFlag;
	if(!pauseFlag){

		//入力による変更-------------------------------------------------------------------------------------------

		if(keyCode1[67]) creatFlag = 1;
		if(keyCode1[88] && !keyCode2[88]) creatFlag = 1;
		if(keyCode1[86]) creatFlag = 2;
		if(keyCode1[66] && !keyCode2[66]) creatFlag = 2;
		if(keyCode1[65]) ball[0].vel.x += -0.3;
		if(ball[0].vel.x < -4) ball[0].vel.x = -4;
		jumpFlag1 = false;
		if(keyCode1[87]&& jumpFlag2) jumpFlag1 = true;
		if(!keyCode1[87]) jumpFlag2 = true;
		if(keyCode1[68]) ball[0].vel.x +=  0.3;
		if(ball[0].vel.x >  4) ball[0].vel.x =  4;
		if(keyCode1[83]) ball[0].vel.x =  0;

		if(keyCode1[70]) ball[0].vel.x = -3;
		if(keyCode1[84]) ball[0].vel.y = -3;
		if(keyCode1[72]) ball[0].vel.x =  3;

		if(keyCode1[39]) ball[0].pos.x += 0.3;
		if(keyCode1[37]) ball[0].pos.x -= 0.3;

		if(keyCode1[85]) fps = 2000 / 1 ;
		if(keyCode1[73]) fps = 1000 / 2 ;
		if(keyCode1[79]) fps = 1000 / 10;
		if(keyCode1[80]) fps = 1000 / 60;
		if(keyCode1[192]) fps /= 1.5;
		if(keyCode1[76]) lCounter++

		if(keyCode1[81]) {
			ball[0].pos = mouse.add(P0);
			ball[0].vel = P0.add(P0);
		}
		if(keyCode1[90] && !keyCode2[90]){
			ball[0].size = 65;
			ball[0].weight = 4225;
		}

		if(!keyCode1[65] && !keyCode1[68]) ball[0].vel.x *= 0.85;

		//ステージ読み込み================================================================================================
		if(keyCode1[48]) stage00(ball, wall);
		if(keyCode1[49]) stage01(ball, wall);
		if(keyCode1[50]) stage02(ball, wall);
		if(keyCode1[51]) stage03(ball, wall);
		if(keyCode1[52]) stage04(ball, wall);
		if(keyCode1[53]) stage05(ball, wall);

		//ステージごとのフラグ管理
		//ステージ1について
		if(nowStage == 1){
			if(ball[0].pos.x > 800) stage02(ball, wall);
			for(i=0; i<ball.length; i++){
				if(ball[i].pos.x > 755 && ball[i].pos.y>220 && ball[i].pos.y < 260) wall[4].isAlive = false;
			}
		}


		//フラグ管理-----------------------------------------------------------------------------------------------

		//他機生成
		if(creatFlag && (counter%4==0 || fps != 1000/60)){
			for(i=1; i<ball.length; i++){
				if(!ball[i].isVisible){
					p = mouse.add(P0);
					var s = 10;//Math.floor(Math.random() * 4) + 6;
					ball[i].set(p, s, P0, creatFlag);
					creatFlag = false;
					break;
				}
			}
		}
		//クリック時の反応について
		if(leftDown && leftUp && ball[0].isAlive){
			for(i=1; i<ball.length; i++){
				if(!ball[i].isVisible){
					ball[i].shoot(ball[0], 1);
					break;
				}
			}
			leftDown = false;
			leftUp = false;
		}
		if(rightDown && rightUp && ball[0].isAlive){
			for(i=1; i<ball.length; i++){
				if(!ball[i].isVisible){
					ball[i].shoot(ball[0], 2);
					break;
				}
			}
			rightDown = false;
			rightUp = false;
		}
		//ジャンプするか否かについて
		if(jumpFlag1 && jumpFrame+3<counter){
			var max = 0;
			var rad;
			for(i=0; i<ball[0].contactCnt01; i++){
				rad = mod(ball[0].contact[i].tangent, PI2);
				max = Math.max(-cos(rad), max);
			}
			for(i=6; i<6+ball[0].contactCnt02; i++){
				rad = mod(ball[0].contact[i].tangent, PI2);
				max = Math.max(-cos(rad), max);
			}
			if(max>0.3){
				ball[0].vel.y = -7*max;
				jumpFlag2 = false;
				jumpFrame = counter;
			}
		}

		//物体の情報を更新==================================================================================
		//壁の情報を反映、初期化
		for(i=0; i<ball.length; i++){
			if(ball[i].isVisible){
				//重力を反映
				ball[i].fall();
				//もし変形しているのであれば摩擦で減速する
				if(ball[i].isDistorted){
					var f = Math.min(Math.max(1.86- ball[i].arc/ball[i].size*3, 0.65), 0.98)
					ball[i].vel.x *= f;
					ball[i].vel.y *= f;
				}
				//速度を位置情報に変換
				ball[i].move();
				if(ball[i].isAlive){
					//衝突カウンターと接点、歪フラグを初期化
					ball[i].contactCnt01 = 0;
					ball[i].contactCnt02 = 0;
					ball[i].isDistort = false;
					ball[i].arc = 0;
					for(j=0; j<ball[i].contact.length; j++){
						ball[i].contactInitialize(j);
					}
					for(j=0; j<ball[i].bezier.length; j++){
						ball[i].bezierInitialize(j);
					}
					//周りの点の情報を更新
					if(!ball[i].isDistorted){
						for(j=0; j<dotLen; j++){
							ball[i].dot[j].rel = angle(j* PI2/ dotLen).mul(ball[i].size);
							ball[i].dot[j].abs = ball[i].pos.add(ball[i].dot[j].rel);
							ball[i].dot[j].rad = atan2(ball[i].dot[j].rel);
						}
					}
					else{
						for(j=0; j<dotLen; j++){
							ball[i].dot[j].abs = ball[i].pos.add(ball[i].dot[j].rel);
							ball[i].dot[j].rad = atan2(ball[i].dot[j].rel);
						}
					}
					//歪円当り判定チャンスをtrueにしておく
					for(j=0; j<ball[i].infoWithWall.length; j++){
						ball[i].infoWithWall[j].canCollide = true;
					}
				}
			}
		}
		//壁の情報反映、初期化
		for(i=0; i<wall.length; i++){
			if(wall[i].isAlive){
				//壁の速度を位置情報に変換
				wall[i].move(ball, wall);
				for(j=0; j<wall[i].contactCnt01; j++){
					wall[i].contactInitialize(j);
				}
			}
			wall[i].contactCnt01 = 0;
		}

		//吸収判定をとる=====================================================================================
		for(i=0; i<ball.length; i++){
			if(ball[i].isAlive){
				for(j=i+1; j<ball.length; j++){
					if(ball[j].isAlive && ball[i].pos.sub(ball[j].pos).norm() < (ball[i].size+ball[j].size)*2){
						//ここまではお互いの球が生きていて十分に近いかの判定。ここからは2つの球の色から吸収するのか反発するのかの計算
						if(ball[i].color == ball[j].color || ((i == 0) && (ball[i].size > ball[j].size))){
							//この場合は吸収判定になる
							if(!ball[i].isDistorted && !ball[j].isDistorted){
								//ここはどちらも正円だった場合の当り判定
								ball[i].detectAbsorption01(ball[j]);
							}
							else if(ball[i].isDistorted && !ball[j].isDistorted){
								//ここは若い番号が歪円、遅い番号が正円だった場合
								ball[i].detectAbsorption02(ball[j], true);
							}
							else if(!ball[i].isDistorted && ball[j].isDistorted){
								//ここは若い番号が正円、遅い番号が歪円だった場合
								ball[j].detectAbsorption02(ball[i], false);
							}
							else{
								//ここはどちらも歪円だった場合
								ball[i].detectAbsorption03(ball[j])
							}
						}
					}
				}
			}
		}

		//衝突判定一回目(まずは正円同士で判定を取る)===========================================================
		for(i=0; i<ball.length; i++){
			if(ball[i].isAlive){
				for(j=i+1; j<ball.length; j++){
					if(ball[j].isAlive && ball[i].color != ball[j].color && !(i == 0 && ball[i].size > ball[j].size)){
						ball[i].detectCollision01(ball[j]);
					}
				}
			}
		}
		if(run==false)console.log("衝突判定一回目終了");
		//衝突判定二回目(次に歪円を除いた場合の判定を取る)
		for(i=0; i<ball.length; i++){
			if(ball[i].isAlive){
				//衝突判定をまとめた関数に入れてみる
				ball[i].collisionCheck(ball, wall, false);
				//ほぼ同じ位置にある接点を排除する
				ball[i].checkContact(ball, wall);
				//得られた接点の数からボールの状態を場合分けする
				//接点が無い場合
				if(ball[i].contactCnt01 == 0){
					ball[i].contactCnt01Temp = ball[i].contactCnt01;
					continue;
				}
				//接点が一つの場合
				else if(ball[i].contactCnt01 == 1){
					ball[i].positionCorrection();
					ball[i].collisionCheck(ball, wall, true);
					ball[i].checkContact(ball, wall);
					if(ball[i].contactCnt01 > 1){
						ball[i].checkDistortion(ball, wall);
						ball[i].detectDistortion01(ball, wall);
					}
				}
				//接点が二つ以上の場合
				else {
					ball[i].checkDistortion(ball, wall);
					if(ball[i].contactCnt01 == 1){
						ball[i].positionCorrection();
						ball[i].collisionCheck(ball, wall, true);
						ball[i].checkContact(ball, wall);
						if(ball[i].contactCnt01 > 1){
							ball[i].checkDistortion(ball, wall);
							ball[i].detectDistortion01(ball, wall);
						}
					}
					else{
						ball[i].detectDistortion01(ball, wall);
					}
				}
				ball[i].contactCnt01Temp = ball[i].contactCnt01;
			}
		}
if(run==false)console.log("衝突判定二回目終了");
		//衝突判定三回目(歪円の場合の判定を取る)==============================================================
		for(i=0; i<ball.length; i++){
			if(ball[i].isAlive){
				if(ball[i].isDistort || ball[i].isDistorted){
					//この場合はボールは歪円
					for(j=i+1; j<ball.length; j++){
						if(ball[j].isAlive && ball[i].color != ball[j].color && !(i == 0 && ball[i].size > ball[j].size)){
							if(!ball[j].isDistort || !ball[i].isDistorted) ball[i].detectCollision02(ball[j], true);
							else　ball[i].detectCollision03(ball[j]);
						}
					}
					//次に壁との当り判定
					for(j=0; j<wall.length; j++){
						if(wall[j].isAlive && ball[i].color != wall[j].color) wall[j].detectCollision02(ball[i], ball, wall);
					}
					ball[i].checkContact(ball, wall);;
					// var num = ball[i].contactCnt01 + ball[i].contactCnt02;
					// if(num>ball[i].contactCnt01 && ball[i].contactCnt01>0){
					if(ball[i].contactCnt01 > 0 && ball[i].contactCnt02 > 0){
						ball[i].detectDistortion02(ball);
					}
				}
			}
		}
if(run==false)console.log("衝突判定三回目終了");
		//当り判定終わり=====================================================================================

		//とられた接点から衝突の計算を行う
		for(i=0; i<ball.length; i++){
			if(ball[i].isAlive){
				if(ball[i].contactCnt01Temp < 2 && ball[i].contactCnt01 >1){
					ball[i].checkDistortion(ball, wall);
				}
			}
		}
		for(i=0; i<ball.length; i++){
			if(ball[i].isAlive){
				if(ball[i].contactCnt01Temp < 2 && ball[i].contactCnt01 >1){
					ball[i].detectDistortion01(ball, wall);
				}
				if(ball[i].contactCnt01Temp < 1 && ball[i].contactCnt01==1) ball[i].positionCorrection();
				ball[i].bound(ball, wall);
				// if(ball[i].isDistort && ball[i].isDistorted){
					// for(j=0; j<dotLen; j++){
						// ball[i].dot[j].abs = ball[i].dot[j].rel.add(ball[i].pos)
					// }
				// }
				ball[i].calcuDotInfo(ball[i].pos)
			}
		}
		for(i=0; i<wall.length; i++){
			if(wall[i].isAlive){
				wall[i].action(ball, wall);
			}
		}

		//物体の処理演算終わり===============================================================================

		if(!ball[0].isDistort || !ball[0].isDistorted){
			for(i=0; i<dotLen; i++){
				ball[0].dot[i].rel = angle(i* PI2/ dotLen).mul(ball[0].size);
				ball[0].dot[i].abs = ball[0].pos.add(ball[0].dot[i].rel);
				ball[0].dot[i].rad = atan2(ball[0].dot[i].rel);
			}
		}
		ball[0].calcuDotInfo(ball[0].pos);
		//自機とマウス位置の相対ベクトル(vector)、距離(length)、角度(radian)をそれぞれ計算する
		vector = mouse.sub(ball[0].pos);
		if(!keyCode1[16]){
			length = ball[0].pos.sub(mouse).norm();
			radian = atan2(vector);
		}
		else{
			var n = Math.round(atan2(vector.y, vector.x)*4/ PI);
			radian = n/4* PI;
			switch((n+4)%4){
				case 0:
					length = Math.abs(mouse.x- ball[0].pos.x);
					break;

				case 1:
					length = Math.abs((vector.x+ vector.y)/ SQRT2);
					break;

				case 2:
					length = Math.abs(mouse.y- ball[0].pos.y);
					break;

				default:
					length = Math.abs((vector.x- vector.y)/ SQRT2);
			}
		}
		var dot = ball[0].dot;
		if(ball[0].isDistort || ball[0].isDistorted){
			radNum = mod(Math.round(radian* dotLen/ PI2)+ Math.ceil(dotLen*7/8));
			while(mod(radian- dot[radNum].rad, PI2) > mod(dot[mod(radNum+1)].rad- dot[radNum].rad, PI2)){
				radNum = mod(radNum+1);
			}
			length -= dot[radNum].rel.norm();
		}
		else{
			radNum = mod(Math.round(radian* dotLen/ PI2));
			length -= ball[0].size
		}
		if(length > 380) length = 380;
	};

	//画面の外遠くまで行ったかサイズがマイナスになったらボールを死んだことにする
	for(i=0; i<ball.length; i++){
		if(ball[i].isVisible){
			if(ball[i].pos.sub(canvasCenter).norm() > screenCanvas.width
			|| ball[i].weight < 0) ball[i].initialize();
		}
	}
	//画面の描画を行う-------------------------------------------------------------------------------------------------


	//スクリーンクリア
	ctx.clearRect(0, 0, screenCanvas.width, screenCanvas.height);

	//背景の描画-------------------------------------------------

	//背景の描画
	for(i=0; i<wall.length; i++){
		if(wall[i].isAlive) wall[i].draw1(wall);
	}

	//球の描写1
	for(i=0; i<ball.length; i++){
		if(ball[i].isVisible) ball[i].draw(1, ball[0]);
	}

	//壁の描画
	for(i=0; i<wall.length; i++){
		if(wall[i].isAlive) wall[i].draw2(wall);
	};


	//球の描写2
	for(i=0; i<ball.length; i++){
		if(ball[i].isVisible){
			//球そのものの描写
			ball[i].draw(2, ball[0]);
			//球の中心の描写
			if(ball[i].shootedFrame > counter-2) continue;
			ctx.beginPath()
			ctx.arc(ball[i].pos.x, ball[i].pos.y, 2, 0, PI2, true);
			ctx.fillStyle = color[03];
			ctx.fill();
			//球の接点の中点の描写
			continue;
			if(ball[i].contactCnt01+ball[i].contactCnt02 < 2) continue;
			for(j=0; j<ball[i].contactCnt01+ ball[i].contactCnt02; j++){
				ctx.beginPath();
				ctx.arc(ball[i].bezier[j].midPos.x, ball[i].bezier[j].midPos.y, 2, 0, PI2, true);
				ctx.fillStyle = color[3];
				ctx.fill()
			}
		}
	}

	if(lCounter%4){
		ctx.beginPath();
		ctx.arc(ball[0].pos.x, ball[0].pos.y, ball[0].size, 0, PI2, true)
		ctx.fillStyle = color[3];
		ctx.fill()
	}
	if(lCounter%3){
		ctx.fillStyle = "BLACK";
		for(i=0; i<dotLen; i++){
			ctx.beginPath();
			ctx.arc(ball[1].dot[i].abs.x, ball[1].dot[i].abs.y, 1, 0, PI2, true)
			ctx.closePath();
			ctx.fill();
		}
	}
	// マウスの現在地の描画
	var m = ball[0].pos.add(angle(radian).mul(length+ ball[0].dot[radNum].rel.norm()));
	if(!pauseFlag) m2 = new Point(mouse.x, mouse.y);


	if(leftDown) ctx.fillStyle = color[01];
	else if(rightDown) ctx.fillStyle = color[02];
	if(length>0){
		if(leftDown != rightDown){
			var rad = radian+ PI_2;
			var t = 0.9+ length/1440;
			ctx.beginPath();
			var p1 = new Point(m.x, m.y-18*t).rot(m, rad);
			var p2 = new Point(m.x+13*t, m.y+12*t).rot(m, rad);
			var p3 = new Point(m.x, m.y+8*t).rot(m, rad);
			var p4 = new Point(m.x-13*t, m.y+12*t).rot(m, rad);
			ctx.moveTo(p1.x, p1.y);
			ctx.lineTo(p2.x, p2.y);
			ctx.lineTo(p3.x, p3.y);
			ctx.lineTo(p4.x, p4.y);
			ctx.closePath();
			ctx.arc(m.x, m.y, 6, 0, PI2, true);
			ctx.closePath();
			ctx.fill();
		}
		else{
			ctx.beginPath();
			ctx.moveTo(m2.x, m2.y - 14);
			ctx.lineTo(m2.x + 14, m2.y);
			ctx.lineTo(m2.x, m2.y + 14);
			ctx.lineTo(m2.x - 14, m2.y);
			ctx.closePath();
			ctx.arc(m2.x, m2.y, 9, 0, PI2, true);
			ctx.closePath();
			ctx.fillStyle = color[00];
			ctx.fill();
		}
	}

	ctx.beginPath();
	ctx.arc(m2.x, m2.y, 4, 0, PI2, true);
	ctx.closePath();
	ctx.fill();

	// 点線の描画
	if(ball[0].isAlive){
		if(leftDown && rightDown){
			leftDown = false;
			rightDown = false;
		}
		else if(leftDown) ball[0].strokeDottedLine(1);
		else if(rightDown) ball[0].strokeDottedLine(2);
	}

console.log(ball[0]);
console.log(ball[1]);
console.log(ball[2]);
console.log(wall[1]);
console.log(counter, "===================================================================================================");
	//その他の設定----------------------------------------------------------------------------------------------------

	//前フレームにキーを押していたかの情報
	for(i=0; i<keyCode1.length; i++){
		keyCode2[i] = keyCode1[i];
	}
	//物体との接触判定のフラグを初期化しておく
	for(i=0; i<ball.length; i++){
		if(ball[i].isAlive){
			if(ball[i].contactCnt01 > 1 && ball[i].arc > ball[i].size*0.08)ball[i].isDistorted = true;
			else ball[i].isDistorted = false;
		}
	}

	//スペースバーが押されたらポーズ/ポーズ解除　する
	if(pauseFlag && ball[0].isAlive){
		ctx.beginPath();
		ctx.arc(mouse.x, mouse.y, 6, 0, PI2, true);
		ctx.fillStyle = "rgba(  0,   0, 000, 0.5)";
		ctx.fill();

		ctx.fillStyle = color[06];
		ctx.font = "60px 'MSゴシック'"
		ctx.fillText("PAUSE", screenCanvas.width/ 2- 94, screenCanvas.height/ 3);
	}

	//自機が死んだら描写をストップしてリトライを促す
	if(!ball[0].isAlive){
		ctx.fillStyle = color[06];
		run = false;
		ctx.font = "60px 'MSゴシック'"
		ctx.fillText("GAME OVER", screenCanvas.width/ 2- 165, screenCanvas.height/ 3);
		ctx.fillText('PRESS "F5" TO RETRY', screenCanvas.width/ 2- 295, screenCanvas.height/ 3*2);
	}

	//test

	//HTMLを更新
	info.innerHTML = ball[0].pos.y+" "+ball[0].dot[16].rel.y+"PLAYER WEIGHT: " + ball[0].weight +
	 "<br>PLAYER SIZE &nbsp;&nbsp;&nbsp;&nbsp;:" + ball[0].size +
	 "<br>移動　WASD <br>青玉発射 左クリック　赤玉発射　右クリック" +
	 "<br>発射角度調整　SHIFT<br>デバッグ用TFGH, L, C, V, X, B, Q, Z, N, M, 1～9<br>" +
	 mouse.x +" "+ mouse.y;


		//フラグにより再起呼び出し-----------------------------------------------------------------------------------------
		if(run){setTimeout(arguments.callee, fps);}
	})();

};




// -event--------------------------------------------------------------------------------------------------------------------------

var mouseMove = function(e){
	//マウスカーソルの座標の更新
	mouse.x = e.clientX - screenCanvas.offsetLeft;
	mouse.y = e.clientY - screenCanvas.offsetTop;
};

var keyDown = function(e){
	kc = e.keyCode;
	keyCode1[kc] = true;
	if(keyCode1[27]) run = false;
};

var keyUp = function(e){
	kc = e.keyCode;
	keyCode1[kc] = false;
};

var mouseDown = function(e){
	if(e.button == 0 && !pauseFlag){
		leftDown  = true;
		leftUp = false;
	}
	else if(e.button == 2 && !pauseFlag){
		rightDown = true;
		rightUp = false;
	}
};

var mouseUp = function(e){
	if(e.button == 0){
		leftUp  = true;
		//leftDown = false;
	}
	else if(e.button == 2){
		rightUp = true;
		//rightDown = false;
	}
};
window.onblur = function (){

	// 配列をクリアする
	keyCode1.length = 0;
};
