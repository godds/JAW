angular.module("jaws.home", [
    "ui.state"
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

.controller("HomeCtrl", function HomeController($scope) {
    $scope.title = "JAWs";
})

;