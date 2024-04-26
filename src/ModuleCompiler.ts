import * as fs from 'fs';
import * as path from 'path';
import ts from 'typescript';



export class ModuleCompiler {

    public static compile(inputFilePath: string, outputDir: string): string {
        if (!inputFilePath.endsWith(".ts")) {
            console.log("Skipping " + inputFilePath + ". Not a compilable file (must be .ts)");
            return;
        }
        console.log("Compiling " + inputFilePath)


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

        


        fs.mkdir(outputDir, {recursive: true}, (err: NodeJS.ErrnoException) => {
            if (err) {
                console.log("Error creating folder for " + outputDir)
                console.error(err)
                return;
            }
            fs.writeFile(outputFilePath, formatted, () => {
                console.log(`File compiled successfully: ${outputFilePath}`);
            });
        })

        return outputFilePath;


    }

    private static formatCompilerOutput(moduleText: string): string {
        const splitLines = moduleText.split("\n");
        for (let i = 0; i < splitLines.length; i++) {
            if (splitLines[i].trim() === "/** @builtin */") {
                const formatted: string = splitLines[i + 1].replace("../../", "../");
                splitLines[i + 1] = formatted;
            }
        }

        return splitLines.join("\n")

    }


}