angular.module('meanhotel')
    .controller('HotelsController', HotelsController);

function HotelsController(hotelDataFactory) {
    const vm  = this; //view - model
    vm.title  = 'MEAN Hotel App';

    hotelDataFactory.hotelList().then(function (response) {
        vm.hotels = response.data;
    }, function (error) {
        console.error(error.statusText);
    })
}