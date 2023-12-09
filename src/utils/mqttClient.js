// import mqtt from 'mqtt';
// import 'dotenv/config';
// import store from "../redux/store";
// import { updateRealTimeData } from "../redux/sensorSlice";

// const mqttClient = mqtt.connect("mqtt://192.168.1.123:9001");

// const PUB_sensor_data_realtime = "/ui_to_esp/data_realtime";
// const SUB_sensor_data_realtime = "1/esp_to_ui/data_realtime";

// mqttClient.on("connect", () => {
//     mqttClient.subscribe(SUB_sensor_data_realtime);  
//     mqttClient.subscribe("presence", (err) => {
//         if (!err) {
//             mqttClient.publish("presence", "Hello mqtt");
//         }
//     });
 
//     mqttClient.publish(PUB_sensor_data_realtime, "1"); 

// }); 

// mqttClient.on("message", (topic, message) => {
//     // message is Buffer
//     console.log("--------------------------------------");
//     console.log(topic);
//     console.log(message.toString());

//     if (topic === SUB_sensor_data_realtime) {
//         let data = message.toString().split(', ');

//         // Chuyển đổi mỗi phần tử trong mảng thành số
//         data.map(function(item) {
//             return parseFloat(item);
//         });
//         store.dispatch(updateRealTimeData(data))
//     }    

//     mqttClient.end();
// });

// export default mqttClient;

import mqtt from 'mqtt';
import 'dotenv/config';
import store from '../redux/store';
import { updateRealTimeData } from '../redux/sensorSlice';

class MQTTClient {
  constructor() {
    this.client = mqtt.connect(process.env.REACT_APP_MQTT_HOST);

    this.PUB_sensor_data_realtime = "/ui_to_esp/data_realtime";
    this.SUB_sensor_data_realtime = "1/esp_to_ui/data_realtime";

    this.client.on("connect", () => {
      this.client.subscribe(this.SUB_sensor_data_realtime);
      this.client.subscribe("presence", (err) => {
        if (!err) {
          this.client.publish("presence", "Hello mqtt");
        }
      });

      this.client.publish(this.PUB_sensor_data_realtime, "1");
    });

    this.client.on("message", (topic, message) => {
      this.handleMessage(topic, message);
    });
  }

  handleMessage(topic, message) {
    // console.log("--------------------------------------");
    // console.log(topic);
    // console.log(message.toString());

    if (topic === this.SUB_sensor_data_realtime) {
        let data = message.toString().split(', ');

        // Chuyển đổi mỗi phần tử trong mảng thành số
        data = data.map(function(item) {
            return parseFloat(item);
        });

        store.dispatch(updateRealTimeData(data));
    }
  }

  end() {
    this.client.end();
  }
}

const mqttClient = new MQTTClient();

export default mqttClient;
