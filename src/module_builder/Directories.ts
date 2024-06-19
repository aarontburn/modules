import { app } from 'electron';


export class Directories {
    
    private static readonly PATH: string = app.getPath("home") + "/.modules/";
    private static readonly STORAGE_PATH: string = this.PATH + "/storage/";
    private static readonly EXTERNAL_MODULES_PATH: string = this.PATH + "/external_modules/"
    private static readonly COMPILED_MODULES_PATH: string = this.PATH + "/built/"

}