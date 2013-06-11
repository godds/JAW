function TrackViewModel(audioContext, audioInput) {
    var self = this;

    self.audioContext = audioContext;
    self.audioInput = audioInput;
    self.recorder = null;

    self.audioMeter = new AudioMeterViewModel(audioContext, audioInput);

    self.armed = ko.observable(false);

    self.setRecording = function(record) {
        if (!self.armed()) {
            return;
        }
        if (record) {
            self.recorder.clear();
            self.recorder.record();
        }
        else {
            self.recorder.stop();
        }
    };

    self.play = function(targetStartTime) {
        self.recorder.getBuffer(function(buffers) {
            // HACK, probably naive error prevention checking
            if (!buffers.length || !buffers[0].length || !buffers[1].length) {
                return;
            }
            var source = self.audioContext.createBufferSource();
            var buffer = self.audioContext.createBuffer(2, buffers[0].length, self.audioContext.sampleRate);
            buffer.getChannelData(0).set(buffers[0]);
            buffer.getChannelData(1).set(buffers[1]);
            source.buffer = buffer;
            source.connect(self.audioContext.destination);
            // HACK to hopefully get all the tracks to play in time
            source.start((targetStartTime - Date.now()) / 1000);
        });
    };

    self.toggleArmed = function() {
        self.armed(!self.armed());
    };

    (function init() {
        var inputPoint = self.audioContext.createGainNode();
        self.audioInput.connect(inputPoint);
        self.recorder = new Recorder(inputPoint, { workerPath: "js/libs/recorderjs/recorderWorker.js" });
//        inputPoint.connect(self.audioContext.destination);
    })();
}