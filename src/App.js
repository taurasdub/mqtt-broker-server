import "./App.css";
import { useEffect, useState } from "react";
import mqtt from "mqtt/dist/mqtt";
import { collectionGroup } from "firebase/firestore";
import { db } from "./config/firebase";
import { onSnapshot } from "firebase/firestore";

const MQTT_SERVER = "wss://test.mosquitto.org:8081";

function App() {
  const [messages, setMessages] = useState([]);

  const [mqttTopics, setMqttTopics] = useState([]);

  useEffect(() => {
    const query = collectionGroup(db, "devices");

    const unsubscribe = onSnapshot(query, (querySnapshot) => {
      const mqttTopics = [];

      querySnapshot.forEach((doc) => {
        const mqttTopic = doc.data().mqttTopic;
        mqttTopics.push(mqttTopic);
      });
      setMqttTopics(mqttTopics);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const mqttClient = mqtt.connect(MQTT_SERVER);
    mqttClient.on("connect", () =>
      mqttTopics.forEach((topic) =>
        mqttClient.subscribe(topic, function (err) {})
      )
    );
    mqttClient.on("message", (topic, payload, packet) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { topic: topic, payload: payload.toString() },
      ]);
    });

    // Add a setInterval function that runs every second and publishes the last message from each topic
    const intervalId = setInterval(() => {
      mqttTopics.forEach((topic) => {
        const lastMessage = messages
          .filter((message) => message.topic === topic)
          .pop();
        if (lastMessage) {
          mqttClient.publish(topic, lastMessage.payload);
        }
      });
    }, 1000);

    return () => {
      mqttClient.end();
      clearInterval(intervalId);
    };
  }, [mqttTopics, messages]);

  return (
    <div className="App">
      <h2>mqtt server</h2>
      {mqttTopics.map((topic, index) => {
        const lastMessage = messages
          .filter((message) => message.topic === topic)
          .pop();
        return (
          <div key={index}>
            <h3>{topic}</h3>
            {lastMessage ? (
              <h2>{lastMessage.payload}</h2>
            ) : (
              <p>No message received yet</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default App;
