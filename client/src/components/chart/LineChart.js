import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import ApexCharts from "apexcharts";

function LineChart(props) {
  const [data, setData] = useState([]);
  const [currentTime, setCurrentTime] = useState(undefined);
  const [currentDate, setCurrentDate] = useState(undefined);
  const [series, setSeries] = useState([{ name: props.label, data: data.slice() }]);
  const [options, setOptions] = useState({
    chart: {
      id: props.label,
      height: 350,
      type: "line",
      animations: {
        enabled: true,
        easing: "linear",
        dynamicAnimation: {
          speed: 1000,
        },
      },
      zoom: {
        autoScaleYaxis: true,
      },
      toolbar: {
        show: false,
      },
    },
    tooltip: { followCursor: true },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    title: {
      text: props.label,
      align: "left",
    },
    xaxis: {
      type: "category",
      range: 10,
      labels: {
        datetimeUTC: false,
        formatter: function (value) {
          const d = new Date(value);
          const time = d.toLocaleTimeString();
          return `${time}`;
        },
      },
    },
    yaxis: {
      min: (min) => {
        min = Math.floor(props.data.min / 5) * 5;
        return min;
      },
      max: (max) => {
        max = Math.ceil(props.data.max / 5) * 5;
        return max;
      },
      tickAmount: 5,
      labels: {
        formatter: function (val) {
          return val.toFixed(2);
        },
      },
    },
    legend: {
      show: false,
    },
  });

  useEffect(() => {
    let time = new Date(props.data.timestamp);
    setData((prev) => [...prev, { x: time, y: props.data.value }]);
    setCurrentDate(time.toDateString());
    setCurrentTime(time);
  }, [props.data]);

  useEffect(() => {
    ApexCharts.exec(props.label, "updateSeries", [
      {
        data: data,
      },
    ]);
  }, [data]);

  return <Chart options={options} series={series} type="line" height={350} />;
}

export default LineChart;
