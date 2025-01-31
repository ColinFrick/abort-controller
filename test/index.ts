/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * See LICENSE file in root directory for full license.
 */
import { assert } from "chai"
import { AbortController, AbortSignal } from "../src/abort-controller"
import { spy } from "@mysticatea/spy"

/*globals EventTarget */
const HAS_EVENT_TARGET_INTERFACE = typeof EventTarget !== "undefined"
const SUPPORTS_TOSTRINGTAG =
    typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol"

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("AbortController", () => {
    let controller: AbortController

    beforeEach(() => {
        controller = new AbortController()
    })

    it("should not be callable", () => {
        assert.throws(() => (AbortController as any)(), TypeError)
    })

    it("should have 2 properties", () => {
        // IE does not support Set constructor.
        const keys = new Set()
        keys.add("signal")
        keys.add("abort")

        for (const key in controller) {
            assert(keys.has(key), `'${key}' found, but should not have it`)
            keys.delete(key)
        }

        keys.forEach(key => {
            assert(false, `'${key}' not found`)
        })
    })

    //
    ;(SUPPORTS_TOSTRINGTAG ? it : xit)(
        "should be stringified as [object AbortController]",
        () => {
            assert(controller.toString() === "[object AbortController]")
        },
    )

    describe("'signal' property", () => {
        let signal: AbortSignal

        beforeEach(() => {
            signal = controller.signal
        })

        it("should return the same instance always", () => {
            assert(signal === controller.signal)
        })

        it("should be a AbortSignal object", () => {
            assert(signal instanceof AbortSignal)
        })
        ;(HAS_EVENT_TARGET_INTERFACE ? it : xit)(
            "should be a EventTarget object",
            () => {
                assert(signal instanceof EventTarget)
            },
        )

        it("should have 6 properties", () => {
            // IE does not support Set constructor.
            const keys = new Set()
            keys.add("addEventListener")
            keys.add("removeEventListener")
            keys.add("dispatchEvent")
            keys.add("aborted")
            keys.add("onabort")
            keys.add("reason")

            for (const key in signal) {
                assert(keys.has(key), `'${key}' found, but should not have it`)
                keys.delete(key)
            }

            keys.forEach(key => {
                assert(false, `'${key}' not found`)
            })
        })

        it("should have 'aborted' property which is false by default", () => {
            assert(signal.aborted === false)
        })

        it("should have 'reason' property which is undefined by default", () => {
            assert(signal.reason === undefined)
        })

        it("should have 'onabort' property which is null by default", () => {
            assert(signal.onabort === null)
        })

        it("should throw a TypeError if 'signal.aborted' getter is called with non AbortSignal object", () => {
            const getAborted = Object.getOwnPropertyDescriptor(
                (signal as any).__proto__,
                "aborted",
            )!.get
            assert.throws(() => getAborted!.call({}), TypeError)
        })
        ;(SUPPORTS_TOSTRINGTAG ? it : xit)(
            "should be stringified as [object AbortSignal]",
            () => {
                assert(signal.toString() === "[object AbortSignal]")
            },
        )
    })

    describe("'abort' method", () => {
        it("should set true to 'signal.aborted' property", () => {
            controller.abort()
            assert(controller.signal.aborted)
        })

        it("should fire 'abort' event on 'signal' (addEventListener)", () => {
            const listener = spy()
            controller.signal.addEventListener("abort", listener)
            controller.abort()

            assert(listener.calls.length === 1)
        })

        it("should fire 'abort' event on 'signal' (onabort)", () => {
            const listener = spy()
            controller.signal.onabort = listener
            controller.abort()

            assert(listener.calls.length === 1)
        })

        it("should not fire 'abort' event twice", () => {
            const listener = spy()
            controller.signal.addEventListener("abort", listener)
            controller.abort()
            controller.abort()
            controller.abort()

            assert(listener.calls.length === 1)
        })

        it("should throw a TypeError if 'this' is not an AbortController object", () => {
            assert.throws(() => controller.abort.call({}), TypeError)
        })

        it("should set a default reason to 'signal.reason' property", () => {
            controller.abort()
            assert(controller.signal.reason instanceof Error)
        })

        it("should set provided reason to 'signal.reason' property", () => {
            const error = new Error("reason")
            controller.abort(error)
            assert(controller.signal.reason === error)
        })

        it("should not throw if not aborted", () => {
            assert.doesNotThrow(() => controller.signal.throwIfAborted())
        })

        it("should throw if aborted", () => {
            controller.abort()
            assert.throws(() => controller.signal.throwIfAborted(), Error)
        })
    })
})

describe("AbortSignal", () => {
    it("should not be callable", () => {
        assert.throws(() => (AbortSignal as any)(), TypeError)
    })

    it("should throw a TypeError when it's constructed directly", () => {
        assert.throws(() => new AbortSignal(), TypeError)
    })
})
