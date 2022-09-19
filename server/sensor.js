const Rx = require("rxjs");
const EventSource = require("eventsource");

let eventSource = undefined;

function read() {
  if (!eventSource) {
    eventSource = new EventSource("http://127.0.0.1:8080/stream");
  }
  return Rx.Observable.create((o) => {
    eventSource.onmessage = (e) => {
      console.log(e.data, "d in here");
      const d = JSON.parse(e.data);
      o.next(d);
    };
    return () => {
      eventSource.close();
      eventSource = null;
    };
  });
}

module.exports = { read };
