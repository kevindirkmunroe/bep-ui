# Airhorn.events: A Practical Implementation of Event Distribution Automation Architecture

**Version:** 0.2 (Skeleton)  
**Status:** Draft  

---

## 1. System Overview

This document defines the hybrid architecture for automating multi-platform event distribution. The system pairs a **Service API** (for deterministic database access and state management) with a **Chrome Extension** (for browser-based UI automation and Human-in-the-Loop verification).

### High-Level Data Flow

```text
[Database] <---> [Service API / Tool Layer]
                        ^
                        | (Fetch Event & Update Status)
                        v
        [Agentic Orchestrator / Service Worker]
                        |
                        v (For each Platform 1..N)
            [Content Script (DOM Injection)]
                        |
                        v
        [Human-in-the-Loop (CAPTCHA & Submit)]
                        |
                        v
      [Network / URL Completion Listener] ---> (Loop Next Platform)
```

---

## 2. Architectural & Orchestration Patterns

### 2.1 Agentic Workflow / Orchestrator
* **Role:** High-level controller managing the sequential loop across $N$ target third-party platforms.
* **Responsibilities:**
  * Fetch target event payload and platform queue from the Service API.
  * Coordinate tab lifecycle (open, focus, close/advance) per platform.
  * Handle errors, retries, and skip conditions.
* **Implementation Details:**
  * *Location:* `[TBD: Chrome Extension Background Service Worker / Local Agent]`
  * *Queue Execution Strategy:* `[TBD: Sequential single-tab vs. pre-loaded tabs]`

### 2.2 Finite State Machine (FSM)
Tracks the lifecycle of each `(event_id, platform_id)` pair to ensure predictable state transitions.

| State | Description | Trigger to Exit | Next State |
| :--- | :--- | :--- | :--- |
| `PENDING` | Event queued for platform; tab not yet opened. | Orchestrator starts platform task. | `IN_PROGRESS` |
| `IN_PROGRESS` | Platform form opened; Content Script injecting DOM fields. | DOM injection completes without error. | `AWAITING_HUMAN` |
| `AWAITING_HUMAN` | Form populated; waiting for human CAPTCHA & Submit. | Completion listener detects successful POST/redirect. | `SUBMITTED` |
| `SUBMITTED` | Platform confirmed event creation. | Orchestrator advances loop to `Platform N+1`. | *(Terminal)* |
| `FAILED / SKIPPED` | Unrecoverable DOM error or manual human skip. | Human intervention or retry policy. | `PENDING` / *(Terminal)* |

* **Implementation Details:**
  * *State Persistence:* `[TBD: Backend DB table vs. chrome.storage.local]`

### 2.3 Human-in-the-Loop (HITL)
* **Pause Triggers:**
  * CAPTCHA / anti-bot verification challenges.
  * Subjective field validation (e.g., category edge cases, image cropping).
  * Final `Submit` button click.
* **Operator UX:**
  * `[TBD: Floating status overlay / Chrome Extension Side Panel instructions]`

---

## 3. Data & Integration Layer

### 3.1 Tool Calling & Service API
Exposes structured endpoints for the orchestrator to read event data and report progress.

* `GET /api/events/{event_id}`
  * **Purpose:** Retrieve canonical event data and list of target platforms.
  * **Payload Schema:** `[TBD]`
* `PATCH /api/events/{event_id}/platforms/{platform_id}`
  * **Purpose:** Update FSM state (`AWAITING_HUMAN`, `SUBMITTED`, `FAILED`) and log external listing URL.
  * **Payload Schema:** `[TBD]`

### 3.2 Schema Mapping / Semantic Mapping
Translates canonical database attributes into third-party platform form schemas.

| Canonical DB Field | Transformation / Mapping Rule | AI / LLM Assisted? |
| :--- | :--- | :--- |
| `title` | Direct string injection | No |
| `start_datetime` | Format per platform locale/timezone (`YYYY-MM-DD`, `HH:mm`) | `[TBD]` |
| `description` | HTML vs. Plaintext stripping / truncation | `[TBD]` |
| `category` | Map internal tag to platform dropdown enum | `[TBD: Yes, via LLM classification]` |

### 3.3 Idempotency & Duplicate Prevention
* **Idempotency Key:** `{event_id}:{platform_id}`
* **Safeguards:**
  * Check platform status via `GET` before opening a tab to prevent double-posting if the browser restarts.
  * `[TBD: Duplicate check against existing platform listings]`

---

## 4. Browser & UI Automation Layer

### 4.1 Background Service Worker & Content Scripts
* **Background Service Worker:**
  * Holds global FSM state and communicates with the Service API.
  * Manages `chrome.tabs` creation, activation, and messaging.
* **Content Scripts:**
  * Injected into matched third-party platform URLs.
  * Executes DOM queries and dispatches input events (`input`, `change`, `blur`).
* **Message Passing Contract:**
  * `[TBD: Define JSON message types e.g., FILL_FORM, FORM_READY, SUBMISSION_DETECTED]`

### 4.2 DOM Injection / Programmatic Form Filling
* **Selector Strategy:** `[TBD: CSS selectors, XPath, ARIA labels, or AI-assisted DOM healing]`
* **Framework Compatibility:** `[TBD: Handling React/Vue controlled inputs via native value setters]`

### 4.3 Event Listener / Network Interceptor
Detects when the human finishes verification and submits the third-party form.

* **Detection Mechanisms (Per Platform):**
  1. **URL Navigation Match:** `chrome.tabs.onUpdated` matching confirmation URL patterns (e.g., `*/events/*/published`).
  2. **Network Interception:** `chrome.webRequest` / `declarativeNetRequest` monitoring HTTP `200/201` responses on submission endpoints.
  3. **DOM Mutation Observer:** Watching for success toast notifications or confirmation banners.

---

## 5. Security, Guardrails & Error Handling

* **Authentication:** `[TBD: API key / OAuth token storage in extension]`
* **Human Override Controls:** Pause loop, skip current platform, or abort batch.
* **Audit Logging:** Record timestamp, operator ID, and target URL per submission.

---

## 6. Implementation Roadmap

- [ ] **Phase 1:** Define canonical Event JSON schema and Service API endpoints.
- [ ] **Phase 2:** Implement FSM state persistence and idempotency checks.
- [ ] **Phase 3:** Build Background Service Worker tab-loop orchestrator.
- [ ] **Phase 4:** Standardize Content Script injection interface across $N$ platforms.
- [ ] **Phase 5:** Implement completion listeners and HITL overlay UI.
