import { existsSync, mkdirSync } from "fs";

export const FOLDER = 'upload';

export const useOrCreateFolder = (path: string = FOLDER): void => {
  if (existsSync(path)) {
    return;
  }

  mkdirSync(path);
};
