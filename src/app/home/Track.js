function Track(audio, input) {
    'use strict';

    var level = audio.createGain();
    audio.connect(input, level); //, audio.speakers);
    var recorder = new Recorder(level, { workerPath: "src/common/audio/recorder/recorderWorker.js" }),
        track = {
            armed: false,
            setRecording: function(record) {
                if (!track.armed) {
                    return;
                }
                if (record) {
                    recorder.clear();
                    recorder.record();
                }
                else {
                    recorder.stop();
                }
            },
            play: function(startTime) {
                recorder.getBuffer(function(buffers) {
                    // HACK naive error prevention checking
                    if (!buffers.length || !buffers[0].length || !buffers[1].length) {
                        return;
                    }
                    var buffer = audio.createBuffer(buffers);
                    audio.connect(buffer, audio.speakers());
                    buffer.start(startTime);
                });
            }
        };

    return track;
}
