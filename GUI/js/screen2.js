var app = angular.module('myApp', []);
app.controller('screen2Ctrl', function($scope, $http) {

    $scope.productLine = function() {
        var data = ["56/60", "48/60", "56/60"];
        return data;
    }

    $scope.workStation = function() {
        var data = ["1.45", "6.88", "12.8", "5.23"];
        return data;
    }

    $scope.brand = function() {
        var data = ["2/2", "6/8"];
        return data;
    }

    $scope.tailor = function() {
        var data = ["02:32:04", "68", "1348.3"];
        return data;
    }
       
    $scope.avgCar = function() {
        var car_a = ["092", "56", "66779"];
        var car_b = ["022", "34", "87889"];
        var car_c = ["023", "76", "19282"];
        var car_d = ["011", "112", "12812"];
        var car_e = ["128", "89", "87780"];
        var car_f = ["087", "54", "00980"];
        var data = [car_a, car_b, car_c, car_d, car_e, car_f];
        return data;
    }

    $scope.otherDevice = function() {
        var data = ["176/200", "176/200", "176/200", "176/200", "176/200", "176/200"];
        return data;
    }

});