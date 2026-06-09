---
title: JudoFlow Product Brief
status: draft
created: 2026-06-08
updated: 2026-06-08
---

# JudoFlow

> A React Native mobile app for recording, transcribing, and reviewing judo training sessions — with a built-in terminology glossary so coaching cues don't get lost on the mat.

---

## Executive Summary

JudoFlow is a personal training companion app for judo practitioners. The problem it solves is specific: coaching cues and technique notes are hard to capture mid-session without interrupting the flow of training. JudoFlow lets you record a session, get a transcription afterward, and review it with judo terminology surfaced from a built-in glossary.

This is a personal project built to scratch a real itch. It is an early prototype — functional, not App Store ready.

---

## The Problem

Judo training moves fast. A coach gives a cue about a technique, you're in the middle of a roll, and by the time practice ends you've forgotten half of what was said. Taking notes mid-session isn't practical. Asking the coach to repeat themselves breaks the flow.

Most athletes either rely on memory (lossy) or try to jot things down between rounds (impractical). There's no lightweight tool designed specifically for capturing and reviewing training session content in a combat sport context.

---

## The Solution

Three-screen mobile app:

- **Home** — Session log. View all past recordings with timestamps.
- **Recording** — Audio capture of a training session. One tap to start, one tap to stop.
- **Review** — Playback, transcription, and glossary lookup. Judo terminology in the transcription is surfaced and defined automatically from the built-in glossary.

Audio only — no video. The glossary (`judo_glossary.json`) covers standard terminology so coaching references to techniques and positions are identified and explained in context.

---

## Who This Serves

Judo practitioners — specifically intermediate-level athletes who are past the complete beginner stage and actively receiving coaching feedback they need to retain and study. The glossary feature is most useful for students still internalizing Japanese terminology.

---

## Current State

Early prototype. Core recording and review flow is functional. Transcription and glossary integration are built. Not on the App Store — runs locally via Expo Go.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native (Expo) |
| Language | TypeScript |
| Navigation | React Navigation |
| UI | React Native Paper |
| Storage | Local device storage |

---

## Scope

**In scope:**
- Audio session recording
- Transcription of session audio
- Glossary lookup against built-in judo terminology
- Local session log

**Out of scope:**
- Video recording
- Cloud sync or multi-device support
- Coach-facing features or shared sessions
- App Store distribution (current phase)
