//(function() {

    var audioContext = new webkitAudioContext(),
        audioInput = null,
        realAudioInput = null,
        inputPoint = null,
        recorder = null;

    function toggleRecording(trigger) {
        if (trigger.classList.contains("recording")) {
            // stop recording
            recorder.stop();
            trigger.classList.remove("recording");

        }
        else {
            if (!recorder) {
                return;
            }
            trigger.classList.add("recording");
            recorder.clear();
            recorder.record();
        }
    }

    function gotStream(stream) {
        inputPoint = audioContext.createGainNode();
        //inputPoint.gain.value = 0.0;

        realAudioInput = audioContext.createMediaStreamSource(stream);
        audioInput = realAudioInput;
        audioInput.connect(inputPoint);

        recorder = new Recorder(inputPoint);

        inputPoint.connect(audioContext.destination);
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

    function play() {
        recorder.getBuffer(function(buffers) {
            var source = audioContext.createBufferSource();
            var buffer = audioContext.createBuffer(2, buffers[0].length, audioContext.sampleRate);
            buffer.getChannelData(0).set(buffers[0]);
            buffer.getChannelData(1).set(buffers[1]);
            source.buffer = buffer;
            source.connect(audioContext.destination);
            source.start(0);
        });
    }

//})();

