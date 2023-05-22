import { MMKVLoader, MMKVInstance, useMMKVStorage } from "react-native-mmkv-storage";

const MMKV: MMKVInstance = new MMKVLoader().initialize();
type LiteralUnion<T extends U, U = string> = T | (U & {});

export const useStorage = (
    key: LiteralUnion<"players">,
    defaultValue?: string
) => {
    const [value, setValue] = useMMKVStorage(key, MMKV, defaultValue);
    return [value, setValue];
};