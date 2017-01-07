var app = angular.module('myApp', []);
app.controller('screen2Ctrl', function($scope, $http) {

    var prefix = "http://139.224.57.175:3000/?header=req&name=";

    var httpGet = function () {

        $http.get(prefix+'t_congestion').success(function(response) {
            $scope.congestion = JSON.parse(response.data).content[0];
        });

        $http.get(prefix+'t_product_line').success(function(response) {
            $scope.productLine = JSON.parse(response.data).content;
        });

        $http.get(prefix+'t_workstation').success(function(response) {
            $scope.workStation = JSON.parse(response.data).content[0];
        });

        $http.get(prefix+'t_cutting_bed').success(function(response) {
            $scope.cuttingBed = JSON.parse(response.data).content;
        });

        $http.get(prefix+'t_cutting_bed_tailor').success(function(response) {
            $scope.tailor = JSON.parse(response.data).content[0];
            //先计算刀头移动时间占比，再将工作时间转换成时分秒格式
            $scope.tailor.moving_time = ($scope.tailor.moving_time/$scope.tailor.working_time*100).toFixed(2)+"%";
            $scope.tailor.working_time = formatSeconds($scope.tailor.working_time);
        });

        $http.get(prefix+'t_avgcar').success(function(response) {
            $scope.avgCar = JSON.parse(response.data).content;
        });

        $http.get(prefix+'t_device').success(function(response) {
            $scope.otherDevice = JSON.parse(response.data).content;
        });
    }

    httpGet();

    /* 将秒转换成时分秒 */
    function formatSeconds(value) { 
        var theTime = parseInt(value);// 秒 
        var theTime1 = 0;// 分 
        var theTime2 = 0;// 小时 
        if(theTime > 60) { 
            theTime1 = parseInt(theTime/60); 
            theTime = parseInt(theTime%60); 
            if(theTime1 > 60) { 
                theTime2 = parseInt(theTime1/60); 
                theTime1 = parseInt(theTime1%60); 
            } 
        } 
        var result = ""+parseInt(theTime); 
        if(theTime1 > 0) { 
            result = ""+parseInt(theTime1)+":"+result; 
        } 
        if(theTime2 > 0) { 
            result = ""+parseInt(theTime2)+":"+result; 
        } 
        return result; 
    }

    setInterval(httpGet,2000);

});