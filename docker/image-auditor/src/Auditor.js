
var dgram = require('dgram');
var net = require('net');
const moment = require('moment');

moment().format();

const protocol = require('./protocol');

//Liste des sons
var sons = new Map();
sons.set("ti-ta-ti", "piano");
sons.set("pouet", "trumpet");
sons.set("trulu", "flute");
sons.set("gzi-gzi", "violin");
sons.set("boum-boum", "drum");

//Repris de thermomètre
var s = dgram.createSocket('udp4');
s.bind(protocol.PROTOCOL_PORT, function () {
    console.log("Joining multicast group");
    s.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

//Liste des musiciens actifs
var actives = new Array();
var musiciens = new Map();

s.on('message', function (msg, source) {

    var tmpMus = JSON.parse(msg);

    if (!musiciens.has(tmpMus.uuid)) {
        var musicien = new Object();
        musicien.uuid = tmpMus.uuid;
        musicien.instrument = sons.get(tmpMus.sound);
        musicien.activeSince = moment();
        musicien.active = true;

        musiciens.set(musicien.uuid, musicien);
    } else {
        musiciens.get(tmpMus.uuid).active = true;
    }
});

//interval d'écoute ~3sec
setInterval(function () {

    actives = new Array();

    musiciens.forEach(function forAll(value,key, map){
        if(musiciens.get(key).active){

            var tmpMus = new Object();
            tmpMus.uuid = musiciens.get(key).uuid;
            tmpMus.instrument = musiciens.get(key).instrument;
            tmpMus.activeSince = musiciens.get(key).activeSince;

            actives.push(tmpMus);
            musiciens.get(key).active = false;
        }
	});

    console.log(JSON.stringify(actives));



}, 3000);

//Partie TCP
var server = net.createServer(function (socket) {
        var payload = JSON.stringify(actives);
        socket.write(payload + '\r\n');
        socket.pipe(socket);
        socket.end();
});

server.listen(2205, '0.0.0.0');

