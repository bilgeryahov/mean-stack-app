angular.module('meanhotel')
    .controller('HotelController', HotelController);

function HotelController(hotelDataFactory, $routeParams) {
    const vm = this; //view - model
    const id = $routeParams.id;

    hotelDataFactory.hotelDisplay(id).then(function (response) {
        vm.hotel = response.data;
        vm.stars = _getStars(response.data.stars);
    }, function (error) {
        console.error(error.statusText);
    })
}

function _getStars(stars) {
    return new Array(stars);
}