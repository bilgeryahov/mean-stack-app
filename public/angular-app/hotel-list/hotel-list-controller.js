angular.module('meanhotel')
    .controller('HotelsController', HotelsController);

function HotelsController() {
    const vm  = this;
    vm.title  = 'MEAN Hotel App';
}