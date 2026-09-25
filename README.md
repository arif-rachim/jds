# JDS (Jenan Distribution System)

JDS (Jenan Distribution System) is a mobile-first web app for running in-store surveys. A field user opens the app on a phone, the browser's Geolocation API reports their position, and the app compares it with the coordinates of the stores saved in MongoDB. Once the user is at a known store, they work through a questionnaire grouped by category, answering Yes/No or free-text questions and attaching photos where a question requires one. Answers are kept per store and question in the browser's `localStorage`, and photos are resized to JPEG in the browser and uploaded to the server. Separate admin pages let a supervisor manage the stores, categories and questions. The app is built with Next.js 7 and React 16 on the front end and a custom Express 4 server that exposes a generic MongoDB CRUD endpoint and a Multer upload route.

> Prototype built in 2018. Not actively maintained; dependencies (Next.js 7, React 16, MongoDB driver 3) are outdated.

## Features

- Geolocation check: asks for location permission and matches the user to a store whose latitude and longitude are both within 0.1% of the GPS position; shows a static map if no store matches
- Questionnaire (`/`): questions grouped by category, with Yes/No or free-text answers
- Answers saved per store and question in the browser's `localStorage`
- Photo upload per question: images are resized client-side to JPEG and posted to `/upload`, which stores them in `static/image/storage`
- Admin forms: `/StoreForm` (name and "lat,lon"), `/CategoryForm`, `/QuestionerForm` (category, question text, answer type, image-required flag)
- Generic CRUD endpoint `/api/database?c=<Collection>&a=create|read|update|delete` backed by MongoDB

## Tech stack

Next.js 7 · React 16 · Express 4 · MongoDB · Multer · cookie-session · Bootstrap 4 (CDN)

## Getting started

Requirements: Node.js and a MongoDB server on `localhost:27017` (database `jds`, hardcoded in `api/database.js`).

```bash
npm install
npm run dev     # starts the custom Express + Next.js server on http://localhost:3000
```

Production build:

```bash
npm run build
npm start       # note: "next start" does not run server.js, so the /api and /upload routes are not served
```

The client uses the base URL in `pages/Config.js` (`http://localhost:3000`). The static map image uses the Google Static Maps API with a key hardcoded in `pages/Geolocation.js` (variable `FAKE_KEY`); replace it with your own key.

## Project layout

```text
server.js            Express server: sessions, /api/:service, /upload, Next.js handler
api/database.js      MongoDB CRUD handler
api/images.js        lists uploaded JPEG files
pages/               Next.js pages and components (survey, admin forms, image upload)
static/image/storage uploaded images (git-ignored)
```

## Limitations

- No authentication: the admin pages and `/api/database` are open to anyone who can reach the server, and the endpoint accepts any collection name.
- The cookie-session key (`'123'`) and the MongoDB URL are hardcoded, and `server.js` sets `NODE_TLS_REJECT_UNAUTHORIZED=0`.
- `/upload` names the stored file from the `file` query parameter without validation.
- Survey answers stay in the browser's `localStorage`; they are not sent to the server.
