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
          speed: 2000,
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
      lineCap: "round",
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
        format: "hh:mm:ss",
        formatter: function (value, timestamp, index) {
          return new Date(value).toLocaleTimeString();
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
    if (currentTime) {
      ApexCharts.exec(props.label, "addXaxisAnnotation", {
        x: new Date(currentTime).toLocaleTimeString(),
        borderColor: "#775DD0",
        label: {
          style: {
            color: "black",
          },
          offsetX: 10,
          text: currentDate,
        },
      });
    }
  }, [currentDate]);

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
