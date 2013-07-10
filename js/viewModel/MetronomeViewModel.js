function MetronomeViewModel(audioContext) {
    "use strict";

    var self = this;

    self.requestID;

    self.audioContext = audioContext;
    self.bpm = ko.observable(120);
    self.beatCount = ko.observable(4);
    self.beatResolution = ko.observable(4); // 16 = 16th, 8 = 8th, 4 = quarter note, 2 = half note

    self.currentStep = 0;
    self.nextStepTime = 0;
    self.scheduleAheadTime = 0.1;

    self.start = function () {
        self.nextStepTime = self.audioContext.currentTime;
        self.looper();
    };

    self.stop = function () {
        cancelAnimationFrame(self.requestID);
    };

    self.looper = function () {
        while (self.nextStepTime < self.audioContext.currentTime + self.scheduleAheadTime) {
            self.scheduleNote(self.currentStep, self.nextStepTime);
            self.nextStep();
        }
        self.requestID = requestAnimationFrame(self.looper);
    };

    self.nextStep = function () {
        var secondsPerBeat = 60 / self.bpm();
        self.nextStepTime += secondsPerBeat / self.beatCount();
        self.currentStep = (self.currentStep + 1) % (self.beatCount() * (16 / self.beatResolution()));
    };

    self.scheduleNote = function (step, time) {
        // if we are only playing half notes
        if (self.beatResolution() === 2 && step % 8) {
            return;
        }
        // if we are only playing quarter notes
        else if (self.beatResolution() === 4 && step % 4) {
            return;
        }
        // if we are only playing 8th notes
        else if (self.beatResolution() === 8 && step % 2) {
            return;
        }

        var osc = self.audioContext.createOscillator();
        osc.connect(self.audioContext.destination);
        if (step === 0) {
            osc.frequency.value = 440.0;
        }
        else {
            osc.frequency.value = 880.0;
        }
        osc.start(time);
        osc.stop(time + 0.05);
    };
}