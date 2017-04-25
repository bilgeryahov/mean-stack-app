angular.module('meanhotel')
    .controller('HotelsController', HotelsController);

function HotelsController($http) {
    const vm  = this; //view - model
    vm.title  = 'MEAN Hotel App';

    $http.get('/api/hotels?count=10')
        .then(function (response) {
            vm.hotels = response.data;
        });
}