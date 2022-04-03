import { Derivatable, Serializable } from "./interface"
import SendReceiver from "./SendReceiver"

/** @class ValueTimedSendHandler is a send throttle for a value.
 *         It only sends the value if enough time was passed to last send or
 *         the difference to last value is big enough.
 *         These limits can be defined by timeLimit and valueLimit.
 */
class ValueTimedSendHandler<T extends Serializable & Derivatable<T>> {

    private lastTime: number = 0
    private lastValue: T | undefined

    private timeLimit: number
    private valueLimit: number

    /**
     * Creates an instance of ValueTimedSendHandler.
     *
     * @constructor
     * @author: moi
     * @param {timeLimit} time limit to send next value.
     * @param {valueLimit} value limit to send next value.
     */
    constructor(timeLimit: number, valueLimit: number) {
        this.timeLimit = timeLimit
        this.valueLimit = valueLimit
    }

    private diffTime = (): number => {
        return Date.now() - this.lastTime
    }

    /**
     * Sends the value if enough time passed or the value difference is big enough.
     *
     * @param {value} value to send.
     * @param {sendReceiver} A sender which further handles the send request.
     * @return {boolean} true if value was sent.
     */
    public send = (value: T, sendReceiver: SendReceiver): boolean => {
        const valueDiff = this.lastValue ? value.derivation(this.lastValue) : Number.MAX_VALUE
        if (this.diffTime() > this.timeLimit || valueDiff > this.valueLimit) {

            const bytes = value.serialize()
            sendReceiver.send(bytes)
            this.updateLastSend(value)

            return true
        }

        return false
    }

    /**
     * Sends the value instantly. Not checks time and value passed.
     *
     * @param {value} value to send.
     * @param {sendReceiver} A sender which further handles the send request.
     */
    public sendForce = (value: T, sendReceiver: SendReceiver): void => {
        const bytes = value.serialize()
        sendReceiver.send(bytes)
        this.updateLastSend(value)
    }

    private updateLastSend = (value: T): void => {
        this.lastTime = Date.now()
        this.lastValue = value
    }

}

export default ValueTimedSendHandler