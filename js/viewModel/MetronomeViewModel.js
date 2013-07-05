function MetronomeViewModel(audioContext) {
    var self = this;

    self.requestID;

    self.audioContext = audioContext;
    self.bpm = ko.observable(120);
    self.beatResolution = ko.observable(2); // 0 = 16th, 1 = 8th, 2 = quarter note
    // TODO self.timeSignature = 0; // currently assuming 4/4

    self.currentStep = 0;
    self.nextStepTime = 0;
    self.scheduleAheadTime = 0.1;

    self.start = function() {
        self.looper();
    };

    self.stop = function() {
        cancelAnimationFrame(self.requestID);
    };

    self.looper = function() {
        while (self.nextStepTime < self.audioContext.currentTime + self.scheduleAheadTime) {
            self.scheduleNote(self.currentStep, self.nextStepTime);
            self.nextStep();
        }
    };

    self.nextStep = function() {
        var secondsPerBeat = 60 / self.bpm();
        self.nextStepTime += secondsPerBeat / 4;
        self.currentStep = (self.currentStep + 1) % 16;
    };

    self.scheduleNote = function(step, time) {
        // if we only want to play 8th notes
        if (self.beatResolution == 1 && step % 2) {
            return;
        }
        // if we only want to play quarter notes
        if (self.beatResolution == 2 && step % 4) {
            return;
        }

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