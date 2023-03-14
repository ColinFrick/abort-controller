import {
    // Event,
    EventTarget,
    // Type,
    defineEventAttribute,
} from "event-target-shim"

// Known Limitation
//   Use `any` because the type of `AbortSignal` in `lib.dom.d.ts` is wrong and
//   to make assignable our `AbortSignal` into that.
//   https://github.com/Microsoft/TSJS-lib-generator/pull/623
type Events = {
    abort: any // Event & Type<"abort">
}
type EventAttributes = {
    onabort: any // Event & Type<"abort">
}

/**
 * The signal class.
 * @see https://dom.spec.whatwg.org/#abortsignal
 */
export default class AbortSignal extends EventTarget<Events, EventAttributes> {
    /**
     * AbortSignal cannot be constructed directly.
     */
    public constructor() {
        super()
        throw new TypeError("AbortSignal cannot be constructed directly")
    }

    /**
     * Returns `true` if this `AbortSignal`'s `AbortController` has signaled to abort, and `false` otherwise.
     */
    public get aborted(): boolean {
        const aborted = abortedFlags.get(this)
        if (typeof aborted !== "boolean") {
            throw new TypeError(
                `Expected 'this' to be an 'AbortSignal' object, but got ${
                    this === null ? "null" : typeof this
                }`,
            )
        }
        return aborted
    }

    /**
     * Returns the reason this signal was aborted, if any.
     */
    public get reason(): any {
        return reasons.get(this)
    }

    /**
     * Throws the signal's reason if the signal has been aborted.
     */
    public throwIfAborted(): void {
        if (this.aborted) {
            throw this.reason
        }
    }
}
defineEventAttribute(AbortSignal.prototype, "abort")

/**
 * Create an AbortSignal object.
 */
export function createAbortSignal(): AbortSignal {
    const signal = Object.create(AbortSignal.prototype)
    EventTarget.call(signal)
    abortedFlags.set(signal, false)
    reasons.set(signal, undefined)
    return signal
}

/**
 * Abort a given signal.
 */
export function abortSignal(signal: AbortSignal, reason?: any): void {
    if (abortedFlags.get(signal) !== false) {
        return
    }

    abortedFlags.set(signal, true)
    reasons.set(signal, reason || new Error("AbortError"))
    signal.dispatchEvent<"abort">({ type: "abort" })
}

/**
 * Aborted flag for each instances.
 */
const abortedFlags = new WeakMap<AbortSignal, boolean>()

/**
 * Reason for each instances.
 */
const reasons = new WeakMap<AbortSignal, any>()

// Properties should be enumerable.
Object.defineProperties(AbortSignal.prototype, {
    aborted: { enumerable: true },
    reason: { enumerable: true },
})

// `toString()` should return `"[object AbortSignal]"`
if (typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol") {
    Object.defineProperty(AbortSignal.prototype, Symbol.toStringTag, {
        configurable: true,
        value: "AbortSignal",
    })
}
