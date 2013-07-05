function ApplicationViewModel(audioContext) {
    var self = this;

    self.audioContext = audioContext;
    self.recording = ko.observable(false);
    self.metronomeEnabled = ko.observable(false);
    self.tracks = ko.observableArray([]);
    self.metronome = new MetronomeViewModel(self.audioContext);
    self.audioInput = null;


    self.init = function() {
        navigator.getUserMedia({ audio: true },
                               function(stream) {
                                   self.audioInput = self.audioContext.createMediaStreamSource(stream);
                               },
                               function(error) {
                                   console.log(error);
                               });
    };

    self.toggleRecording = function() {
        self.recording(!self.recording());
        self.tracks().forEach(function(track) {
            track.setRecording(self.recording());
        });
    };

    self.play = function() {
        if (self.recording()) {
            return;
        }
        // HACK to hopefully get all the tracks to play in time
        var playStart = self.audioContext.currentTime + 1;
        self.tracks().forEach(function(track) {
            track.play(playStart);
        });
        if (metronomeEnabled()) {
            self.metronome.start(playStart);
            // HACK should be able to stop this in more sensible way
            self.metronome.stop(playStart + 60);
        }
    };

    self.addTrack = function() {
        self.tracks.push(new TrackViewModel(self.audioContext, self.audioInput));
    };

    self.removeTrack = function(track) {
        self.tracks.remove(track);
    }
}