# NOT TODAY

## Product Requirements Document + Design System

---

# Overview

Not Today is a mobile-first web application designed to help users quit unwanted habits by reinforcing moments of resistance rather than tracking failures.

Instead of asking users to log relapses, the app rewards them whenever they successfully resist an urge.

The core interaction is intentionally simple:

A user experiences an urge → opens the app → taps a single button:

"I DID NOT DO IT"

The app then rewards that action through streak progression, positive reinforcement, achievements, and motivational messages.

The goal is to make discipline feel rewarding and satisfying in the exact moment temptation occurs.

---

# Vision

Help users build self-control one resisted urge at a time.

The product focuses on:

* Positive reinforcement
* Instant gratification for good decisions
* Minimal friction
* Mobile-first interactions
* Dopamine from streak building
* Zero shame or guilt

---

# Target Audience

## Primary Users

People attempting to quit:

* Pornography
* Masturbation
* Smoking
* Vaping
* Gambling
* Doomscrolling
* Excessive social media usage
* Nail biting
* Junk food addiction

## Secondary Users

Anyone trying to improve discipline and reduce impulsive behavior.

---

# Core Product Philosophy

Most habit trackers ask:

"Did you fail today?"

Not Today asks:

"Did you resist?"

The product celebrates wins rather than recording losses.

---

# User Flow

## Landing Page

Headline:

NOT TODAY.

Subheadline:

Every urge resisted is a win.

Primary CTA:

START STREAK

Secondary CTA:

LOGIN

---

## Authentication

Users can:

* Sign Up with Email
* Login with Email
* Login with Google

---

## Create Habit

After signup:

Prompt:

What are you trying to quit?

Examples:

* No Masturbation
* No Smoking
* No Gambling
* No Doomscrolling

User enters custom habit name.

---

## Dashboard

The dashboard contains only the most important information.

Displayed:

* Habit Name
* Current Streak
* Best Streak
* Main Action Button
* Motivational Quote
* Achievements

---

# Core Features

## Feature 1 — Resistance Button

Main CTA:

I DID NOT DO IT

Purpose:

When the user successfully resists an urge, they press the button.

System action:

* Increase streak
* Save timestamp
* Show animation
* Display motivational quote

---

## Feature 2 — Streak Tracking

Track:

* Current Streak
* Best Streak
* Total Resist Events

Example:

Current Streak: 37 Days

Best Streak: 81 Days

Resisted: 164 Times

---

## Feature 3 — Motivational Quotes

After every successful button press, display a random message.

Examples:

Bro just farmed self-control XP.

Future you is silently thanking you.

You beat the urge.

One urge lost. One legend created.

Main character energy.

Discipline is looking attractive today.

Small win. Massive impact.

Locked in.

---

## Feature 4 — Achievement System

Milestones:

Day 1
Started

Day 7
One Week Strong

Day 30
Locked In

Day 90
Mental Warrior

Day 180
Unshakeable

Day 365
Legend

Achievements are displayed as collectible cards.

---

## Feature 5 — Progress Calendar

Visual representation of successful days.

Green indicators represent completed resistance days.

Purpose:

Provide visual consistency tracking.

---

## Feature 6 — Emergency Mode

For moments of intense temptation.

Button:

I'M STRUGGLING

Emergency screen displays:

* Encouraging message
* Breathing exercise
* 10-minute timer
* Motivation quote

Example:

WAIT 10 MINUTES.

You don't need to win forever.

Just win the next 10 minutes.

---

## Feature 7 — Urge Journal (Optional)

Prompt:

What triggered this urge?

Common responses:

* Stress
* Loneliness
* Boredom
* Social Media

Purpose:

Help users identify triggers.

---

# Design System

## Design Style

Neubrutalism

Inspired by:

* Modern Neubrutalism
* Duolingo's motivational energy
* BeReal's simplicity
* Playful Gen-Z internet aesthetics

No gradients.

No glassmorphism.

No blurry shadows.

No dark corporate dashboards.

The interface should feel bold, energetic, playful, and memorable.

---

# Color Palette

## Primary Background

#FADF0C

Bright yellow used throughout the application.

---

## Card Background

#FFFFFF

Pure white.

---

## Primary Accent

#C7A4FF

Used for:

* Main buttons
* Highlights
* Call-to-actions

---

## Success Color

#7CFF7C

Used for:

* Streak celebrations
* Achievement unlocks
* Success indicators

---

## Border Color

#000000

Used everywhere.

---

# Neubrutalism Rules

## Borders

All components:

4px solid black

No soft borders.

---

## Shadows

Hard shadows only.

Example:

8px 8px 0px #000

No blur.

---

## Radius

20px border radius

Applied consistently.

---

# Typography

Primary Font:

Space Grotesk

Fallback:

General Sans

Weights:

700–900

Typography should feel confident and oversized.

---

# Dashboard Layout

Top Section:

Habit Name

Middle Section:

Large Streak Counter

Main Action Button

Motivation Card

Achievement Section

Everything centered vertically.

---

# Streak Counter Design

Large visual hierarchy.

Example:

37

DAYS

Font Size:

80–100px

Font Weight:

900

Purpose:

Make progress feel tangible.

---

# Main CTA Button

Text:

I DID NOT DO IT 💪

Design:

* Purple background
* Black border
* Hard shadow
* Large size
* Full width on mobile

Interaction:

On click:

* Button depress animation
* Small screen shake
* Confetti for milestones
* +1 animation

---

# Motivation Card

Example:

MAIN CHARACTER ENERGY.

or

Future you just got stronger.

Card style:

* White background
* Black border
* Hard shadow

---

# Achievement Cards

Example:

🏆

LOCKED IN

30 DAYS

Style:

* White card
* Thick border
* Hard shadow

---

# Microinteractions

## Button Press

Shadow reduces.

Button shifts slightly.

Feels physically pressed.

---

## Streak Increase

Animated:

+1 DAY

Appears above counter.

---

## Milestone Celebration

At:

* Day 7
* Day 30
* Day 90
* Day 365

Trigger:

* Confetti
* Achievement popup

---

# Mobile First Requirements

Primary viewport:

390px width

Optimized for:

* iPhone
* Android

Single-column layout.

One-handed usability.

---

# Technical Architecture

## Frontend

* Next.js
* TypeScript
* TailwindCSS
* ShadCN UI
* Framer Motion

---

## Backend

Supabase

Services:

* Authentication
* Database
* Storage
* Realtime

---

# Database Schema

## Users

id

email

password_hash

created_at

---

## Habits

id

user_id

habit_name

created_at

---

## Streaks

id

habit_id

current_streak

best_streak

total_resists

last_checkin

---

## Checkins

id

habit_id

created_at

note

---

# MVP Scope

Version 1 includes:

* Authentication
* Habit Creation
* Streak Tracking
* Resistance Button
* Motivational Quotes
* Achievement Badges
* Mobile Responsive UI
* Neubrutalist Design System

Everything else is excluded from the first release.

---

# Future Roadmap

## V2

Anonymous Community

Users share progress anonymously.

Examples:

Day 14.

Day 91.

Day 227.

---

## V3

AI Accountability Coach

Users can chat when experiencing urges.

---

## V4

Mobile Widget

Displays:

🔥 127 DAYS

KEEP GOING.

---

# Success Metric

Primary KPI:

Daily Resistance Actions

Secondary KPIs:

* Daily Active Users
* Average Streak Length
* Retention Rate
* Achievement Unlock Rate

The app succeeds when users repeatedly return during moments of temptation and reinforce positive decisions through streak-building behavior.
