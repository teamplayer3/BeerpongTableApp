export interface Serializable {
    serialize: () => Uint8Array;
}

export interface Derivatable<T> {
    derivation: (last: T) => number;
}

export interface ListenerHandle {
    /**
     * removes the subscription
     */
    remove: () => void;
}
