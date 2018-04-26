 function loadAudio(arrayFiles, vol){
		var audio = document.createElement("audio");
        
        for (let i = 0; i < arrayFiles.length; i++){
            let source = document.createElement('source');
            source.src = arrayFiles[i];
            audio.appendChild(source);
        }
     
        //audio.src = arrayFiles;
		audio.volume = vol || 1;

		var o = {
			dom : false,
			state: 'stop',
			play: function(){
				this.dom.currentTime = 0;
				this.dom.play();
				this.state = 'play';
			},
			pause: function(){
			 	this.dom.pause();
				this.state = 'pause';
			},
			stop: function(){
			 	this.dom.pause();
				this.dom.currentTime=0;
				this.state = 'stop';
			},
			setVolume : function(vol){
				this.dom.volume = vol;
			},
            setLoop: function(){
                this.dom.loop = true;
            }
		}
		o.dom = audio;
		return o;
	}