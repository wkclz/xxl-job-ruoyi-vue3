<template>
  <div class="app-container home">
    <el-row :gutter="20">
      <el-col :span="12">
        <welcome />
      </el-col>
      <el-col :span="12">
        <blockquote class="text-warning" style="font-size: 14px">
          使用 Ruoyi-Vue3 重新实现 xxl-job 的管理后台页面. 只包含 UI
        </blockquote>
      </el-col>
    </el-row>
    <el-divider />
    <el-row :gutter="20">
      <el-col :span="16" style="padding-left: 20px">
        <div id="lineChart" style="height: 350px;"></div>
      </el-col>
      <el-col :span="8">
        <div id="pieChart" style="height: 350px;"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="Index">
import Welcome from "./conponents/welcome";
import {chartInfo} from '@/api/common'
import {parseTime} from "@/utils/ruoyi";

import * as echarts from 'echarts';

const chart = ref({});

function init() {
  const now = new Date();
  const startDate = parseTime(now.setDate(now.getDate()-7), '{y}-{m}-{d}') + ' 00:00:00';
  const endDate = parseTime(new Date(), '{y}-{m}-{d}') + ' 23:59:59'

  chartInfo({startDate, endDate}).then(res => {
    chart.value = res.content;
    lineChartInit(chart.value)
    pieChartInit(chart.value);
  })
}



function lineChartInit(data) {
  var option = {
    title: {
      text: '日期分布图'
    },
    tooltip : {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data:['成功', '失败', '进行中' ]
    },
    toolbox: {
      feature: {
        /*saveAsImage: {}*/
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis : [
      {
        type : 'category',
        boundaryGap : false,
        data : data.triggerDayList
      }
    ],
    yAxis : [
      {
        type : 'value'
      }
    ],
    series : [
      {
        name: '成功',
        type:'line',
        stack: 'Total',
        areaStyle: {normal: {}},
        data: data.triggerDayCountSucList
      },
      {
        name: '失败',
        type:'line',
        stack: 'Total',
        label: {
          normal: {
            show: true,
            position: 'top'
          }
        },
        areaStyle: {normal: {}},
        data: data.triggerDayCountFailList
      },
      {
        name: '进行中',
        type:'line',
        stack: 'Total',
        areaStyle: {normal: {}},
        data: data.triggerDayCountRunningList
      }
    ],
    color:['#00A65A', '#c23632', '#F39C12']
  };

  var lineChart = echarts.init(document.getElementById('lineChart'));
  lineChart.setOption(option);
}

function pieChartInit(data) {
  var option = {
    title : {
      text: '成功比例图' ,
      /*subtext: 'subtext',*/
      x:'center'
    },
    tooltip : {
      trigger: 'item',
      formatter: "{b} : {c} ({d}%)"
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['成功', '失败', '进行中' ]
    },
    series : [
      {
        //name: '分布比例',
        type: 'pie',
        radius : '55%',
        center: ['50%', '60%'],
        data:[
          {
            name: '成功',
            value:data.triggerCountSucTotal
          },
          {
            name: '失败',
            value:data.triggerCountFailTotal
          },
          {
            name: '进行中',
            value:data.triggerCountRunningTotal
          }
        ],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ],
    color:['#00A65A', '#c23632', '#F39C12']
  };
  var pieChart = echarts.init(document.getElementById('pieChart'));
  pieChart.setOption(option);
}


init();
</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>

