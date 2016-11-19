var app = angular.module('myApp', []);
app.controller('screen1Ctrl', function($scope, $http) {

    $scope.order = {};
    var prefix = "http://139.224.57.175:3000/?header=req&name=";

	var url=prefix+"t_today_order";
   	$http.get(url).success(function(response) {
        $scope.order.todayOrder = JSON.parse(response.data).content; 
    });
  	
  	// $scope.order.todayOrder = 75394;
    $scope.order.orderAmount = 4378.43;
    $scope.order.brandTop = {'name':['品牌1','品牌2','品牌3'], 'num':[2342, 1680, 1028]};
    $scope.order.materialTop = {'name':['面料1','面料2','面料3'], 'num':[2342, 1680, 1028]};
    $scope.order.customerAreaDist = {'name':['上海','杭州','南京','北京','美国'], 
                                     'num':[1335,134,254,554,245]};

    $scope.order.schedule = 3649;
    $scope.order.promptness = '97.6%';
    $scope.order.emergency = 16;
    $scope.order.variation = 37;
    $scope.order.exception = 08;

    $scope.customService = {};
    $scope.customService.workSheet = 1289;
    $scope.customService.online = 68;
    $scope.customService.total = 126;
    $scope.customService.workSheetProcess = [450, 280, 156];
    $scope.customService.workSheetContent = {'name':['1','2','3','4','5'], 
                                     'num':[1335,134,254,554,245]};

	$scope.addCommas = function(data) {  //数字格式处理，加逗号
		data += '';  
		var x = data.split('.');  
		var x1 = x[0];  
		var x2 = x.length > 1 ? '.' + x[1] : '';  
		var rgx = /(\d+)(\d{3})/;  
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');  
		}  
		return x1 + x2;
	}
	
    var topOption = {
        tooltip : {
            trigger: 'axis',
        },
        textStyle: {
            color: 'white',
        },
        grid : {
            left: '40px',
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

    var brandTopChart = echarts.init(document.getElementById('brandTop'));
    brandTopChart.setOption(topOption);
    brandTopChart.setOption({
        yAxis : [
            {
                data : $scope.order.brandTop.name.reverse()
            }
        ],
        series : [
            {
                data : $scope.order.brandTop.num.reverse()
            }
        ]
    });

    var materialTopChart = echarts.init(document.getElementById('materialTop'));
    materialTopChart.setOption(topOption);
    materialTopChart.setOption({
        yAxis : [
            {
                data : $scope.order.materialTop.name.reverse()
            }
        ],
        series : [
            {
                data : $scope.order.materialTop.num.reverse()
            }
        ]
    });

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

    var customerAreaDistChart = echarts.init(document.getElementById('customerAreaDist'));
    customerAreaDistChart.setOption(pieOption);
    customerAreaDistChart.setOption({
        color : ['rgb(93,107,170)','rgb(181,191,240)','rgb(147,161,224)','rgb(200,210,246)','rgb(126,142,205)'],
        series : [
            {data: pieDataTransfer($scope.order.customerAreaDist)}
        ]
    });

    var workSheetProcessOption = {
        tooltip : {
            trigger: 'axis',
        },
        textStyle: {
            color: 'white',
        },
        xAxis: {
            type : 'category',
            data: ['处理中','未处理','紧急'],
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
                data: [
                    {
                        value:$scope.customService.workSheetProcess[0],
                        itemStyle:{
                            normal:{color:'rgb(128,253,0)'}
                        }
                    },
                    {
                        value:$scope.customService.workSheetProcess[1],
                        itemStyle:{
                            normal:{color:'rgb(200,239,124)'}
                        }
                    },
                    {
                        value:$scope.customService.workSheetProcess[2],
                        itemStyle:{
                            normal:{color:'rgb(255,171,0)'}
                        }
                    }
                ],
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                    }
                }
            }
        ]
    };

    var workSheetProcessChart = echarts.init(document.getElementById('workSheetProcess'));
    workSheetProcessChart.setOption(workSheetProcessOption);

    var workSheetContentChart = echarts.init(document.getElementById('workSheetContent'));
    workSheetContentChart.setOption(pieOption);
    workSheetContentChart.setOption({
        color : ['rgb(183,216,137)','rgb(95,136,44)','rgb(125,166,72)','rgb(150,190,84)','rgb(196,222,159)'],
        series : [
            {data: pieDataTransfer($scope.customService.workSheetContent)}
        ]
    });


    /* 使echarts随浏览器缩放 */
    window.onresize = function () {  
        customerAreaDistChart.resize();
        materialTopChart.resize();
        brandTopChart.resize();
        workSheetProcessChart.resize();
        workSheetContentChart.resize();
    }

});