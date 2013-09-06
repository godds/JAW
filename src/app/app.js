angular.module("jaws", [
        "templates-app",
        "templates-common",
        "ui.state",
        "ui.route",
        "jaws.home"
    ])

    .config(function myAppConfig($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/home");
    })

    .run(function run() {

    })

    .controller("AppCtrl", function AppCtrl($scope, $location) {
    })

;

