import { app, BrowserWindow } from "electron";
import { ModuleController } from "./ModuleController";
import { IPCHandler } from "./IPCHandler";
import { ModuleCompiler } from "./ModuleCompiler";
import { Module } from "./module_builder/Module";
import { AutoClickerModule } from "./modules/auto_clicker/AutoClickerModule";
import { StorageHandler } from "./StorageHandler";

const ipcMain: Electron.IpcMain = require('electron').ipcMain;
const guiHandler: ModuleController = new ModuleController(ipcMain);

app.whenReady().then(() => {
  guiHandler.start();
  app.on("activate", () => { // MacOS stuff
    if (BrowserWindow.getAllWindows().length === 0) {
      guiHandler.start();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    guiHandler.stop();
    app.quit();
  }
});

// const outputDir: string = ModuleCompiler.compile("C:/Users/atburn/.modules/external_modules/volume_controller/VolumeControllerModule.ts")
// const { VolumeControllerModule } = require(outputDir)

StorageHandler.loadPluginsFromStorage()








