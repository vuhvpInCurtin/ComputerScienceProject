$(document).on('submit', '#data-form', (e) => {
    e.preventDefault();
    const server_ip = $('#ip').val()
    const server_port = $('#port').val()
    const data_id = $('#data_id').val()
    let created = false

    const url = `http://${server_ip}:${server_port}/data/check/${data_id}`

    fetch(url)
        .then((res) => res.json())
        .then((res) => {
            if (res.success) {
                const url = `http://${server_ip}:${server_port}/data/stream`
                const eventSrc = new EventSource(url);
                eventSrc.onmessage = (e) => {
                    console.log('e.data :>> ', e.data);
                    if (e.data == "no-content") {
                        eventSrc.close()
                    } else {
                        if (!created) {
                            create_chart_element(JSON.parse(e.data))
                            created = true
                        }
                        update_chart(JSON.parse(e.data))
                    }
                };
            }
        });
});
