import api from "@/lib/api";
import type { AlertItem } from "@/lib/types";
import { IPagination } from "@/types/api";

export const alertService = {
  getAlerts: async (): Promise<IPagination<AlertItem>> => {
    const response = await api.get(`/alerts`)
    return response.data
  },
  resolveAlert: async (alertId: string, email: string) => {
    const response = await api.patch(`/alerts/${alertId}/resolve`, { email })
    return response.data
  }
}

// import {
//   API_BASE_URL,
//   ApiError,
// } from "./api";

// import type {
//   AlertItem,
// } from "@/lib/types";

// import type {
//   IPagination,
// } from "@/types/api";

// export const alertService = {
//   getAlerts:
//     async (): Promise<
//       IPagination<AlertItem>
//     > => {
//       const response = await fetch(
//         `${API_BASE_URL}/alerts`,
//       );

//       if (!response.ok) {
//         throw new ApiError(
//           "Could not load alerts",
//           response.status,
//         );
//       }

//       return response.json();
//     },

//   resolveAlert:
//     async (
//       alertId: string,
//       email: string,
//     ) => {
//       const response = await fetch(
//         `${API_BASE_URL}/alerts/${alertId}/resolve`,
//         {
//           method: "PATCH",

//           headers: {
//             "Content-Type":
//               "application/json",
//           },

//           body: JSON.stringify({
//             email,
//           }),
//         },
//       );

//       if (!response.ok) {
//         throw new ApiError(
//           "Could not resolve alert",
//           response.status,
//         );
//       }

//       return response.json();
//     },
// };