import {
  useEffect,
  useRef,
} from "react";

import {
  useQueryClient,
} from "@tanstack/react-query";

import mqtt from "mqtt";

import {
  QUERY_KEYS,
} from "@/lib/constants";

export function useLiveTemperature(
  enabled: boolean,
) {
  const queryClient =
    useQueryClient();

  const temperatureRef =
    useRef<number | null>(null);

  const humidityRef =
    useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const url =
      import.meta.env
        .VITE_MQTT_WS_URL;

    const username =
      import.meta.env
        .VITE_MQTT_USERNAME;

    const password =
      import.meta.env
        .VITE_MQTT_PASSWORD;

    const temperatureTopic =
      import.meta.env
        .VITE_MQTT_TEMPERATURE_TOPIC;

    const humidityTopic =
      import.meta.env
        .VITE_MQTT_HUMIDITY_TOPIC;

    if (
      !url ||
      !temperatureTopic ||
      !humidityTopic
    ) {
      console.error(
        "Missing MQTT configuration",
      );

      return;
    }

    const client =
      mqtt.connect(url, {
        username,
        password,

        clientId:
          `thermaguard-fe-${Math.random()
            .toString(16)
            .slice(2)}`,

        clean: true,

        reconnectPeriod:
          5000,

        connectTimeout:
          10000,
      });

    client.on(
      "connect",
      () => {
        console.log(
          "FE connected to MQTT",
        );

        client.subscribe(
          [
            temperatureTopic,
            humidityTopic,
          ],

          (error) => {
            if (error) {
              console.error(
                "MQTT subscribe error:",
                error,
              );
            }
          },
        );
      },
    );

    client.on(
      "message",
      (
        topic,
        payload,
      ) => {
        const value =
          Number(
            payload
              .toString()
              .trim(),
          );

        if (
          !Number.isFinite(value)
        ) {
          return;
        }

        /*
         * Temperature tới
         * → update temperature NGAY.
         * → giữ humidity hiện tại.
         */
        if (
          topic ===
          temperatureTopic
        ) {
          temperatureRef.current =
            value;

          queryClient.setQueryData(
            QUERY_KEYS
              .currentTemperature,

            (oldData: any) => ({
              ...oldData,

              id:
                `mqtt-${Date.now()}`,

              timestamp:
                new Date()
                  .toISOString(),

              temperature:
                value,

              humidity:
                humidityRef.current ??
                oldData?.humidity ??
                0,
            }),
          );

          return;
        }

        /*
         * Humidity tới
         * → update humidity NGAY.
         * → giữ temperature hiện tại.
         */
        if (
          topic ===
          humidityTopic
        ) {
          humidityRef.current =
            value;

          queryClient.setQueryData(
            QUERY_KEYS
              .currentTemperature,

            (oldData: any) => ({
              ...oldData,

              id:
                `mqtt-${Date.now()}`,

              timestamp:
                new Date()
                  .toISOString(),

              temperature:
                temperatureRef.current ??
                oldData?.temperature ??
                0,

              humidity:
                value,
            }),
          );
        }
      },
    );

    client.on(
      "reconnect",
      () => {
        console.log(
          "MQTT reconnecting...",
        );
      },
    );

    client.on(
      "error",
      (error) => {
        console.error(
          "MQTT connection error:",
          error,
        );
      },
    );

    return () => {
      client.end(true);
    };
  }, [
    enabled,
    queryClient,
  ]);
}