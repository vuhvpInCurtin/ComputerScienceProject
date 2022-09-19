require("dotenv").config();
const http = require("http");
const sensor = require("./sensor");

let sub = null;

http
  .createServer((request, response) => {
    console.log(`Request url: ${request.url}`);

    const eventHistory = [];

    request.on("close", () => {
      closeConnection(response);
      if (sub) {
        sub.unsubscribe();
      }
      sub = null;
    });

    if (request.url.toLowerCase() === "/events") {
      response.writeHead(200, {
        Connection: "keep-alive",
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Access-Control-Allow-Origin": "*",
      });
      checkConnectionToRestore(request, response, eventHistory);
      sendEvents(response, eventHistory);
    } else {
      response.writeHead(404);
      response.end();
    }
  })
  .listen(process.env.PORT | 5000, () => {
    console.log(`Server running at port ${process.env.PORT}`);
  });

function sendEvents(response, eventHistory) {
  sub = sensor.read().subscribe((d) => {
    if (!response.finished) {
      const index = eventHistory.length + 1;
      const eventString = `id: ${index}\nevent: dataStream\ndata: {"temperature": ${d.temperature},"humidity": ${d.humidity},"ph": ${
        d.ph
      }, "time": ${new Date().getTime()}}\n\n`;
      response.write(eventString);
      eventHistory.push(eventString);
    }
  });
}

function closeConnection(response) {
  if (!response.finished) {
    response.end();
    console.log("Stopped sending events.");
  }
}

function checkConnectionToRestore(request, response, eventHistory) {
  if (request.headers["last-event-id"]) {
    const eventId = parseInt(request.headers["last-event-id"]);

    eventsToReSend = eventHistory.filter((e) => e.id > eventId);

    eventsToReSend.forEach((e) => {
      if (!response.finished) {
        response.write(e);
      }
    });
  }
}
