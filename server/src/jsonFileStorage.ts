import { readFile, writeFile } from "./utilities";

class JsonFileStorage {
  private path: string;

  constructor(path: string) {
    if (path[path.length - 1] === "/") {
      path = path.substring(0, path.length - 2);
    }

    this.path = path;
  }

  save = <T>(data: T, id: string) => {
    if (!id) {
      throw Error("id required");
    }

    writeFile(this.buildPath(id), JSON.stringify(data));
  };

  load = <T>(id: string): T | undefined => {
    try {
      let content: string;
      content = readFile(this.buildPath(id));

      if (!content) {
        return undefined;
      } else {
        return JSON.parse(content) as T;
      }
    } catch (error) {
      return undefined;
    }
  };

  private buildPath = (id: string) => `${this.path}/${id}.json`;
}

export default JsonFileStorage;
