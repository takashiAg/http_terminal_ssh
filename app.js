'use strict';

const express = require('express')
    , app = express()
    , server = require('http').createServer(app)
    , pugStatic = require('pug-static')
    , Io = require('socket.io')
    , Client = require('ssh2').Client;

let ssh_config = {
    host: '10.211.55.37',
    port: 22,
    username: 'user',
    password: 'password'
}

app.use('/xterm.js', express.static('node_modules/xterm'))
app.use('/', pugStatic('views'))

let io = new Io(server);
io.on('connect', socket => {
    let ssh_stream;
    let conn = new Client();
    let shell = (err, stream) => {
        if (err)
            throw err;
        ssh_stream = stream;
        stream
            .on('close', conn.end)
            .on('data', data => socket.emit('data', "" + data));
    }
    conn
        .on('ready', () => conn.shell(shell))
        .connect(ssh_config);
    socket.on('data', d => ssh_stream.write(d));
    socket.on('disconnect', () => ssh_stream.end('\nexit\n'))
});

server.listen(3000);


