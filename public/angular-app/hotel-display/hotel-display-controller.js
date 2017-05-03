angular.module('meanhotel')
    .controller('HotelController', HotelController);

function HotelController($http, $routeParams) {
    const vm = this; //view - model
    const id = $routeParams.id;

    $http.get('/api/hotels/' + id)
        .then(function (response) {
           vm.hotel = response.data;
        });
}