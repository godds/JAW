function MetronomeViewModel(audioContext) {
    var self = this;

    var requestID;

    self.audioContext = audioContext;
    self.bpm = ko.observable(120);
    // TODO self.timeSignature = 0;

    var currentStep = 0;
    var nextStepTime = 0;
    var scheduleAheadTime = 0.1;

    self.start = function() {
        looper();
    };

    self.stop = function() {
        cancelAnimationFrame(requestID);
    };

    var looper = function() {
        while (nextStepTime < audioContext.currentTime + scheduleAheadTime) {
            scheduleNote(currentStep, nextStepTime);
            nextStep();
        }
    };

    var nextStep = function() {
        var secondsPerBeat = 60 / self.bpm();
        nextStepTime += secondsPerBeat / 4;
        currentStep = (currentStep + 1) % 16;
    };

    var scheduleNote = function(step, time) {
        var osc = self.audioContext.createOscillator();
        osc.connect(self.audioContext.destination);
        if (step % 16 === 0) {
            osc.frequency.value = 220.0;
        }
        else if (step % 4) {
            osc.frequency.value = 440.0;
        }
        else {
            osc.frequency.value = 880.0;
        }
        osc.start(time);
        osc.stop(time + 0.05);
    };
}