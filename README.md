# JDS (Jenan Distribution System)

A mobile-first web app for in-store surveys. A field user opens the app, their GPS location is matched against a list of stores, and once they are at a known store they answer a questionnaire grouped by category, optionally attaching photos. Admin pages manage the stores, categories and questions stored in MongoDB.

> Prototype built in 2018. Not actively maintained; dependencies (Next.js 7, React 16, MongoDB driver 3) are outdated.

## Features

- Geolocation check: asks for location permission and matches the user to a store whose coordinates are within a small tolerance; shows a static map if no store matches
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

The client uses the base URL in `pages/Config.js` (`http://localhost:3000`). The static map image uses the Google Static Maps API; the key in `pages/Geolocation.js` is a placeholder and must be replaced to show maps.

## Project layout

```
server.js            Express server: sessions, /api/:service, /upload, Next.js handler
api/database.js      MongoDB CRUD handler
api/images.js        lists uploaded JPEG files
pages/               Next.js pages and components (survey, admin forms, image upload)
static/image/storage uploaded images (git-ignored)
```
