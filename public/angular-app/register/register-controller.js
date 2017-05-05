angular.module('meanhotel')
    .controller('RegisterController', RegisterController);

function RegisterController($http) {
    const vm = this;

    vm.register = function () {
        const user = {
            username: vm.username,
            password: vm.password
        };

        if(!vm.username || !vm.password){
            vm.error = 'Please add a username and a password.';
            return;
        }

        if(vm.password !== vm.passwordRepeat){
            vm.error = 'Make sure that the passwords match.';
            return;
        }

        // All fine.
        $http.post('/api/users/register', user)
            .then(function (result) {
                console.log(result);
                vm.message = 'Successful registration, please login.';
                vm.error = '';
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}