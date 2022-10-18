const get_chart_options = (id, label, min, max) => {
    const options = {
        series: [{
            data: []
        }],
        chart: {
            id: id,
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
        },
        title: {
            text: label,
            align: "left",
        },
        xaxis: {
            type: "category",
            range: 10,
            labels: {
                datetimeUTC: false,
                format: "hh:mm:ss",
                formatter: (value) => {
                    const d = new Date(value);
                    const day = d.getDate();
                    const month = d.toLocaleString("default", { month: "long" });
                    const time = d.toLocaleTimeString();
                    return `${day} ${month} ${time}`;
                },
            },
        },
        yaxis: {
            min: min,
            max: max,
            tickAmount: 5,
            labels: {
                formatter: (val) => {
                    return val.toFixed(2);
                },
            },
        },
        legend: {
            show: false,
        },
    }

    return options
}

const create_chart_element = (data) => {
    Object.keys(data).map((k, i) => {
        if (!k.toLowerCase().includes("time") && !k.toLowerCase().includes("date")) {
            $('#visualization').append(`<div id='chart-${i + 1}' class='col-6' style='min-height: 400px;'></div>`)
            var options = get_chart_options(`chart-${i + 1}`, k.trim(), data[k].min, data[k].max)
            var chart = new ApexCharts(document.querySelector(`#chart-${i + 1}`), options);
            chart.render();
        }
    })
}

const getDateTime = (data) => {
    let result;
    Object.keys(data).forEach((k) => {
        if (k.toLowerCase().includes("time") || k.toLowerCase().includes("date")) {
            result = k;
        }
    });
    return result;
};

const update_chart = (data) => {
    Object.keys(data).map((k, i) => {
        const id = `chart-${i + 1}`
        if (!k.toLowerCase().includes("time") && !k.toLowerCase().includes("date")) {
            const d = {
                timestamp: new Date(data[getDateTime(data)].value),
                value: data[k].value,
                min: data[k].min,
                max: data[k].max,
            };
            ApexCharts.exec(id, 'appendData', [{
                data: [{
                    x: d.timestamp,
                    y: d.value
                }]
            }], true);
        }
    })
}