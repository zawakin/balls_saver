
var MODE = {LOAD:0,
			SAVE:1,
            NONE:2
            };

class BallsIO{

    constructor(mode,maxcounter,logfile){
        alert("mode = " + mode);
		this.create_buttons();
        this.url = "http://localhost:8000";
        this.mode = mode;
        this.maxcounter = maxcounter;
		this.sdatas_to_DR = []; //100 frameまで
		this.smax = 500;
		if(this.mode==MODE.SAVE){
			this.saving = true;
			// this.socket = io();
			// this.socket.emit("send_start",{});
		}
        if(this.mode==MODE.LOAD){
			this.logfile = logfile;
    		var res = this.ajax(this.url,"logfile=" + this.logfile);
    		this.sdatas = JSON.parse(res);
            this.length = this.sdatas.length;
        }
    }

    next(counter){
        if(this.mode==MODE.SAVE){
            this.save_frame_ajax(counter);
        }
        if(this.mode==MODE.LOAD){
            this.load_frame(counter);
        }
		// this.save_frame_ajax(counter);
    }

	save_drive_recorder(){
		this.ajax(this.url + "/saveDR", "sdatas=" + JSON.stringify(this.sdatas_to_DR));
		console.log("保存しました。");
	}

	save_frame_ajax(counter){
		this.sdatas_to_DR.push(this.state_to_json());
		// while(this.sdatas_to_DR.length > this.smax){
		// 	this.sdatas_to_DR.shift();
		// }
		if(counter > this.maxcounter){
			alert("長過ぎます。");
			var res = confirm("保存しますか？");
			if(res){
				this.save_drive_recorder();
			}else{
				console.log("保存しませんでした。");
			}
			run = false;
		}
	}

	state_to_json(){
		var data = {
			k1: keyCode1,
			k2: keyCode2,
			lU: leftUp,
			lD: leftDown,
			rU: rightUp,
			rD: rightDown,
			m: mouse
		};
		return JSON.stringify(data);
	}

    save_frame(counter){
    		if(counter < this.maxcounter){
    			this.socket.emit("send_data", state_to_json());
    		}
    		else if(counter==this.maxcounter){
    			this.socket.emit("save_end",{});
				this.socket.disconnect();
    		}
    }

    load_frame(counter){
        if(counter > this.length){
            run = false;
            return;
        }
		var data = JSON.parse(this.sdatas[counter-1]);
    	keyCode1 = data.k1;
    	keyCode2 = data.k2;
    	leftUp = data.lU;
    	leftDown = data.lD;
    	rightUp = data.rU;
    	rightDown = data.rD;
    	mouse = new Point(data.m.x,data.m.y);
    }


    ajax(url,message) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("POST", url, false); // true:非同期、false:同期
		xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlHttp.send(message);
		return xmlHttp.responseText;
	}
	create_buttons(){
		if(this.mode!=MODE.SAVE) return;
		// this.btn_save_start = document.createElement("BUTTON");
		this.btn_save_finish = document.createElement("BUTTON");
		// this.btn_DR = document.createElement("BUTTON");
		// this.btn_loader = document.createElement("BUTTON");
		// this.btn_save_start.appendChild(document.createTextNode("セーブ開始"));
		this.btn_save_finish.appendChild(document.createTextNode("セーブ終了"));
		// this.btn_DR.appendChild(document.createTextNode("ドライブレコーダー"));
		// this.btn_loader.appendChild(document.createTextNode("ロードする"));
		// document.body.appendChild(this.btn_save_start);
		document.body.appendChild(this.btn_save_finish);
		// document.body.appendChild(this.btn_DR);?
		// document.body.appendChild(this.btn_loader);

		var self = this;
		// this.btn_DR.onclick = function(){
		// 	alert(this.sdatas_to_DR.length + " フレーム　ドライブレコーダーに保存されました。");
		// 	self.save_drive_recorder();
		// }
		this.btn_save_finish.onclick = function(){
			alert();
			if(self.saving){
				self.save_drive_recorder();

				console.log("保存しました。");
				run = false;
			}
		};
	}
}
