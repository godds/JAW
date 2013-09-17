angular.module("jaws.home", [
    "ui.state",
    "audio-utils"
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

.controller("HomeCtrl", function HomeController($scope, audio) {
    $scope.title = "JAWs";

    var temp = audio.createGain();
    var temp2 = audio.createNoise();
})

;