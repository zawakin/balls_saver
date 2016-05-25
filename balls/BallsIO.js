
var MODE = {LOAD:0,
			SAVE:1,
            NONE:2
            };

class BallsIO{

    constructor(mode,maxcounter){
        alert("mode = " + mode);
        this.url = "http://localhost:8000";
        this.mode = mode;
        this.maxcounter = maxcounter;
		if(this.mode==MODE.SAVE){
			this.socket = io();
			this.socket.emit("send_start",{});
		}
        if(this.mode==MODE.LOAD){
    		var res = this.ajax(this.url);
    		this.sdatas = JSON.parse(res);
            this.length = this.sdatas.length;
        }
    }

    next(counter){
        if(this.mode>=MODE.SAVE){
            this.save_frame(counter);
        }
        if(this.mode==MODE.LOAD){
            this.load_frame(counter);
        }
    }

    save_frame(counter){
    		if(counter < this.maxcounter){
    			var data = {
    				k1: keyCode1,
    				k2: keyCode2,
    				lU: leftUp,
    				lD: leftDown,
    				rU: rightUp,
    				rD: rightDown,
    				m: mouse
    			};
    			this.socket.emit("send_data", JSON.stringify(data));
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
        // console.log("counter " + counter);
        // console.log(JSON.parse(this.sdatas[0]));
		var data = JSON.parse(this.sdatas[counter-1]);
    	keyCode1 = data.k1;
    	keyCode2 = data.k2;
    	leftUp = data.lU;
    	leftDown = data.lD;
    	rightUp = data.rU;
    	rightDown = data.rD;
    	mouse = new Point(data.m.x,data.m.y);
    }

    ajax(url) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("POST", url, false); // true:非同期、false:同期
		xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlHttp.send("");
		return xmlHttp.responseText;
	}
}
