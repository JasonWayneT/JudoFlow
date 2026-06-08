# JudoFlow

> A React Native mobile app for recording, transcribing, and reviewing judo training sessions — with a built-in glossary of terminology.

---

## What This Is

JudoFlow is a training companion for judo practitioners. You record a session, the app transcribes it, and you can review it afterward with terminology surfaced from the built-in glossary. The goal is to make it easier to capture coaching cues, sparring notes, and technique breakdowns without interrupting training.

**What this is not:**
- A video recording app — audio only
- A finished product — early prototype, not on the App Store

---

## Status

| Field | Value |
|---|---|
| **Phase** | Prototype |
| **Stability** | Experimental — in early development |
| **Last updated** | March 2026 |

---

## Running Locally

### Requirements

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator or Android Emulator, or the Expo Go app on a physical device

### Setup

```bash
git clone https://github.com/JasonWayneT/JudoFlow.git
cd JudoFlow
npm install
npx expo start
```

Scan the QR code with Expo Go, or press `i` for iOS simulator / `a` for Android emulator.

---

## Core Screens

| Screen | Purpose |
|---|---|
| Home | Session log — view past recordings |
| Recording | Record a training session with audio |
| Review | Playback, transcription, and glossary lookup |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native (Expo) |
| Language | TypeScript |
| Navigation | React Navigation (native stack) |
| UI | React Native Paper |
| Storage | Local device storage |

---

## How This Was Built

Personal project built to solve a real training problem — judo coaching cues are hard to remember and even harder to capture mid-session. Started with the recording flow first, then added transcription and the glossary as supporting layers. Built with Expo to keep the iteration cycle fast without a full native build setup.

---

## License

MIT
