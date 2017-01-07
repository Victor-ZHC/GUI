var app = angular.module('myApp', []);
app.controller('screen1Ctrl', function($scope, $http) {

    var prefix = "http://139.224.57.175:3000/?header=req&name=";
    $scope.order = {"todayOrder":"","orderAmount":"",'todaySchedule':'','promptness':''};
    $scope.customService = {'workSheet':'','online':'','total':''};

    var topOption = {
        tooltip : {
            trigger: 'axis',
        },
        textStyle: {
            color: 'white',
        },
        grid : {
            left: '50px',
            top: '10px'
        },
        xAxis : [
            {
                type : 'value',
                axisTick : {show: false},
                splitLine : false,
                show : false
            }
        ],
        yAxis : [
            {
                type : 'category',
                data : [],
                axisLine: {
                    lineStyle:{
                        color:'transparent'
                    }
                }
            }
        ],
        series : [
            {
                name:'订单量',
                type:'bar',
                label: {
                    normal: {
                        show: true,
                        position: 'right',
                    }
                },
                itemStyle:{
                    normal:{
                        color: 'rgb(109, 120, 148)'
                    }
                },
                data : []
            }
        ]
    };

    var barDataTransfer = function(indexData) {
        var res = {'name':[],'value':[]};
        for(var i = 0; i < indexData.length; i++) {
            res.name.push(indexData[i].name);
            res.value.push(indexData[i].value);
        }
        return res;
    };

    var brandTopChart = echarts.init(document.getElementById('brandTop'));
    brandTopChart.setOption(topOption);

    var materialTopChart = echarts.init(document.getElementById('materialTop'));
    materialTopChart.setOption(topOption);

    var pieOption = {
        tooltip : {
            trigger: 'item',
            formatter: "{b} : {c} ({d}%)"
        },
        grid : {
            top: 'top',
            left: 'center'
        },
        textStyle: {
            color: 'white',
        },
        series : [
            {
                type: 'pie',
                radius : '55%',
                data: [],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    var pieDataTransfer = function(indexData) {
        for(var i = 0; i < indexData.length; i++) {
            indexData[i].selected = true;
        }
        return indexData;
    }

    var customerAreaDistChart = echarts.init(document.getElementById('customerAreaDist'));
    customerAreaDistChart.setOption(pieOption);

    var workSheetStateOption = {
        tooltip : {
            trigger: 'axis',
        },
        textStyle: {
            color: 'white',
        },
        xAxis: {
            type : 'category',
            data: [],
            axisLine: {
                lineStyle:{
                    color:'white'
                }
            },
            splitLine: {show: false}
        },
        yAxis: {
            splitLine: {show: false},
            show: false
        },
        grid: {
            left: 30,
            top: 20
        },
        series: [
            {
                name: '工单数',
                type: 'bar',
                stack: 'one',
                barMaxWidth: '40px',
                data: [],
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                    }
                }
            }
        ]
    };

    var workSheetStateChart = echarts.init(document.getElementById('workSheetState'));
    workSheetStateChart.setOption(workSheetStateOption);

    var workSheetContentChart = echarts.init(document.getElementById('workSheetContent'));
    workSheetContentChart.setOption(pieOption);

    var httpGet = function () {

        $http.get(prefix+'t_today_order').success(function(response) {
            $scope.order.todayOrder = JSON.parse(response.data).content;
        });
        $http.get(prefix+'t_order_amount').success(function(response) {
            $scope.order.orderAmount = (JSON.parse(response.data).content/10000).toFixed(2); //单位换算成万
        });
        $http.get(prefix+'t_today_schedule').success(function(response) {
            $scope.order.todaySchedule = JSON.parse(response.data).content;
        });
        $http.get(prefix+'t_order_promptness').success(function(response) {
            $scope.order.promptness = (parseFloat(JSON.parse(response.data).content)*100).toFixed(1)+'%';
        });
        $http.get(prefix+'t_order_emergency').success(function(response) {
            $scope.order.emergency = JSON.parse(response.data).content;
        });
        $http.get(prefix+'t_order_variation').success(function(response) {
            $scope.order.variation = JSON.parse(response.data).content;
        });
        $http.get(prefix+'t_order_exception').success(function(response) {
            $scope.order.exception = JSON.parse(response.data).content;
        });

        $http.get(prefix+'t_customservice_worksheet').success(function(response) {
            $scope.customService.workSheet = JSON.parse(response.data).content;
        });
        $http.get(prefix+'t_customservice_online').success(function(response) {
            $scope.customService.online = JSON.parse(response.data).content;
        });
        $http.get(prefix+'t_customservice_total').success(function(response) {
            $scope.customService.total = JSON.parse(response.data).content;
        });

        $http.get(prefix+'t_brand_top').success(function(response) {
            $scope.order.brandTop = barDataTransfer(JSON.parse(response.data).content);
            brandTopChart.setOption({
                yAxis : [
                    {
                        data : $scope.order.brandTop.name.reverse()
                    }
                ],
                series : [
                    {
                        data : $scope.order.brandTop.value.reverse()
                    }
                ]
            });
        });

        $http.get(prefix+'t_material_top').success(function(response) {
            $scope.order.materialTop = barDataTransfer(JSON.parse(response.data).content);
            materialTopChart.setOption({
                yAxis : [
                    {
                        data : $scope.order.materialTop.name.reverse()
                    }
                ],
                series : [
                    {
                        data : $scope.order.materialTop.value.reverse()
                    }
                ]
            });
        });

        $http.get(prefix+'t_customer_area_dist').success(function(response) {
            customerAreaDistChart.setOption({
                color : ['rgb(93,107,170)','rgb(181,191,240)','rgb(147,161,224)','rgb(200,210,246)','rgb(126,142,205)'],
                series : [
                    {data: pieDataTransfer(JSON.parse(response.data).content)}
                ]
            });;
        });

        $http.get(prefix+'t_customservice_worksheet_state').success(function(response) {
            $scope.customService.workSheetState = barDataTransfer(JSON.parse(response.data).content);
            workSheetStateChart.setOption({
                xAxis : [
                    {
                        data : $scope.customService.workSheetState.name
                    }
                ],
                series : [
                    {
                        data : [
                            {
                                value:$scope.customService.workSheetState.value[0],
                                itemStyle:{
                                    normal:{color:'rgb(128,253,0)'}
                                }
                            },
                            {
                                value:$scope.customService.workSheetState.value[1],
                                itemStyle:{
                                    normal:{color:'rgb(200,239,124)'}
                                }
                            },
                            {
                                value:$scope.customService.workSheetState.value[2],
                                itemStyle:{
                                    normal:{color:'rgb(255,171,0)'}
                                }
                            }
                        ]
                    }
                ]
            });
        });

        $http.get(prefix+'t_customservice_worksheet_content').success(function(response) {
            workSheetContentChart.setOption({
                color : ['rgb(183,216,137)','rgb(95,136,44)','rgb(125,166,72)','rgb(150,190,84)','rgb(196,222,159)'],
                series : [
                    {data: pieDataTransfer(JSON.parse(response.data).content)}
                ]
            });
        });

    };

    httpGet();
    
    /* 使echarts随浏览器缩放 */
    window.onresize = function () {  
        customerAreaDistChart.resize();
        materialTopChart.resize();
        brandTopChart.resize();
        workSheetStateChart.resize();
        workSheetContentChart.resize();
    }

    setInterval(httpGet, 2000);

});