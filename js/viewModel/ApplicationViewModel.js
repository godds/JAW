function ApplicationViewModel(audioContext) {
    var that = this;

    this.audioContext = audioContext;
    this.recording = false;
    this.recorder = null;

    this.init = function() {
        navigator.getUserMedia({ audio: true },
                               function(stream) {
                                   var inputPoint = that.audioContext.createGainNode();
                                   var audioInput = that.audioContext.createMediaStreamSource(stream);
                                   audioInput.connect(inputPoint);
                                   that.recorder = new Recorder(inputPoint);
                                   inputPoint.connect(that.audioContext.destination);
                               },
                               function(error) {
                                   console.log(error);
                               });
    }

    this.toggleRecording = function() {
        if (this.recording) {
            this.recorder.stop();
            this.recording = false;
        }
        else {
            this.recording = true;
            this.recorder.clear();
            this.recorder.record();
        }
    }

    this.play = function() {
        if (this.recording) {
            this.toggleRecording();
        }
        this.recorder.getBuffer(function(buffers) {
            var source = that.audioContext.createBufferSource();
            var buffer = that.audioContext.createBuffer(2, buffers[0].length, that.audioContext.sampleRate);
            buffer.getChannelData(0).set(buffers[0]);
            buffer.getChannelData(1).set(buffers[1]);
            source.buffer = buffer;
            source.connect(that.audioContext.destination);
            source.start(0);
        });
    }
}