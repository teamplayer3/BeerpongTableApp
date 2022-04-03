import { Alert } from "react-native"
import base64 from "react-native-base64"
import { BleError, BleManager, Characteristic, Device, State, Subscription } from "react-native-ble-plx"
import { bytesToString, requestLocationPermissionForBluetooth, showToast } from "../util/Utils"
import { ListenerHandle } from "./interface"

const tableIdent = "B4:52:A9:12:92:3A"
const serviceUUID = "0000ffe0-0000-1000-8000-00805f9b34fb"
const characteristicUUID = "0000ffe1-0000-1000-8000-00805f9b34fb"

enum ConnectionState {
    INIT = 0,
    START = 1,
    CONNECTED = 2,
    DISCONNECTED = 3,
    RECONNECT = 4,
    STOP = 5
}

type ReceiveCallback = (bytes: Uint8Array) => void
type StateCallback = (connectionState: ConnectionState) => void

/** @class TableConnection hanldes the connection to the table. */
class TableConnection {

    private state: ConnectionState = ConnectionState.INIT

    private bleManager: BleManager

    private bleStateListener: Subscription | undefined
    private deviceLostConnectionListener: Subscription | undefined
    private deviceCharacteristicListener: Subscription | undefined

    private bleDevice?: Device

    private static receiveListenerCount: number = 0
    private receiveListeners: Map<number, ReceiveCallback> = new Map<number, ReceiveCallback>()

    private static stateListenerCount: number = 0
    private stateListeners: Map<number, StateCallback> = new Map<number, StateCallback>()

    /**
     * Creates an instance of TableConnection.
     *
     * @constructor
     * @author: alex
     */
    constructor(bleManager: BleManager) {
        this.bleManager = bleManager

        this.registerBleStateListener()
    }

    /**
     * register a callback if bytes are received from bluetooth
     * 
     * @param callback will be called if bytes get received
     * @returns a handle for the listener
     */
    public onReceiveBytes = (callback: ReceiveCallback): ListenerHandle => {
        const id = TableConnection.receiveListenerCount++
        this.receiveListeners.set(id, callback)

        this.registerDeviceCharacteristicListener()

        return {
            remove: () => this.receiveListeners.delete(id)
        }
    }

    public onConnectionStateChange = (callback: StateCallback): ListenerHandle => {
        const id = TableConnection.stateListenerCount++
        this.stateListeners.set(id, callback)
        return {
            remove: () => this.stateListeners.delete(id)
        }
    }

    /**
     * Sends bytes to the table.
     *
     * @param bytes to send.
     */
    public send = async (bytes: Uint8Array) => {
        if (!this.bleDevice) return

        try {
            for (let i = 0; i < bytes.length / 20 + 1; i++) {
                const lower = i * 20;
                const upper = (i + 1) * 20;

                let chunk
                if (upper > bytes.length) {
                    chunk = bytes.subarray(lower, bytes.length);
                } else {
                    chunk = bytes.subarray(lower, upper);
                }

                const b64 = base64.encodeFromByteArray(chunk)
                await this.bleDevice.writeCharacteristicWithoutResponseForService(serviceUUID, characteristicUUID, b64)
            }

        }
        catch (err) {
            console.log("error while sending data" + err)
        }
    }

    /**
     * stops the connection
     * 
     */
    public stop = async () => {
        this.changeState(ConnectionState.STOP)
        await this.disconnectDevice()
        if (this.bleStateListener) this.bleStateListener.remove()
    }

    /**
     * start the connection
     * 
     */
    public start = async () => {
        this.changeState(ConnectionState.START)
        this.startBluetooth()
    }

    private changeState = (newState: ConnectionState) => {
        this.state = newState
        this.stateListeners.forEach(callback => callback(this.state))
    }

    private startBluetooth = async () => {
        const bluetoothIsOff = await this.bleManager.state() === State.PoweredOff
        if (bluetoothIsOff) {
            await this.bleManager.enable()
        }
    }

    private registerBleStateListener = () => {
        if (this.bleStateListener) return

        this.bleStateListener = this.bleManager.onStateChange(this.onBleStateChange, true);
    }

    private onBleStateChange = (newState: State) => {
        switch (newState) {
            case State.PoweredOn: this.discoverTableConnection()
                break
            case State.PoweredOff: Alert.alert("Enable Bluetooth to use all functions")
                break
            case State.Unauthorized: requestLocationPermissionForBluetooth()
        }
    }

    private discoverTableConnection = async () => {
        try {
            if (!this.bleDevice || !await this.bleDevice.isConnected()) {
                let device: Device | undefined = undefined

                if (await this.bleManager.isDeviceConnected(tableIdent)) {
                    device = (await this.bleManager.connectedDevices([tableIdent]))[0]
                }
                else {
                    device = await this.bleManager.connectToDevice(tableIdent)
                }

                this.setNewBleDevice(device!)
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    private setNewBleDevice = async (device: Device) => {
        device = await device.discoverAllServicesAndCharacteristics()
        this.bleDevice = device!
        this.registerDeviceLostConnectionListener()
        this.changeState(ConnectionState.CONNECTED)
    }

    private registerDeviceLostConnectionListener = () => {
        if (!this.bleDevice) return

        if (this.deviceLostConnectionListener) this.deviceLostConnectionListener.remove()

        this.deviceLostConnectionListener = this.bleDevice.onDisconnected(this.onDeviceDisconnected)
    }

    private onDeviceDisconnected = async (err: BleError | null, device: Device | null) => {
        this.changeState(ConnectionState.DISCONNECTED)

        showToast("Lost connecttion...Reconnect")
        console.log("diconnected")

        await this.disconnectDevice()

        this.reconnect()
    }

    private reconnect = async () => {
        this.changeState(ConnectionState.RECONNECT)
        await this.discoverTableConnection()
    }

    private registerDeviceCharacteristicListener = (): void => {
        if (this.deviceCharacteristicListener || !this.bleDevice) return

        this.deviceCharacteristicListener = this.bleDevice.monitorCharacteristicForService(serviceUUID, characteristicUUID, this.onReceiveBytesIntern)
    }

    private onReceiveBytesIntern = (err: BleError | null, characteristic: Characteristic | null) => {
        if (err) {
            console.log(err)
            return
        }

        if (!characteristic || !characteristic.value) return

        const str = base64.decode(characteristic.value)
        const bytes = Uint8Array.from(str, c => c.charCodeAt(0))

        this.receiveListeners.forEach(callback => callback(bytes))
    }

    private disconnectDevice = async () => {
        if (this.deviceLostConnectionListener) this.deviceLostConnectionListener.remove()
        if (this.deviceCharacteristicListener) this.deviceCharacteristicListener.remove()
        if (this.bleDevice && await this.bleDevice!.isConnected()) await this.bleDevice.cancelConnection()
    }

}

export default TableConnection