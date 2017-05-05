angular.module('meanhotel')
    .controller('HotelController', HotelController);

function HotelController(hotelDataFactory, $routeParams, $route, AuthFactory, jwtHelper, $window) {
    const vm = this; //view - model
    const id = $routeParams.id;

    hotelDataFactory.hotelDisplay(id)
        .then(function (response) {
            vm.hotel = response.data;
            vm.stars = _getStars(response.data.stars);
        })
        .catch(function (error) {
            console.error(error.statusText);
        });

    vm.addReview = function () {

        const token = jwtHelper.decodeToken($window.sessionStorage.token);
        const username = token.username;

        let postData = {
            name: username,
            rating: vm.rating,
            review: vm.review
        };
        if(vm.reviewForm.$valid){
            hotelDataFactory.postReview(id, postData)
                .then(function (response) {
                    if(response.status === 201){
                        $route.reload();
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        else{
            vm.isSubmitted = true;
        }
    };

    vm.isLoggedIn = function () {
        return AuthFactory.isLoggedIn;
    }
}

function _getStars(stars) {
    return new Array(stars);
}