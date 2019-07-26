var bgm = document.getElementById("bgm");
var bgm_audio = document.getElementById("bgm_audio");
bgm.onclick = function() {
	if (bgm.innerHTML == "背景音乐") {
		bgm.innerHTML = "《--心安理得--》----播放中";
		// bgm_audio.setAttribute("autoplay", "autoplay");
		bgm_audio.play();
	} else {
		bgm.innerHTML = "背景音乐";
		bgm_audio.pause();
	}	
}


