var app = angular.module('myApp', []);

app.filter('percent', function() {
  return function(input) {
    return input + '%';
  };
});

app.controller('screen3Ctrl', function($scope, $http) {

    var prefix = "http://139.224.57.175:3000/?header=req&name=";

    $scope.qualityTest  = {"oneTimeQualified": "", "repairQulified": ""};
    $scope.problemStack = {"p1": "不合格", "p1num": "0", "p2": "不合格", "p2num": "0", "p3": "不合格", "p3num": "0"};
    $scope.scheduleInfo  = {"successRate": "", "conflictRate": "", "faliure": ""};
    $scope.supplyChain = {"materials": "", "accessories": "", "parts": "", "completeRate": "", "intimeRate": ""};
    $scope.resource = {'name':[], 'value':[]};
    $scope.isTemperature = false;
    $scope.isHumidity = false;
    $scope.isVoltage = false;
    $scope.isHost = false;
    $scope.isDatabase = false;
    $scope.isMiddleware = false;

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

    var reasonAnalyzeChart = echarts.init(document.getElementById('reasonAnalyze'));
    reasonAnalyzeChart.setOption(pieOption);

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

    var barDataTransfer = function(indexData) {
        var res = {'name':[],'value':[]};
        var semi_length = parseInt(indexData.length/2);
        for(var i = 0; i < semi_length; i++) {
            res.name.push(indexData[i].name);
            res.value.push(parseFloat(indexData[i].value/indexData[i+semi_length].value).toFixed(2)*100);
        }
        return res;
    };

    var planCompleteChart = echarts.init(document.getElementById('planComplete'));
    planCompleteChart.setOption(planOption);

    var gaugeOption = {
        tooltip : {
            formatter: "{c}"
        },
        series: [
            {
                type: 'gauge',
                detail: [{
                    show: false
                }],
                data: [{'value': 0, 'name': ''}],
                radius: 100
            }
        ],
        grid: {
            top: 0,
            left: 0
        }
    };

    var itenvChart = echarts.init(document.getElementById('itenv'));
    itenvChart.setOption(gaugeOption);

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
                data:$scope.resource.value,
                itemStyle:{
                    normal:{
                        color: 'rgb(109, 120, 148)'
                    }
                },
                smooth:true,
            }
        ]
    };

    var lineDataTransfer = function(indexData) {
        var res = {'name':[],'value':[]};
        for(var i = 0; i < indexData.length; i++) {
            res.name.push(indexData[i].name);
            res.value.push(indexData[i].value);
        }
        return res;
    };

    var resourceChart = echarts.init(document.getElementById('resource'));
    resourceChart.setOption(lineOption);

    var httpGet = function () {
        // 环境图片
        $http.get(prefix+'t_env').success(function(response) {
            $scope.envList = JSON.parse(response.data).content;
        });

        // 智能生产控制
        $http.get(prefix+'t_produce_control').success(function(response) {
            $scope.produceControlList = JSON.parse(response.data).content;
        });

        // 质检
        $http.get(prefix+'t_qualityTest_oneTimeQualified').success(function(response) {
            $scope.qualityTest.oneTimeQualified = (parseFloat(JSON.parse(response.data).content)*100).toFixed(1)+'%';
        });

        $http.get(prefix+'t_qualityTest_repairQulified').success(function(response) {
            $scope.qualityTest.repairQulified = (parseFloat(JSON.parse(response.data).content)*100).toFixed(1)+'%';
        });

        $http.get(prefix+'t_reason_analyze').success(function(response) {
            // 不合格原因分析
            reasonAnalyzeChart.setOption({
                color : ['rgb(93,107,170)','rgb(181,191,240)','rgb(147,161,224)','rgb(200,210,246)','rgb(126,142,205)'],
                series : [
                    {data: pieDataTransfer(JSON.parse(response.data).content)}
                ]
            });

            // 问题栈点
            var problem = JSON.parse(response.data).content;
            var problemsum = 0;
            problem.forEach(function(p, i){  
                problemsum += p.value; 
            });
            $scope.problemStack = {
                "p1": problem[0].name, "p1num": parseFloat(problem[0].value/problemsum)*100, 
                "p2": problem[1].name, "p2num": parseFloat(problem[1].value/problemsum)*100, 
                "p3": problem[2].name, "p3num": parseFloat(problem[2].value/problemsum)*100
            };
        });

        // 智能排程
        $http.get(prefix+'t_schedule').success(function(response) {
            $scope.scheduleList = JSON.parse(response.data).content;

            // 智能排程百分比
            var scheduleState = JSON.parse(response.data).content;
            var scheduleMax = scheduleState[0].num;
            scheduleState.forEach(function(s, i) {
                if(s.num > scheduleMax) {
                    scheduleMax = s.num;
                }
            });
            var scheduleMaxFinal = (parseInt(scheduleMax/100)+1) * 100;
            var scheduleFinalList = [];
            scheduleState.forEach(function(s, i) {
                scheduleFinalList.push({'type': s.type, 'num': parseFloat(s.num/scheduleMaxFinal).toFixed(2)*100+'%'});
            });
            $scope.scheduleFinalList = scheduleFinalList; 
        });

        // 排产
        $http.get(prefix+'t_scheduleInfo_successRate').success(function(response) {
            $scope.scheduleInfo.successRate = (parseFloat(JSON.parse(response.data).content)*100).toFixed(1)+'%';
        });

        $http.get(prefix+'t_scheduleInfo_conflictRate').success(function(response) {
            $scope.scheduleInfo.conflictRate = (parseFloat(JSON.parse(response.data).content)*100).toFixed(1)+'%';
        });

        $http.get(prefix+'t_scheduleInfo_faliure').success(function(response) {
            $scope.scheduleInfo.faliure = JSON.parse(response.data).content;
        });

        // 供应链
        $http.get(prefix+'t_supplyChain_materials').success(function(response) {
            $scope.supplyChain.materials = JSON.parse(response.data).content;
        });

        $http.get(prefix+'t_supplyChain_accessories').success(function(response) {
            $scope.supplyChain.accessories = JSON.parse(response.data).content;
        });

        $http.get(prefix+'t_supplyChain_parts').success(function(response) {
            $scope.supplyChain.parts = JSON.parse(response.data).content;
        });

        $http.get(prefix+'t_supplyChain_completeRate').success(function(response) {
            $scope.supplyChain.completeRate = (parseFloat(JSON.parse(response.data).content)*100).toFixed(1)+'%';
        });

        $http.get(prefix+'t_supplyChain_intimeRate').success(function(response) {
            $scope.supplyChain.intimeRate = (parseFloat(JSON.parse(response.data).content)*100).toFixed(1)+'%';
        });

        // 计划达成率
        $http.get(prefix+'t_plan_complete').success(function(response) {
            $scope.planComplete = barDataTransfer(JSON.parse(response.data).content);
            planCompleteChart.setOption({
                yAxis : [
                    {
                        data : $scope.planComplete.name.reverse()
                    }
                ],
                series : [
                    {
                        data : $scope.planComplete.value.reverse()
                    }
                ]
            });
        });

        // IT运维--机房环境
        $http.get(prefix+'t_it_env').success(function(response) {
            $scope.temperature = JSON.parse(response.data).content[0].temperature;
            $scope.humidity = JSON.parse(response.data).content[0].humidity;
            $scope.voltage = JSON.parse(response.data).content[0].voltage;
        });

        // 关键资源可用性
        $http.get(prefix+'t_resource_host').success(function(response) {
            $scope.resourceHost = lineDataTransfer(JSON.parse(response.data).content);
        });

        $http.get(prefix+'t_resource_database').success(function(response) {
            $scope.resourceDatabase = lineDataTransfer(JSON.parse(response.data).content);
        });

        $http.get(prefix+'t_resource_middleware').success(function(response) {
            $scope.resourceMiddleware = lineDataTransfer(JSON.parse(response.data).content);
        });

    };
    httpGet();

    // 默认情况, 随机显示
    var envIndex = Math.floor(Math.random()*3);
    console.log(envIndex);
    $http.get(prefix+'t_it_env').success(function(response) {
        switch(envIndex) {
            case 0: 
                $scope.isTemperature = true;
                $scope.isHumidity = false;
                $scope.isVoltage = false;
                itenvChart.setOption({
                    series: [
                        {
                            data: [{value: $scope.temperature}]
                        }
                    ]
                });
                break;
            case 1:
                $scope.isTemperature = false;
                $scope.isHumidity = true;
                $scope.isVoltage = false;
                itenvChart.setOption({
                    series: [
                        {
                            data: [{value: $scope.humidity}]
                        }
                    ]
                });
                break;
            case 2:
                $scope.isTemperature = false;
                $scope.isHumidity = false;
                $scope.isVoltage = true;
                itenvChart.setOption({
                    series: [
                        {
                            data: [{value: $scope.voltage}]
                        }
                    ]
                });
                break;
            default:
        }
    });

    // 默认情况, 随机显示
    var resIndex = Math.floor(Math.random()*3);
    console.log(resIndex);
    $http.get(prefix+'t_resource_host').success(function(response) {
        switch(resIndex) {
            case 0: 
                $scope.isHost = true;
                $scope.isDatabase = false;
                $scope.isMiddleware = false;
                resourceChart.setOption({
                    xAxis : [
                        {
                            data : $scope.resourceHost.name
                        }
                    ],
                    series : [
                        {
                            data : $scope.resourceHost.value
                        }
                    ]
                });
                break;
            case 1:
                $scope.isHost = false;
                $scope.isDatabase = true;
                $scope.isMiddleware = false;
                resourceChart.setOption({
                    xAxis : [
                        {
                            data : $scope.resourceDatabase.name
                        }
                    ],
                    series : [
                        {
                            data : $scope.resourceDatabase.value
                        }
                    ]
                });
                break;
            case 2:
                $scope.isHost = false;
                $scope.isDatabase = false;
                $scope.isMiddleware = true;
                resourceChart.setOption({
                    xAxis : [
                        {
                            data : $scope.resourceMiddleware.name
                        }
                    ],
                    series : [
                        {
                            data : $scope.resourceMiddleware.value
                        }
                    ]
                });
                break;
            default:
        }
    });

    /* 使echarts随浏览器缩放 */
    window.onresize = function () {  
        reasonAnalyzeChart.resize();
        planCompleteChart.resize();
        itenvChart.resize();
        resourceChart.resize();
    }

    // 机房环境，click事件
    $scope.clickEnvTab = function(type) {
        switch(type) {
            case 'temperature':
                $scope.isTemperature = true;
                $scope.isHumidity = false;
                $scope.isVoltage = false;
                itenvChart.setOption({
                    series: [
                        {
                            data: [{value: $scope.temperature}]
                        }
                    ]
                });
                break;
            case 'humidity':
                $scope.isTemperature = false;
                $scope.isHumidity = true;
                $scope.isVoltage = false;
                itenvChart.setOption({
                    series: [
                        {
                            data: [{value: $scope.humidity}]
                        }
                    ]
                });
                break;
            case 'voltage':
                $scope.isTemperature = false;
                $scope.isHumidity = false;
                $scope.isVoltage = true;
                itenvChart.setOption({
                    series: [
                        {
                            data: [{value: $scope.voltage}]
                        }
                    ]
                });
                break;
            default:
        }
    }

    // 关键资源可用性，click事件
    $scope.clickResTab = function(type) {
        switch(type) {
            case 'host':
                $scope.isHost = true;
                $scope.isDatabase = false;
                $scope.isMiddleware = false;
                resourceChart.setOption({
                    xAxis : [
                        {
                            data : $scope.resourceHost.name
                        }
                    ],
                    series : [
                        {
                            data : $scope.resourceHost.value
                        }
                    ]
                });
                break;
            case 'database':
                $scope.isHost = false;
                $scope.isDatabase = true;
                $scope.isMiddleware = false;
                resourceChart.setOption({
                    xAxis : [
                        {
                            data : $scope.resourceDatabase.name
                        }
                    ],
                    series : [
                        {
                            data : $scope.resourceDatabase.value
                        }
                    ]
                });
                break;
            case 'middleware':
                $scope.isHost = false;
                $scope.isDatabase = false;
                $scope.isMiddleware = true;
                resourceChart.setOption({
                    xAxis : [
                        {
                            data : $scope.resourceMiddleware.name
                        }
                    ],
                    series : [
                        {
                            data : $scope.resourceMiddleware.value
                        }
                    ]
                });
                break;
            default:
        }
    }

    setInterval(httpGet, 2000);

});