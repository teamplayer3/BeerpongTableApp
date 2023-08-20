import TableConnection from './TableConnection';

/** @class SendReceiver handles send requests. Listeners can be registered for received bytes. */
class SendReceiver {
    private connection: TableConnection;

    /**
     * Creates an instance of SendReceiver.
     *
     * @constructor
     * @author: alex
     * @param {connection} connection hanlde to the table.
     */
    constructor(connection: TableConnection) {
        this.connection = connection;
    }

    /**
     * Sends bytes over connection.
     *
     * @param {bytes} byte stream.
     */
    public send = (bytes: Uint8Array): void => {
        this.connection.send(bytes);
    };
}

export default SendReceiver;
