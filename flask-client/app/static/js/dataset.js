$(document).on('submit', '#upload-form', (e) => {
    e.preventDefault();
    const server_ip = $('#ip').val()
    const server_port = $('#port').val()
    const file = $('#file')[0].files[0]
    const data = new FormData()
    let created = false

    data.append("file", file)

    const url = `http://${server_ip}:${server_port}/dataset/upload`

    fetch(url, { method: "POST", body: data })
        .then((res) => res.json())
        .then((res) => {
            if (res.success) {
                const url = `http://${server_ip}:${server_port}/dataset/stream`
                const eventSrc = new EventSource(url);

                eventSrc.onmessage = (e) => {
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
