import Dexie from 'dexie';
import {BlobImage} from "../../Entities/image.model";


export class ImageDB extends Dexie {
    public images: Dexie.Table<BlobImage, string>;

    constructor() {
        super("ImageDB");
        const db = this;
        //
        // Define tables and indexes
        //
        db.version(1).stores({
            images: "&url"
        });

        // Let's physically map BlobImage class to image table.
        db.images.mapToClass(BlobImage);
    }
}

export const db: ImageDB = new ImageDB();

/**ImageDB
 * Delete the entire database
 */
export function deleteImageDatabase(): Promise<void> {
    return db.delete();
}

/**
 * Open a database
 */
export function openImageDatabase(): Promise<Dexie> {
    return db.open();
}

/**
 * Read all contacts
 */
export function readAllImages(): Promise<BlobImage[]> {
    return db.images.toArray();
}

/**
 * Delete all contacts
 */
export function deleteAllImages(): Promise<void> {
    return db.images.clear();
}

/**
 * Create a contact
 *
 * Note that since the contact is guaranteed
 * to have a unique ID we are using `put`
 * to update the databse.
 */
export function createImage(image: BlobImage): Promise<string> {
    return db.images.put(image);
}

/**
 * Read an image
 */
export function readImageByID(id: string): Promise<BlobImage> {
    return db.images.get(id);
}

/**
 * Read images by URL
 */
export function readImagesByURL(url: string): Promise<BlobImage[]> {
    return db.images
        .where("url")
        .equals(url)
        .toArray();
}

/**
 * Update image
 */
export function updateImage(image: BlobImage): Promise<string> {
    return db.images.put(image);
}

/**
 * Delete image
 */
export function deleteImage(id: string): Promise<number> {
    return db.images
        .where("id")
        .equals(id)
        .delete();
}
