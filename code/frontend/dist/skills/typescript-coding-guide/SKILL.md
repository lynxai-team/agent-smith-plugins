---
name: typescript-coding-guide
description: TypeScript coding style guide and patterns — naming conventions, file organization, interface vs type selection, import/export patterns, error handling, async and streaming patterns, factory functions (useXxx), reactive state management. Use when writing or reviewing TypeScript code.
---

# TypeScript Coding Patterns — Generic Style Guide

> A compact, project-agnostic reference for the main coding patterns to follow when writing and reviewing TypeScript.
>
> **Scope:** code patterns only — naming, file organization, types, imports/exports, error handling, async, composition idioms. Build tooling and configuration are intentionally out of scope.

---

## 1. Naming Conventions

- **Variables, functions, constants: camelCase.** Constants are conventionally `camelCase` (not `UPPER_SNAKE`) in frontend-influenced codebases — pick one rule and stay consistent.
- **Classes, interfaces, types, components: PascalCase.**
- **Files:** kebab-case or camelCase `.ts`; **directories:** lowercase.

**Semantic type suffixes** communicate a type's role at a glance:

| Suffix | Meaning | Example |
|--------|---------|---------|
| `Spec` | Declarative definition | `AgentSpec`, `ToolSpec` |
| `Params` | Constructor / invocation input | `AgentParams`, `ServerParams` |
| `Callbacks` | Event hooks | `InferenceCallbacks` |
| `Options` | Runtime option bag | `InferenceOptions` |
| `Def` | Variable / definition shape | `VariableDef` |

**Prefix disambiguation** for related-but-distinct types — keep this discipline:
- `ConfInferenceBackend` (config-file shape) vs `InferenceBackend` (runtime shape).
- `HistoryTurn` vs `UiHistoryTurn` (UI metadata) vs `ChatCompletionHistoryTurn` (OpenAI-compatible external API shape).

**Domain-verb function names** drive naming in runtime code: `readFeature`, `upsertBackends`, `convertToolCallSpec`, `buildMessagesHistory`.

**Conventional prefixes/suffixes that mean something specific:**
- `use*` = composable factory returning state + methods (`useSmem`, `useWsServer`) — see [Factory Functions](#factory-functions-usexxx).
- `init*` = initializers for commands/state.
- `*Cmd` = orchestration wrapper that ties together lower-level steps (`updateConfCmd`).
- `*Raw` = variant that skips auto-processing (`addRaw` / `upsertRaw`).
- `*Sync` = await-completion variant of a fire-and-forget method (`executeAgentSync`).
- `_` prefix = private helper (`_extractToolDoc`, `_assertDbIsConnected`).

---

## 2. File Organization

**One concern per file.** This is the single most pervasive rule.

- Group files by role into focused subdirectories: `db/`, `state/`, `actions/`, `services/`, `utils/`.
- **Single barrel** (`main.ts` / `index.ts`) aggregates the public API — type-only re-exports for pure-type packages, namespace objects otherwise:
  ```typescript
  const db = { init: initDb, ...dbWrite, ...dbRead };
  export { db, conf, state, executeAction };
  ```
- **Leaf types package:** put shared contracts in one package that is *pure types* (zero runtime). Everything else depends on it via `import type`.
- **Shared state** lives in a single module (`state.ts`) exported as live bindings.

---

## 3. Type Selection & Usage

- **`interface` for object shapes** — extendable, multiple-extended:
  ```typescript
  interface AllCallbacks extends InferenceCallbacks, AgentCallbacks {}
  ```
- **`type` for unions, function types, intersections, mapped types:**
  ```typescript
  type InputMode = "manual" | "promptfile" | "clipboard";
  type FeatureExecutor<I = any, O = any> = (params: I, options: Record<string, any>) => Promise<O>;
  ```
- **Literal-union `type`s act as enums** — prefer them plus `switch` dispatch over `satisfies` / `as const` (which stay rare).
- **Generics bounded by `Record<string, any>`** for open data services:
  ```typescript
  const useNode = <T extends Record<string, any> = Record<string, any>>(...): Node<T> => { ... };
  set: <T extends keyof S>(k: T, v: S[T]) => Promise<void>;   // type-safe key→value inference
  ```
- **`Record<string, any>`** is the pragmatic "open object" for dynamic config/args flowing from a runtime.
- **Index signatures** for dynamic maps with known keys:
  ```typescript
  interface BackendEntries { default: string; [key: string]: ConfBackend | string; }
  ```
- **Optional everywhere (`?`)** keeps definitions lenient for config/YAML-derived data.
- **`implements`** when a class provides the runtime implementation of a shared contract: `class Lm implements LmProvider {}`.

---

## 4. Import & Export Patterns

- **Bottom-of-file `export { ... }` blocks**, not inline exports:
  ```typescript
  interface ToolSpec { ... }
  export { ToolCallSpec, ToolDefSpec, ToolSpec };
  ```
- **`.js` extensions on relative imports** (required under `nodenext` / `node16` resolution) — even when importing a `.ts` file:
  ```typescript
  import { state } from './state.js';
  import type { ToolSpec } from "shared-types-package";
  ```
- **`import type` for all type-only imports** — zero runtime footprint, satisfies `isolatedModules`.
- **Import order:** third-party (alphabetical) → relative (grouped by directory) → globals/polyfills.
- **Default imports** for namespace-style or colliding names: `import DatabaseConstructor from "better-sqlite3"`.
- **Dynamic `import()`** to load modules by path/URL at runtime.
- **Star imports + spread** to compose a namespace object:
  ```typescript
  import * as dbw from "./db/write.js";
  const db = { ...dbw };
  ```

---

## 5. Error Handling

Layer-specific, but the idioms are consistent.

**Backend / runtime:**
- **Throw descriptive `Error`s with template strings** for concrete failures:
  ```typescript
  throw new Error(`Unknown resource ${id} referenced (available: ${names})`);
  ```
- **Fail-fast validation** at entry points: `if (!found) throw new Error(...)`.
- **Custom message helpers** for user-facing fatal conditions (emoji + color), calling `exit(1)` where appropriate.
- **Explicit HTTP status discipline:** every branch sets the status code; errors are JSON bodies.
- **`try/finally` for resource cleanup** — always close connections even on error:
  ```typescript
  try { return executeQueries(db, query); } finally { db.close(); }
  ```

**Frontend:**
- **Centralized notification service** wrapping toasts/confirmations: `msg.error("Can not load models", "Check your backend server")`.
- **try/catch around async init** degrades gracefully — surface via toast rather than crashing.

**Layer-agnostic:**
- **`{ ok, msg }` result objects for soft errors** where the consumer is another program — return the message instead of throwing.
- **Check every remote call:** `if (!res.ok) throw new Error(...)`.

---

## 6. Async Patterns

- **Prefer synchronous libraries where possible** (e.g., sync SQLite) — fewer awaits, simpler code.
- **Streaming-first over SSE/WebSocket:** `fetch` + `response.body.getReader()` loop feeding a parser, fanning tokens to callbacks.
- **Recursive async loops** for multi-step execution: call `await this._run(it + 1, ...)` when work remains.
- **`AbortController` threaded through providers** for cancellation; poll `signal.aborted` in long-running services.
- **Callback-driven streaming:** a single "hook bag" object (`onToken`, `onToolCall`, `onTurnEnd`, `onError`) is the uniform streaming surface — fired in-process, re-emitted as typed messages over the wire (decoded with a discriminated-union `switch` on message type).
- **Debounced/batched processing of streamed data** — buffer tokens and parse on a ~50 ms schedule to avoid per-token re-renders.
- **`Promise.all` for parallel init loads**; microtask/`nextTick` to reset state after rendering.
- **Uniform async surface:** make every public operation `async` even when its body is synchronous — so callers can uniformly `await` it.
- **Auto-reconnect with linear backoff** for WebSocket clients (e.g., 1 s → +500 ms per retry, capped at 5 s).

---

## 7. Cross-Cutting Patterns

### Factory Functions (`useXxx`)

The preferred composition style for stateful services: a **factory returning an interface** (not a class), with the implementation hidden behind a sibling `*interfaces.ts`. Use a **class** only when there's rich, mutating, multi-method runtime state.

```typescript
const useSmem = (isVerbose = false): Smem => { ... };
const useTmem = <S extends Record<string, any> = Record<string, any>>(name, initial): Tmem<S> => { ... };
```

### Reactive State Management

For frontends (and even Node via `@vue/reactivity`), **module-level `ref` / `reactive` singletons exported as live bindings** — not a heavy store framework:

```typescript
const inputMode = ref<InputMode>("manual");
const state = reactive<AgentState>({ isReady: false, models: {} });
```

- Consume by importing the live binding directly.
- **`toRaw()`** unwraps refs at the boundary with external libraries.

### Async Confirmation (`createAwaiter<T>()`)

A **promise-based human-in-the-loop gate** bridging fire-and-forget streaming into an awaitable promise:

```typescript
function createAwaiter<T>() {
    let resolveFn: (value: T) => void;
    let rejectFn: (reason?: any) => void;
    const promise = new Promise<T>((resolve, reject) => { resolveFn = resolve; rejectFn = reject; });
    return { promise, resolve: resolveFn!, reject: rejectFn! };
}
```

Use it to gate readiness or await an external confirmation (e.g., user approval). Keep **one shared implementation** — don't duplicate the helper per module.

---

## 8. Do's and Don'ts

### Do
- Consume shared contracts from the leaf types package via `import type`.
- Use `interface` for object shapes, `type` for unions/functions; keep the suffix vocabulary (`Spec` / `Params` / `Callbacks` / `Options`).
- Use `useXxx` factories for stateful services; classes only for rich mutating state.
- Export with bottom-of-file `export { ... }` blocks; use `.js` extensions on relative imports.
- Throw descriptive template-string `Error`s; use `{ ok, msg }` result objects for machine-facing soft errors.
- Wrap resource usage in `try/finally`; keep write paths defensively isolated (readonly connections, confirmation gates).

### Don't
- Don't mix ESM and CommonJS — pick pure ESM (`"type": "module"`).
- Don't re-declare types that live in the shared types package — import them.
- Don't use `any` carelessly: expect it at dynamic `args` / `options` boundaries (`Record<string, any>`); prefer `unknown` + narrowing when you can.
- Don't throw from functions whose output is consumed by another program — return an error string/result instead.
- Don't leave commented-out scratch `console.log` blocks in committed source.
