/*
 * The class helps with code completion
 *
 * Defines the interface of objects in the phone number table.
 */
export class BlobImage {
    constructor(
        public url: string,
        public data: Blob,
        public mimeType?: string,
        public tag?: string,
        public width?: string,
        public height?: string
    ) {}
}

/*
 * Base 64 Encoded Image.
 * The data property is a string.
 */
export class Base64Image {
    constructor(
        public url: string,
        public data: string,
        public mimeType?: string,
        public tag?: string,
        public width?: string,
        public height?: string
    ) {}
}
