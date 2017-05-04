angular.module('meanhotel')
    .controller('HotelController', HotelController);

function HotelController(hotelDataFactory, $routeParams, $route) {
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
        let postData = {
            name: vm.name,
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
}

function _getStars(stars) {
    return new Array(stars);
}