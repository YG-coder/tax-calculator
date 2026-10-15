// Existing TypeScript compiler renders the actual TSX without adding a browser/test dependency.
import fs from 'node:fs';
import path from 'node:path';
import Module, { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const localRequire = createRequire(import.meta.url);
import ts from 'typescript';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const resolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...args) {
 return resolve.call(this, request.startsWith('@/') ? path.join(root, 'src', request.slice(2)) : request, ...args);
};
for (const extension of ['.ts', '.tsx']) {
 Module._extensions[extension] = (loaded, filename) => {
  const result = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {fileName:filename, compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}});
  loaded._compile(result.outputText, filename);
 };
}
export const load = file => localRequire(path.join(root, file));
export const { uiHarness } = localRequire('./uiHarness.ts');
