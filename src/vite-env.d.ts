// src/vite-env.d.ts
interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    // add other VITE_ vars here
    readonly VITE_MQTT_WS_URL: string;
    readonly VITE_MQTT_USERNAME: string;
    readonly VITE_MQTT_PASSWORD: string;
    readonly VITE_MQTT_TEMPERATURE_TOPIC: string;
    readonly VITE_MQTT_HUMIDITY_TOPIC: string;

    readonly VITE_FAN_DEVICE_ID?: string;
}
