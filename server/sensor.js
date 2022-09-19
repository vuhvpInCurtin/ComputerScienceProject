const Rx = require("rxjs");
const EventSource = require("eventsource");

let eventSource = undefined;

function read() {
  if (!eventSource) {
    eventSource = new EventSource(`http://${process.env.SENSOR_IP}:${process.env.SENSOR_PORT}/stream`);
  }
  return Rx.Observable.create((o) => {
    eventSource.onmessage = (e) => {
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
