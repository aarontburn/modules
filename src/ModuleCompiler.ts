import { app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import ts from 'typescript';
import { IPCCallback } from './module_builder/IPCObjects';
import { Module } from './module_builder/Module';



export class ModuleCompiler {

    private static PATH: string = app.getPath("home") + "/.modules/";
    private static EXTERNAL_MODULES_PATH: string = this.PATH + "/external_modules/"
    private static COMPILED_MODULES_PATH: string = this.PATH + "/built/"
    private static IOOPTIONS: { encoding: BufferEncoding, withFileTypes: true } = {
        encoding: "utf-8",
        withFileTypes: true
    }


    public static async compile(inputFilePath: string, outputDir: string) {
        if (!inputFilePath.endsWith(".ts")) {
            console.log("Skipping " + inputFilePath + ". Not a compilable file (must be .ts)");
            return;
        }

        const inputFileContent: string = fs.readFileSync(inputFilePath, 'utf8');
        const { outputText, diagnostics } = ts.transpileModule(inputFileContent, {
            compilerOptions: {
                esModuleInterop: true,
                target: ts.ScriptTarget.ES5,
                module: ts.ModuleKind.CommonJS,
                noImplicitAny: true,
                sourceMap: true,
                baseUrl: ".",
                paths: {
                    "*": ["node_modules/*"]
                }
            }
        });

        if (diagnostics && diagnostics.length > 0) {
            console.error('Compilation errors:');
            diagnostics.forEach(diagnostic => {
                console.error(diagnostic.messageText);
            });
            return;
        }

        const outputFileName: string = path.basename(inputFilePath).replace('.ts', '.js');
        const outputFilePath: string = path.join(outputDir, outputFileName);

        const formatted: string = this.formatCompilerOutput(outputText);


        try {
            await fs.promises.mkdir(outputDir, { recursive: true });
            await fs.promises.writeFile(outputFilePath, formatted);
            console.log(`File compiled successfully: ${outputFilePath}`);
        } catch (error) {
            console.error(`Error compiling file: ${error}`);
        }


    }

    private static formatCompilerOutput(moduleText: string): string {
        const splitLines = moduleText.split("\n");
        for (let i = 0; i < splitLines.length; i++) {
            if (splitLines[i].trim() === "/** @htmlpath */") {
                const formatted: string = splitLines[i + 1].replace('.replace("dist", "src")', '');
                splitLines[i + 1] = formatted;
            }
        }

        return splitLines.join("\n");
    }

    private static async formatHTML(htmlPath: string, outputPath: string) {
        const contents: string = (await fs.promises.readFile(htmlPath)).toString();
        const lines: string[] = contents.split("\n")

        for (let i = 0; i < lines.length; i++) {
            switch (lines[i].trim()) {
                case "<!-- @css -->": { // Modify colors.css path
                    const css: string = lines[i + 1].trim();

                    const href = css.replace("<", "").replace(">", "").split(" ")[2];
                    if (href.substring(0, 4) !== "href") {
                        throw new Error("Could not parse css line: " + css);
                    }
                    const replacedCSS: string = href.replace("../../", "./module_builder/");
                    const finalCSS: string = `\t<link rel="stylesheet" ${replacedCSS}">`
                    lines[i + 1] = finalCSS

                    break;
                }

                case "<!-- @renderer -->": { // Update renderer path
                    const script: string = lines[i + 1].trim();

                    // TODO: Match the script better.
                    const src: string = script.replace('"></script>', "").split(" ")[2]
                    if (src.substring(0, 3) !== "src") {
                        throw new Error("Could not parse script line: " + script);
                    }
                    // src="../../dist/{DIRECTORY}/{MODULE_NAME}.js"
                    const replacedSrc: string = src.substring(src.lastIndexOf("/") + 1);
                    const finalScript: string = `\t<script defer src="${replacedSrc}"></script>`
                    lines[i + 1] = finalScript


                    break;
                }
            }


            // console.log(lines[i]);
        }

        await fs.promises.writeFile(outputPath, lines.join("\n"));

    }





    public static async loadPluginsFromStorage(ipcCallback: IPCCallback): Promise<Module[]> {
        await this.compileAndCopy();

        const externalModules: Module[] = [];

        try {
            const folders = await fs.promises.readdir(this.COMPILED_MODULES_PATH, this.IOOPTIONS);

            for (const folder of folders) {
                if (!folder.isDirectory()) {
                    continue;
                }

                const subfiles = await fs.promises.readdir(`${folder.path}/${folder.name}`, this.IOOPTIONS);
                for (const subfile of subfiles) {
                    if (subfile.name.includes("Module")) {
                        const module: any = require(subfile.path + "/" + subfile.name);
                        for (const key in module) {
                            externalModules.push(new module[key](ipcCallback));
                        }
                    }
                }

            }


        } catch (err) {
            console.error(err);
        }

        return externalModules

    }

    public static async compileAndCopy() {
        try {
            const files = await fs.promises.readdir(this.EXTERNAL_MODULES_PATH, this.IOOPTIONS);

            for (const folder of files) {
                if (!folder.isDirectory()) {
                    continue;
                }

                const subfiles = await fs.promises.readdir(`${folder.path}/${folder.name}`, this.IOOPTIONS);
                const builtDirectory = this.COMPILED_MODULES_PATH + folder.name;

                await fs.promises.mkdir(builtDirectory, { recursive: true });

                for (const subfile of subfiles) {
                    const fullSubfilePath = subfile.path + "/" + subfile.name;

                    if (path.extname(subfile.name) === ".ts") {
                        await this.compile(fullSubfilePath, builtDirectory);

                    } else if (subfile.isDirectory()) {
                        if (subfile.name === "module_builder") {
                            await fs.promises.cp(__dirname + "/module_builder", `${builtDirectory}/${subfile.name}`, { recursive: true });
                            console.log(`Copied module_builder into ${builtDirectory}`);
                        } else {
                            await fs.promises.cp(subfile.path + "/" + subfile.name, `${builtDirectory}/${subfile.name}`, { recursive: true });
                            console.log(`Copied ${subfile.name} into ${builtDirectory}`);
                        }

                    } else if (path.extname(subfile.name) === ".html") {
                        await this.formatHTML(fullSubfilePath, `${builtDirectory}/${subfile.name}`);

                        const mainFolder: string = path.join(__dirname, "../");
                        const relativeCSSPath: string = path.join(mainFolder, "colors.css");
                        const relativeFontPath: string = path.join(mainFolder, "Yu_Gothic_Light.ttf");

                        await fs.promises.mkdir(builtDirectory + "/module_builder/", { recursive: true })
                        await fs.promises.copyFile(relativeCSSPath, builtDirectory + "/module_builder/colors.css");
                        await fs.promises.copyFile(relativeFontPath, builtDirectory + "/module_builder/Yu_Gothic_Light.ttf");


                    } else {
                        await fs.promises.copyFile(fullSubfilePath, `${builtDirectory}/${subfile.name}`);
                    }

                }
            }

            console.log("All files compiled and copied successfully.");
        } catch (error) {
            console.error("Error:", error);
        }

    }


}