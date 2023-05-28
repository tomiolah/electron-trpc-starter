import { ElectronAPI } from "@electron-toolkit/preload";

export declare global {
  interface Window {
    __id: string;
    electron: ElectronAPI;
    api: unknown;
  }
}
