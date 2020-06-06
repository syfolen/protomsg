"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileUtil_1 = require("./utils/FileUtil");
var FileParser_1 = require("./parser/FileParser");
var M_1 = require("./utils/M");
main();
function main() {
    var args = process.argv.slice(2);
    FileUtil_1.FileUtil.root = args[0] || "E:\\work\\sanguo\\conf";
    console.log("compile " + FileUtil_1.FileUtil.root);
    M_1.M.lines.push("");
    M_1.M.lines.push("/**");
    M_1.M.lines.push(" * 网络数据接口");
    M_1.M.lines.push(" */");
    M_1.M.lines.push("export namespace ProtoMsg {");
    new FileParser_1.ParseFile(FileUtil_1.FileUtil.getAbsolutePath(args[1] || "game.proto"));
    M_1.M.lines.push("}");
    M_1.M.lines.push("");
    FileUtil_1.FileUtil.writeAllLines("client\\ProtoMsg.ts", M_1.M.lines);
}
//# sourceMappingURL=main.js.map