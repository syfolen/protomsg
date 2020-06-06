import { FileUtil } from "./utils/FileUtil";
import { ParseFile } from "./parser/FileParser";
import { M } from "./utils/M";

main();

function main(): void {
    const args: string[] = process.argv.slice(2);
    FileUtil.root = args[0] || "E:\\work\\sanguo\\conf";
    console.log(`compile ${FileUtil.root}`);

    M.lines.push("");
    M.lines.push("/**");
    M.lines.push(" * 网络数据接口");
    M.lines.push(" */");
    M.lines.push("export namespace ProtoMsg {");
    new ParseFile(FileUtil.getAbsolutePath(args[1] || "game.proto"));
    M.lines.push("}");
    M.lines.push("");

    FileUtil.writeAllLines("client\\ProtoMsg.ts", M.lines);
}
