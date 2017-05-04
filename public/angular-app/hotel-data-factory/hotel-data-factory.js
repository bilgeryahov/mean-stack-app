angular.module('meanhotel')
    .factory('hotelDataFactory', hotelDataFactory);

function hotelDataFactory($http) {
    return{
        hotelList: hotelList,
        hotelDisplay: hotelDisplay,
        postReview: postReview
    };

    function hotelList() {
        return $http.get('/api/hotels?count=10')
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                return error;
            });
    }

    function hotelDisplay(id) {
        return $http.get('/api/hotels/' + id)
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                return error;
            });
    }

    function postReview(id, review) {
        return $http.post('api/hotels/' + id + '/reviews/', review)
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                return error;
            });
    }
}