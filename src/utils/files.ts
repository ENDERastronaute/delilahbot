
import path from 'path';
import fs from 'fs/promises';

export default class Files {
    static async getFilesByExtension(dir: string, ext: string) {

        const files = [];

        for await (let f of this.getFiles(dir)) {
            if (f.endsWith(`.${ext}`)) {
                files.push(f);
            }
        }

        return Promise.resolve(files);
    }

    static async* getFiles(dir: string, baseDir = dir): any {
        const dirents = await fs.readdir(dir, { withFileTypes: true });

        for (let dirent of dirents) {
            let res = path.resolve(dir, dirent.name);

            if (dirent.isDirectory()) {
                yield* this.getFiles(res, baseDir);

            } else {
                yield path.relative(baseDir, res);
            }
        }
    }
}