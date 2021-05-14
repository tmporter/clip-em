import * as fs from "fs";
import * as path from "path";

/**
 * Generate a random int between min (inclusive) and max (exclusive).
 *
 * @param {number} min
 * @param {number} max
 * @returns {number} A random int between min (inclusive) and max (exclusive).
 */
export const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

export const writeFile = (filename: string, content: any) => {
  const folders = filename.split(path.sep).slice(0, -1);
  if (folders.length) {
    // create folder path if it doesn't exist
    folders.reduce((last, folder) => {
      const folderPath = last ? last + path.sep + folder : folder;
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }
      return folderPath;
    });
  }

  fs.writeFile(filename, content, { encoding: "utf-8" }, (error) => {
    if (error) {
      console.error(error);
    }
  });
};

export const readFile = (filename: string) => {
  return fs.readFileSync(filename, "utf-8");
};
