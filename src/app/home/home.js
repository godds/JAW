angular.module("jaws.home", [
    "ui.state",
    "audio",
    "audio.metronome"
])

.config(function config($stateProvider) {
    $stateProvider.state("home", {
        url: "/home",
        views: {
            "main": {
                controller: "HomeCtrl",
                templateUrl: "home/home.tpl.html"
            }
        }
    });
})

.controller("HomeCtrl", function HomeController($scope, audio, metronome) {
    var recording = false,
        input;

    audio.getAudioStream(function(node) {
                            console.log("input stream available");
                            input = node;
                        },
                        function(error) {
                            console.log(error);
                        });

    $scope.metronomeOn = false;
    $scope.tracks = [];

    $scope.toggleArmed = function(track) {
        track.armed = !track.armed;
    };
    $scope.addTrack = function() {
        if (!input) {
            return;
        }
        $scope.tracks.push(new Track(audio, input));
    };
    $scope.deleteTrack = function(track) {
        var index = $scope.tracks.indexOf(track);
        if (index != -1) {
            $scope.tracks.splice(index, 1);
        }
    };

    $scope.toggleRecording = function() {
        recording = !recording;
        $scope.tracks.forEach(function(track) {
            track.setRecording(recording);
        });
    };
    $scope.play = function() {
        if (recording) {
            return;
        }
        // HACK to hopefully get all the tracks to play in time
        var playStart = audio.currentTime() + 1;
        $scope.tracks.forEach(function(track) {
            track.play(playStart);
        });
        if ($scope.metronomeOn) {
            metronome.start(); // HOW TO STOP THE METRONOME?
        }
    };
    $scope.recordingLabel = function() {
        return recording ? "Stop Recording" : "Start Recording";
    };
    $scope.trackArmedLabel = function(track) {
        return track && track.armed ? "Disarm" : "Arm";
    };
})

;
