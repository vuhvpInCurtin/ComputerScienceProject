const express = require('express');
const bodyParser = require("body-parser");
const socketio = require('socket.io');
const http = require('http');
const cors = require("cors");

const { addUser, removeUser, getUser } = require('./user');
const { connectToServer, getDb, getObjectId } = require('./db');

const PORT = process.env.PORT || 5001;
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

app.get("/", (req, res) => {
    let db = getDb();
    db.collection("data").find({}).toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

app.post("/check-id", (req, res) => {
    let db = getDb();
    const body = req.body
    const data_id = body['data_id']
    db.collection("data").findOne({ _id: getObjectId(data_id) }, function (err, response) {
        if (err) throw err;
        res.json(response);
    });
});

app.post("/create", (req, res) => {
    let db = getDb();
    const body = req.body
    const data = process_data(body)
    db.collection("data").insertOne(data, function (err, response) {
        if (err) throw err;
        res.json(response);
    });
});

const process_data = (form) => {
    return {
        'date': form['date'],
        'format': form['format'],
        'duration': +form['duration']
    }
}

io.on("connection", (socket) => {
    socket.on('join', ({ name, room }) => {
        const user = addUser(socket.id, name, room);
        socket.emit('joined');
        socket.join(user.room);
    })

    socket.on('request_stream_from_server', () => {
        const user = getUser(socket.id)
        io.to(user.room).emit('request_stream');
    })

    socket.on('data', (data) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('return_data', data);
    })

    socket.on("disconnect", () => {
        const user = removeUser(socket.id)
    })
})

server.listen(PORT, () => {
    connectToServer((err) => {
        if (err) console.error(err);
    });
    console.log(`Server has started on port ${PORT}`)
});