(function() {

    var audioContext = new webkitAudioContext(),
        audioInput = null,
        realAudioInput = null,
        inputPoint = null,
        audioRecorder = null;

    function toggleRecording(trigger) {
//        if (trigger.classList.contains("recording")) {
//            // stop recording
//            audioRecorder.stop();
//            trigger.classList.remove("recording");
//
//        }
//        else {
//            if (!audioRecorder) {
//                return;
//            }
//            trigger.classList.add("recording");
//            audioRecorder.clear();
//            audioRecorder.record();
//        }
    }

    function gotStream(stream) {
//        inputPoint = audioContext.createGainNode();
//
//        realAudioInput = audioContext.createMediaStreamSource(stream);
//        audioInput = realAudioInput;
//        audioInput.connect(inputPoint);


    }

    function initAudio() {
        navigator.webkitGetUserMedia({ audio: true },
                                     gotStream,
                                     function(error) {
                                         alert("Error getting audio");
                                         console.log(error);
                                     });
    }

    window.addEventListener("load", initAudio);

})();

