var mqtt=require('mqtt')                                                                                                   
var Gpio = require('onoff').Gpio;
var Door = new Gpio(18,'out');
var thingToken = 'RrT64DgNXML0_a2adeGVOyuC9uzpDNhkaLTTEPEUrPW' //Your things Token
var thingTopic = 'v2/things/'+thingToken

var client = mqtt.connect({
        host: 'mqtt.thethings.io',
        port: 1883
});

//Activate door function
function activate_door()
{
        Door.writeSync(1);
        console.log("opening door");
        setTimeout(function(){deactivate_door()}, 3000);
}

//Deactivate door function
function deactivate_door()
{
        Door.writeSync(0);
        console.log("closing door");
}

//Mqtt decode message in case you need it to filter diferent actions
function mqtt_decode_message(message)
{
        console.log("Evaluating message action content...");
        var object = JSON.parse(message);

        //Door action
        if( object[0].key == "demo_resource")
        {
                activate_door();
        }else{
                console.log("not door action, maybe another thing...");
        }
}
client.on("connect",function(){
        console.log("connected  "+client.connected);
        client.subscribe(thingTopic,function(){
                console.log("Subscribed");
        });
});

client.on('message',function(thingTopic, message, packet){
                console.log("message is "+ message);
                console.log("topic is "+ thingTopic);
                mqtt_decode_message(message);
});
