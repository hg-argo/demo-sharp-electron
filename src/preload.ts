// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

// Expose the makeImage() function defined in main.ts to the renderer
contextBridge.exposeInMainWorld('makeImage', () => ipcRenderer.invoke('makeImage'));