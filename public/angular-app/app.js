"use strict";

angular.module('meanhotel', ['ngRoute'])
    .config(config);

function config($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');

    $routeProvider
        .when('/', {
            templateUrl: 'angular-app/hotel-list/hotels.html',
            controller: HotelsController,
            controllerAs: 'vm'
        })
        .when('/hotels/:id', {
            templateUrl: 'angular-app/hotel-display/hotel.html',
            controller: HotelController,
            controllerAs: 'vm'
        })
        .when('/register', {
            templateUrl: 'angular-app/register/register.html',
            controller: RegisterController,
            controllerAs: 'vm'
        });
}