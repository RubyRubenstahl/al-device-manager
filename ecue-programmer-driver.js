/**
 * Created by Mike on 6/18/2017.
 */

const dgram = require('dgram');
const DeviceDriver = require('./device-driver');
const ProgrammerStream = require('ecue-programmer-stream');


const percentToVmLevel = level => Math.round(level * 4096/100);

function ProgrammerDriver(config, node){
    const {ip='127.0.0.1', port=4000} = config;


    const socket = dgram.createSocket('udp4', {ip});
    socket.bind({port});

    const dispatch = ProgrammerStream.CommandDispatcher(socket, {address:'localhost'});
    const stateStream = ProgrammerStream.StateStream(socket);

    stateStream.all.subscribe()
        .map(packet=>packet.data)
        .forEach(data=>console.log(data));

    const commands = {
      PLAY_CUELIST: {
        name: "PLAY_CUELIST",
        description: "Play an cuelist",
        params: {
          cuelist: {required: true, type: "Number"},
        },
        run: function ({cuelist}) {
          dispatch.send({command: 'CUELIST_PLAY', params: [cuelist]})
        }
      },

      PLAY_CUE: {
        name: "PLAY_CUE",
        description: 'Play a cue within a cuelist',
        params: {
          cuelist: {required: true, type: "Number"},
          cue: {required: true, type: "Number"},
        },
        run: function ({cuelist, cue}) {
          dispatch.send({command: 'CUE_PLAY', params: [cuelist, cue]})
        }
      },

      CUELIST_STOP: {
        name: "PLAY_CUE",
        description: 'Stop a cuelist.',
        params: {
          cuelist: {required: true, type: "Number"},
        },
        run: function ({cuelist, cue}) {
          dispatch.send({command: 'CUELIST_STOP', params: [cuelist]})
        }
      },

      GM_SET_LEVEL: {
        name: "GM_SET_LEVEL",
        description: 'Set the grandmaster level.',
        params: {
          level: {required: true, type: "Number"},
        },
        run: function ({level}) {
          dispatch.send({command: 'GM_SET_LEVEL', params: [percentToVmLevel(level)]})
        }
      },

      VM_SET_LEVEL: {
        name: "GM_SET_LEVEL",
        description: 'Set the grandmaster level.',
        params: {
          index: {required: true, type: "Number"},
          level: {required: true, type: "Number"},
        },
        run: function ({index,level}) {
          const scaledLevel = Math.round(level * 4096/100);
          dispatch.send({command: 'VM_SET_LEVEL', params: [index, percentToVmLevel(level)]})
        }
      },

    }

    function destroy(){
      socket.close();
    }

    return({commands, destroy});
}

const setState = (key, value)=>{
  console.log(`SetState: \n\tKey: ${key} \n\tValue:${value}`);
}

let programmer = ProgrammerDriver({ip: '192.168.123.11'}, {});
programmer.commands['VM_SET_LEVEL'].run({index: 5, level:88.9});
// module.exports = ProgrammerDriver;
