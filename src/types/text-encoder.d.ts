declare module 'text-encoder' {
    class TextEncoder {
        constructor(encoding: 'utf8' | 'utf-8' | 'unicode-1-1-utf-8');

        encode(params: string): Uint8Array;
    }
}
