"use strict";

angular.module('meanhotel', ['ngRoute'])
.config(config)
.controller('HotelsController', HotelsController);

function config($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'angular-app/hotels.html',
            controller: HotelsController,
            controllerAs: 'vm'
        });
}

function HotelsController() {
    const vm  = this;
    vm.title  = 'MEAN Hotel App';
}