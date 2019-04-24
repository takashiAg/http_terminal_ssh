'use strict';

const express = require('express')
    , app = express()
    , server = require('http').createServer(app)
    , pugStatic = require('pug-static')
    , Io = require('socket.io')
    , pty = require('pty.js')

app.use('/xterm.js', express.static('node_modules/xterm'))
app.use('/', pugStatic('views'))

let io = new Io(server);
io.on('connect',socket => {
  let term = pty.spawn('bash', [], {
    name: 'xterm-256color',
    cols: 80,
    rows: 24
  });
  term.write("ssh trainee01@192.168.100.72 -p 64109");
  term.write("\n");
  setTimeout(()=>{
    term.write("vygs1inzu0");
    term.write("\n");
    setTimeout(()=>{
      term.write("history -c");
      term.write("\n");
      term.write("clear");
      term.write("\n");
    },1000)
  },1000)
  var input=""
  term.on('data', d => socket.emit('data', d));
  socket.on('data', d => {
    //console.log(d)
    input+=d
    if(d=="\n"||d=="\r"){
    if(input.replace(" ","").startsWith("exit")){
      setTimeout(()=>term.write("exit\n"),1000)
      console.log(d)
    }else{input=""}
    }
    term.write(d)
  });
  socket.on('disconnect', () =>{
    term.destroy()
  });
});

server.listen(3000);
