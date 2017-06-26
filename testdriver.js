


function sendError(e){
    console.log(`Error: ${e}`);
}

function sendEvent(event, payload){
    console.log(`Event: \n\tType: ${event} \n\tPayload:${payload}`);
}

function setState(key, value){
    console.log(`SetState: \n\tKey: ${key} \n\tValue:${value}`);
}

let node = {
    error: sendError,
    event: sendEvent,
    setState
}



function TestDriver(config, node){
    node.error('Test!');
    const {ip} = config;

    const commands = {
        test: ()=>console.log(ip)
    }

    return(commands);
}

let x =  TestDriver({ip: '191.168.123.1'}, node);

x.test();