import { StringUtil } from "../utils/StringUtil";
import { FileUtil } from "../utils/FileUtil";

export abstract class BaseParser {

    protected $lines: string[] = [];

    constructor(path: string) {
        const lines: string[] = FileUtil.readAllLines(path);
        for (let i: number = 0; i < lines.length; i++) {
            const line: string = StringUtil.trim(lines[i]);
            const index: number = line.indexOf("//");
            if (index === -1 || index === 0) {
                this.$lines.push(line);
            }
            else {
                this.$lines.push(line.substr(index));
                this.$lines.push(StringUtil.trim(line.substr(0, index)));
            }
        }
        this.$lines.shift();
        this.$lines.shift();
        for (let i: number = 0; i < this.$lines.length; i++) {
            let line: string = this.$lines[i];
            if (this.$isDfnComment(line) === false) {
                line = line.replace("=", " = ");
                line = StringUtil.replaceAll(line, "\t", " ");
                line = StringUtil.replaceAll(line, "  ", " ");
                this.$lines[i] = StringUtil.trim(line);
            }
        }
    }

    protected $readComments(): string[] {
        const comments: string[] = [];
        while (this.$lines.length > 0) {
            let line: string = this.$lines[0];
            if (this.$isNotSupport(line) === true) {
                throw Error(`解析失败：${line}`);
            }
            if (this.$isDfnEnum(line) || this.$isDfnMessage(line)) {
                break;
            }
            if (this.$isDfnComment(line)) {
                line = StringUtil.trim(line.substr(2));
                comments.push(line);
            }
            else {
                break;
            }
            this.$lines.shift();
        }
        return comments;
    }

    protected $isDfnEnum(line: string): boolean {
        return line.substr(0, 4) === "enum";
    }

    protected $isDfnMessage(line: string): boolean {
        return line.substr(0, 7) === "message";
    }

    protected $isDfnComment(line: string): boolean {
        return line.substr(0, 2) === "//";
    }

    protected $isNotSupport(line: string): boolean {
        return line.substr(0, 2) === "/*";
    }

    protected $throwError(line: string): void {
        throw Error(`解析失败：${line}`);
    }
}