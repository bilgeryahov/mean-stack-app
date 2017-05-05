angular.module('meanhotel')
    .controller('LoginController', LoginController);

function LoginController($http, $location, $window, AuthFactory, jwtHelper) {
    const vm = this;

    vm.isLoggedIn = function () {
        return AuthFactory.isLoggedIn;
    };

    vm.login = function () {
        if(vm.username && vm.password){
            const user = {
                username: vm.username,
                password: vm.password
            };

            $http.post('/api/users/login', user)
                .then(function (response) {
                    if(response.data.success){
                        $window.sessionStorage.token = response.data.token;
                        AuthFactory.isLoggedIn = true;
                        const token = $window.sessionStorage.token;
                        const decodedToken = jwtHelper.decodeToken(token);
                        vm.loggedInUser = decodedToken.username;
                    }

                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        else{
            vm.error = 'Enter username/password';
        }
    };

    vm.logout = function () {
        AuthFactory.isLoggedIn = false;
        delete $window.sessionStorage.token;
        $location.path('/');
    };

    vm.isActiveTab = function (url) {
        const currentPath = $location.path().split('/')[1];
        return (url === currentPath ? 'active' : '');
    };
}