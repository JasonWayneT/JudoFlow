---
title: "JudoFlow"
description: "A React Native training companion for judo — record a session, get a transcription, and review coaching cues with terminology surfaced from the built-in glossary."
author: "Jason Taylor"
role: "Product Manager"
status: "in-progress"
ai_role: "code generation for React Native components and transcription integration under Jason's direction"
tech_stack: ["React Native", "TypeScript", "Expo", "React Navigation", "React Native Paper"]
pm_skills: ["product definition", "mobile UX design", "prototype development", "user research"]
keywords: ["judo", "training companion", "React Native", "Expo", "transcription", "sports app", "martial arts"]
date_completed: ""
---

# JudoFlow

> A React Native training companion for judo. Record a session, get a transcription, and review it with coaching terminology automatically surfaced from the built-in glossary.

---

## What This Is

JudoFlow is a training companion for judo practitioners. You record a session, the app transcribes it, and you can review it afterward with terminology surfaced from the built-in glossary. The goal is to make it easier to capture coaching cues, sparring notes, and technique breakdowns without interrupting training.

**My role:** Problem definition, product requirements, UX architecture (three-screen flow), glossary design, development.
**AI's role:** Code generation for React Native components and transcription integration under my direction.

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

## Challenges & Decisions

### Audio-only, no video
**Problem:** Capturing a judo session in full fidelity (video + audio) is technically possible but creates friction — you need a stand, a recording angle, storage for large files, and players that handle the format.
**Decision:** Audio only. The coaching cues, technique names, and sparring notes are verbal. Everything meaningful in a judo session is said out loud.
**Tradeoff:** No visual record of techniques. Useful for coaching language capture, not for form review.
**Outcome:** Simpler recording flow, smaller storage footprint, and faster review. The constraint made the product more focused.

### Expo over bare React Native
**Problem:** Building a native app from scratch requires a full Xcode/Android Studio setup. For a prototype validating whether the recording + transcription + glossary flow works, that overhead slows iteration.
**Decision:** Expo. Faster iteration cycle, QR-code testing on physical device without a full build step.
**Tradeoff:** Some native APIs are harder to access. Expo's managed workflow limits certain audio recording configurations.
**Outcome:** Got to a working prototype faster. The tradeoff is acceptable at this stage — bare workflow is available if native API access becomes necessary.

---

## How This Was Built

Personal project built to solve a real training problem. Judo coaching cues are hard to remember and even harder to capture mid-session. I started with the recording flow, then added transcription and the glossary as supporting layers. Expo kept the iteration cycle fast without a full native build setup.

---

## License

MIT
