angular.module("jaws.home", [
    "ui.state",
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

.controller("HomeCtrl", function HomeController($scope, metronome) {
    var metronomeOn = false;

    $scope.toggleMetronome = function() {
        if (metronomeOn) {
            metronome.stop();
        }
        else {
            metronome.start();
        }
        metronomeOn = !metronomeOn;
    };
})

;
