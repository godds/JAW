angular.module("audio.metronome", [ "audio" ])

.factory("metronome", function (audio) {
    var requestID,
        bpm = 120,
        beatCount = 4,
        beatResolution = 4, // 16 = 16th, 8 = 8th, 4 = quarter note, 2 = half note
        currentStep = 0,
        nextStepTime = 0,
        scheduleAheadTime = 0.1;

    function looper() {
        while (nextStepTime < audio.currentTime() + scheduleAheadTime) {
            scheduleNote(currentStep, nextStepTime);
            nextStep();
        }
        requestID = requestAnimationFrame(looper);
    }

    function nextStep() {
        var secondsPerBeat = 60 / bpm;
        nextStepTime += secondsPerBeat / beatCount;
        currentStep = (currentStep + 1) % (beatCount * (16 / beatResolution));
    }

    function scheduleNote(step, time) {
        // if we are only playing half notes
        if (beatResolution === 2 && step % 8) {
            return;
        }
        // if we are only playing quarter notes
        else if (beatResolution === 4 && step % 4) {
            return;
        }
        // if we are only playing 8th notes
        else if (beatResolution === 8 && step % 2) {
            return;
        }

        var frequency = step === 0 ? 440.0 : 880.0;
        var osc = audio.createOscillator("sine", frequency);
        osc.connect(audio.speakers());
        osc.start(time);
        osc.stop(time + 0.05);
    }

    return {
        start: function() {
            nextStepTime = audio.currentTime();
            looper();
        },
        stop: function() {
            cancelAnimationFrame(requestID);
        }
    };
})

;
