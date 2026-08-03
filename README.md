# Cozy Comfort Monitor

Build a modern responsive web application for an IoT-based Smart Room Temperature Monitoring and Automatic Control System.

## Project Overview

The application monitors room temperature using IoT temperature sensors installed in rooms for vulnerable people such as children and elderly people.

The system automatically controls a cooling fan when the room temperature exceeds a configurable threshold and allows caregivers to monitor room conditions remotely.

The application should follow a clean dashboard style similar to modern IoT monitoring platforms.

--------------------------------------------------

FUNCTIONAL REQUIREMENTS

--------------------------------------------------

### Authentication

- Login page

- Logout

- Protected dashboard

- Remember login session

--------------------------------------------------

### Dashboard

Display:

- Current room temperature

- Current fan status (ON/OFF)

- Device online/offline status

- Last updated timestamp

Widgets:

- Temperature Card

- Fan Status Card

- Device Status Card

- Latest Alert Card

--------------------------------------------------

### Real-time Temperature Monitoring

Display:

- Current temperature

- Temperature trend chart

- Temperature history

Chart:

- Line chart

- Last 24 hours

- Last 7 days

- Custom date range

Allow refresh automatically every few seconds.

--------------------------------------------------

### Temperature Threshold Management

Allow user to configure:

- Minimum temperature

- Maximum temperature

Display:

Current Threshold

Example

Minimum:

20°C

Maximum:

30°C

Save button

--------------------------------------------------

### Automatic Fan Control

When temperature exceeds maximum threshold:

Display

Fan Status

ON

Reason

Temperature exceeded threshold

When temperature returns to safe range:

Display

Fan Status

OFF

Reason

Temperature normalized

--------------------------------------------------

### Manual Device Control

Allow user to manually:

- Turn fan ON

- Turn fan OFF

Show:

Current Status

Loading state while sending command

Success or error notification

--------------------------------------------------

### Alerts

Display notification when:

- Temperature exceeds threshold

- Device disconnected

- Sensor offline

Each alert contains:

- Time

- Severity

- Message

- Status

--------------------------------------------------

### Temperature History

Display table:

Columns

- Time

- Temperature

- Status

Allow:

- Search

- Filter

- Pagination

- Export CSV

--------------------------------------------------

### Activity Logs

Display logs for:

- Fan ON/OFF

- Threshold updated

- Login

- Alerts generated

Columns

- Timestamp

- User

- Action

- Result

--------------------------------------------------

### Device Status

Display:

Device Name

Connection Status

Last Seen

Firmware Version

Battery (optional)

--------------------------------------------------

NON-FUNCTIONAL REQUIREMENTS

- Responsive design

- Desktop first

- Tablet support

- Mobile support

- Modern dashboard UI

- Clean card layout

- Smooth animations

- Fast page loading

- Loading skeleton

- Empty state

- Error state

- Dark mode

- Light mode

- Accessibility friendly

- Reusable components

- TypeScript

- React

- Tailwind CSS

- shadcn/ui

--------------------------------------------------

DESIGN STYLE

Use a professional IoT dashboard.

Primary colors:

- Blue

- White

- Gray

Accent colors:

Green

Warning Orange

Danger Red

Use rounded cards.

Use charts.

Use icons from Lucide.

Spacing should be clean.

--------------------------------------------------

PAGES

1 Login

2 Dashboard

3 Temperature Monitoring

4 Temperature History

5 Device Control

6 Threshold Configuration

7 Alerts

8 Activity Logs

--------------------------------------------------

COMPONENTS

Navbar

Sidebar

Temperature Card

Fan Status Card

Alert Card

Device Card

Threshold Form

Temperature Chart

History Table

Activity Table

Toast Notification

Confirmation Dialog

Loading Skeleton

--------------------------------------------------

Generate production-ready React components with clean folder structure and reusable UI components.
Build this project as a frontend-only application.

Do NOT generate any backend.

The backend will be developed separately using NestJS REST APIs.

Use mock data and abstract all API calls behind service classes so the backend can be integrated later.

--------------------------------------------------

TECH STACK

--------------------------------------------------

- React 19

- TypeScript

- Vite

- TailwindCSS

- shadcn/ui

- React Router

- TanStack Query

- Zustand

- React Hook Form

- Zod

- Recharts

- Lucide Icons

--------------------------------------------------

PROJECT ARCHITECTURE

--------------------------------------------------

Follow Feature-based Architecture.

src/

    app/

        router.tsx

        providers.tsx

    layouts/

        DashboardLayout.tsx

        AuthLayout.tsx

    pages/

        Login

        Dashboard

        Monitoring

        History

        DeviceControl

        Threshold

        Alerts

        ActivityLogs

        NotFound

    features/

        auth/

            components/

            hooks/

            services/

            types/

        monitoring/

            components/

            hooks/

            services/

            types/

        devices/

            components/

            hooks/

            services/

            types/

        alerts/

            ...

        logs/

            ...

    components/

        common/

        cards/

        charts/

        tables/

        dialogs/

        forms/

    services/

        api.ts

        auth.service.ts

        monitoring.service.ts

        device.service.ts

        alert.service.ts

        log.service.ts

    hooks/

    stores/

        auth.store.ts

        theme.store.ts

    lib/

        constants.ts

        utils.ts

        mock-data.ts

--------------------------------------------------

ROUTING

--------------------------------------------------

/

→ Login

/dashboard

→ Dashboard

/monitoring

→ Real-time Temperature

/history

→ Temperature History

/device-control

→ Fan Control

/threshold

→ Threshold Configuration

/alerts

→ Alerts

/activity-logs

→ Activity Logs

--------------------------------------------------

STATE MANAGEMENT

--------------------------------------------------

Use Zustand for:

- Authentication

- Theme

- User preferences

Use TanStack Query for:

- Temperature data

- Device status

- History

- Alerts

- Activity Logs

--------------------------------------------------

API LAYER

--------------------------------------------------

Create service files only.

Example

monitoring.service.ts

export async function getCurrentTemperature()

export async function getTemperatureHistory()

device.service.ts

turnFanOn()

turnFanOff()

getDeviceStatus()

Use mocked Promise responses.

Do NOT hardcode API URLs inside components.

--------------------------------------------------

UI DESIGN

--------------------------------------------------

Professional IoT Dashboard

Sidebar navigation

Top navigation bar

Responsive

Desktop first

Tablet support

Mobile support

Use reusable components.

--------------------------------------------------

COMMON COMPONENTS

TemperatureCard

DeviceStatusCard

FanStatusCard

AlertCard

StatisticCard

TemperatureChart

HistoryTable

ActivityTable

ThresholdForm

LoadingSkeleton

EmptyState

ErrorState

ConfirmationDialog

Toast

--------------------------------------------------

DESIGN SYSTEM

Rounded cards

Soft shadow

8px spacing system

Primary

Blue

Success

Green

Warning

Orange

Danger

Red

Support both

Light Mode

Dark Mode

--------------------------------------------------

FORM VALIDATION

Use React Hook Form + Zod.

Validate:

Login

Threshold Configuration

Manual Fan Control

--------------------------------------------------

ERROR HANDLING

Loading states

Error states

Retry buttons

Empty states

Toast notifications

--------------------------------------------------

MOCK DATA

Generate realistic mock data for:

Temperature

Fan status

Alerts

Logs

History

Device status

--------------------------------------------------

CODE QUALITY

Use reusable components.

Avoid duplicated code.

Use TypeScript interfaces.

Use custom hooks.

Keep business logic outside UI components.

Keep components small.

Follow clean architecture and best React practices.

The project must be easy to integrate with a NestJS REST API in the future by replacing only the service layer.
Prepare the frontend for future integration with NestJS.

All business logic must be isolated from UI.

Every page must consume data through service functions or custom hooks instead of directly calling fetch.

Avoid coupling UI components with API implementation.

The only files that should need modification when integrating the NestJS backend are the files inside the services/ directory.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://room-comfort-keeper.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/79357be2-74fc-48f3-80e7-788a7c5bebca).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
