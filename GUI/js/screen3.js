var app = angular.module('myApp', []);
app.controller('screen3Ctrl', function($scope, $http) {

    $scope.reasonAnalyze = {'name':['1','2','3','4','5'], 
                            'num':[1335,134,254,554,245]};
    $scope.planComplete = {'name':['采购计划','外协发货','批发出库'], 'num':[100, 95, 91]};
    $scope.resource = {'name':[1,2,3,4,5,6,7,8,9,10],
                      'num':[80,120,230,234,345,150,240,110,200,150]};
    $scope.temperature = 20;

    $scope.produceControl = function() {
        var onduty = ["45/52", "47/55", "40/50", "30/45"];
        var current_yield = ["3485", "3486", "3487", "3489"];
        var rework_rate = ["023", "0.24", "0.25", "0.26"];
        var per_output = ["45", "46", "47", "48", "49"];
        var average_work = ["3.23", "3.24", "3.25", "3.26"];
        var real_time_work = ["2.45", "2.46", "2.47", "2.48"];
        var data = [onduty, current_yield, rework_rate, per_output, average_work, real_time_work];
        return data;
    }

    $scope.qualityTest = function() {
        var data = ["98.5", "99.6"];
        return data;
    }

    $scope.schedule = function() {
        var data = ["238/打板", "382/裁剪", "474/缝制", "214/整烫", "588/包装"];
        return data;
    }

    $scope.scheduleInfo = function() {
        var data = ["98.6", "23.8", "27"];
        return data;
    }

    $scope.supplyChain = function() {
        var data = ["386", "683", "1236", "78", "99"];
        return data;
    }

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

    var pieDataTransfer = function(indexData){ //将数据输入转换成饼图需要的格式
        var res = [];
        var len = 0;
        for(var i = 0, size = indexData.name.length;i < size;i++) {
            res.push({
                name: indexData.name[i],
                value: indexData.num[i],
                selected: true
            });
        }
        return res;
    }

    var reasonAnalyzeChart = echarts.init(document.getElementById('reasonAnalyze'));
    reasonAnalyzeChart.setOption(pieOption);
    reasonAnalyzeChart.setOption({
        color : ['rgb(93,107,170)','rgb(181,191,240)','rgb(147,161,224)','rgb(200,210,246)','rgb(126,142,205)'],
        series : [
            {data: pieDataTransfer($scope.reasonAnalyze)}
        ]
    });

    var planOption = {
        tooltip : {
            trigger: 'axis',
        },
        textStyle: {
            color: 'white',
        },
        grid : {
            left: '60px',
            top: '30px'
        },
        xAxis : [
            {
                type : 'value',
                axisTick : {show: false},
                splitLine : false,
                show : true,
                // position: 'top',  // 横坐标在上
                axisLabel : { 
                    formatter : '{value}%' 
                },
            }
        ],
        yAxis : [
            {
                type : 'category',
                data : [],
                axisLine: {
                    lineStyle:{
                        color:'transparent'
                    },
                },
            }
        ],
        series : [
            {
                name:'计划达成率',
                type:'bar',
                label: {
                    normal: {
                        show: true,
                        position: 'right',
                    }
                },
                itemStyle:{
                    normal:{
                        color: '#73d05c'
                    }
                },
                data : [],
                markLine : {  
                    data : [  
                        {type : 'average', name: '平均值'}  
                    ]
                }
            }
        ]
    };

    var planCompleteChart = echarts.init(document.getElementById('planComplete'));
    planCompleteChart.setOption(planOption);
    planCompleteChart.setOption({
        yAxis : [
            {
                data : $scope.planComplete.name.reverse()
            }
        ],
        series : [
            {
                data : $scope.planComplete.num.reverse()
            }
        ]
    });

    var lineOption = {
        tooltip : {
            trigger: 'axis'
        },
        textStyle: {
            color: 'white',
        },
        grid: {
            top: 20
        },
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : $scope.resource.name,
                axisLine: {
                    lineStyle:{
                        color:'white'
                    }
                }
            }
        ],
        yAxis : [
            {
                type : 'value',
                splitLine : false,
                axisLine: {
                    lineStyle:{
                        color:'white'
                    }
                }
            }
        ],
        series : [
            {
                name:'可用资源',
                type:'line',
                symbol: 'none',
                areaStyle: {normal: {}},
                data:$scope.resource.num,
                itemStyle:{
                    normal:{
                        color: 'rgb(109, 120, 148)'
                    }
                },
                smooth:true,
            }
        ]
    };

    var resourceChart = echarts.init(document.getElementById('resource'));
    resourceChart.setOption(lineOption);

    var gaugeOption = {
        tooltip : {
            formatter: "{c}℃"
        },
        series: [
            {
                name: '温度',
                type: 'gauge',
                detail: [{
                    show: false
                }],
                data: [{value: $scope.temperature, name: ''}],
                radius: 100
            }
        ],
        grid: {
            top: 0,
            left: 0
        }
    };

    var temperatureChart = echarts.init(document.getElementById('temperature'));
    temperatureChart.setOption(gaugeOption);

    /* 使echarts随浏览器缩放 */
    window.onresize = function () {  
        reasonAnalyzeChart.resize();
        planCompleteChart.resize();
        resourceChart.resize();
        temperatureChart.resize();
    }

    // click事件, 修改数据
    $scope.clickTab = function() {
        resourceChart = echarts.init(document.getElementById('resource'));
        resourceChart.setOption(lineOption);
    }

});