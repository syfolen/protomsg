import { ItemDfn } from "../dfn/ItemDfn";
import { BaseParser } from "./BaseParser";
import { StringUtil } from "../utils/StringUtil";
import { DfnFlagEnum } from "../constants/DfnFlagEnum";
import { M } from "../utils/M";
import { FileUtil } from "../utils/FileUtil";

export class ParseFile extends BaseParser {

    private $dfnList: ItemDfn[] = [];

    constructor(path: string) {
        super(path);

        while (this.$lines.length > 0) {
            const dfn: ItemDfn = this.$readNextDfn();
            if (dfn === null) {
                continue;
            }
            this.$dfnList.push(dfn);
        }
        this.$dfnList.sort((a: ItemDfn, b: ItemDfn) => {
            return a.name.charCodeAt(0) - b.name.charCodeAt(0);
        })

        this.$mergeEnums();
        this.$mergeMessages();
    }

    private $mergeEnums(): void {
        const dfns: ItemDfn[] = [];
        for (const dfn of this.$dfnList) {
            if (dfn.kind === "enum") {
                dfns.push(dfn);
            }
        }
        for (let i: number = 0; i < dfns.length; i++) {
            const dfn: ItemDfn = dfns[i];
            if (i > 0) {
                M.lines.push("");
            }
            if (dfn.comments.length > 0) {
                M.lines.push(`${FileUtil.TAB}/**`);
                for (const comment of dfn.comments) {
                    M.lines.push(`${FileUtil.TAB} * ${comment}`);
                }
                M.lines.push(`${FileUtil.TAB} */`);
            }
            else {
                M.lines.push("");
            }
            M.lines.push(`${FileUtil.TAB}export enum ${dfn.name} {`);
            for (let i: number = 0; i < dfn.dfns.length; i++) {
                const item: ItemDfn = dfn.dfns[i];
                if (i > 0) {
                    M.lines.push("");
                }
                if (item.comments.length > 0) {
                    M.lines.push(`${FileUtil.TAB}${FileUtil.TAB}/**`);
                    for (const comment of item.comments) {
                        M.lines.push(`${FileUtil.TAB}${FileUtil.TAB} * ${comment}`);
                    }
                    M.lines.push(`${FileUtil.TAB}${FileUtil.TAB} */`);
                }
                else {
                    M.lines.push("");
                }
                const comma: string = i === dfn.dfns.length - 1 ? "" : ",";
                M.lines.push(`${FileUtil.TAB}${FileUtil.TAB}${item.name}${comma}`);
            }
            M.lines.push(`${FileUtil.TAB}}`);
        }
        for (let i: number = 0; i < dfns.length; i++) {
            const dfn: ItemDfn = dfns[i];
            if (i > 0) {
                M.lines.push("");
            }
            if (dfn.comments.length > 0) {
                M.lines.push(`${FileUtil.TAB}/**`);
                for (const comment of dfn.comments) {
                    M.lines.push(`${FileUtil.TAB} * ${comment}`);
                }
                M.lines.push(`${FileUtil.TAB} */`);
            }
            else {
                M.lines.push("");
            }
            M.lines.push(`${FileUtil.TAB}export interface I${dfn.name} {`);
            for (let i: number = 0; i < dfn.dfns.length; i++) {
                const item: ItemDfn = dfn.dfns[i];
                if (i > 0) {
                    M.lines.push("");
                }
                if (item.comments.length > 0) {
                    M.lines.push(`${FileUtil.TAB}${FileUtil.TAB}/**`);
                    for (const comment of item.comments) {
                        M.lines.push(`${FileUtil.TAB}${FileUtil.TAB} * ${comment}`);
                    }
                    M.lines.push(`${FileUtil.TAB}${FileUtil.TAB} */`);
                }
                else {
                    M.lines.push("");
                }
                M.lines.push(`${FileUtil.TAB}${FileUtil.TAB}${item.name}: number;`);
            }
            M.lines.push(`${FileUtil.TAB}}`);
        }
    }

    private $mergeMessages(): void {
        const dfns: ItemDfn[] = [];
        for (const dfn of this.$dfnList) {
            if (dfn.kind === "message") {
                dfns.push(dfn);
            }
        }
        for (let i: number = 0; i < dfns.length; i++) {
            const dfn: ItemDfn = dfns[i];
            if (i > 0) {
                M.lines.push("");
            }
            if (dfn.comments.length > 0) {
                M.lines.push(`${FileUtil.TAB}/**`);
                for (const comment of dfn.comments) {
                    M.lines.push(`${FileUtil.TAB} * ${comment}`);
                }
                M.lines.push(`${FileUtil.TAB} */`);
            }
            else {
                M.lines.push("");
            }
            M.lines.push(`${FileUtil.TAB}export interface I${dfn.name} {`);
            for (let i: number = 0; i < dfn.dfns.length; i++) {
                const item: ItemDfn = dfn.dfns[i];
                if (i > 0) {
                    M.lines.push("");
                }
                if (item.comments.length > 0) {
                    M.lines.push(`${FileUtil.TAB}${FileUtil.TAB}/**`);
                    for (const comment of item.comments) {
                        M.lines.push(`${FileUtil.TAB}${FileUtil.TAB} * ${comment}`);
                    }
                    M.lines.push(`${FileUtil.TAB}${FileUtil.TAB} */`);
                }
                else {
                    M.lines.push("");
                }
                const suffix: string = (item.flags & DfnFlagEnum.REPEATED) === 0 ? "" : "[]";
                M.lines.push(`${FileUtil.TAB}${FileUtil.TAB}${item.name}: ${this.$converTypeToTSString(item.type)}${suffix};`);
            }
            M.lines.push(`${FileUtil.TAB}}`);
        }
    }

    private $converTypeToTSString(type: string): string {
        const array: string[] = ["string", "int32", "int64", "bool", "string", "number", "dcodeIO.Long", "boolean"];
        const index: number = array.indexOf(type);
        if (index === -1) {
            for (const dfn of this.$dfnList) {
                if (dfn.name === type) {
                    if (dfn.kind === "enum") {
                        return type;
                    }
                    else {
                        return "I" + type;
                    }
                }
            }
        }
        return array[index + 4];
    }

    private $readNextDfn(): ItemDfn {
        const dfn: ItemDfn = new ItemDfn();
        dfn.comments = this.$readComments();

        const line: string = this.$lines.shift();
        if (this.$isDfnEnum(line)) {
            dfn.kind = "enum";
        }
        else if (this.$isDfnMessage(line)) {
            dfn.kind = "message";
        }
        else {
            this.$throwError(line);
        }
        dfn.name = this.$readDfnName(line);

        while (true) {
            let lineDfn: ItemDfn = null;
            if (dfn.kind === "enum") {
                lineDfn = this.$readEnumLineDfn();
            }
            else if (dfn.kind === "message") {
                lineDfn = this.$readMessageLineDfn();
            }
            if (lineDfn === null) {
                break;
            }
            dfn.dfns.push(lineDfn);
        }

        if (dfn.dfns.length === 0) {
            return null;
        }
        return dfn;
    }

    private $readEnumLineDfn(): ItemDfn {
        const dfn: ItemDfn = new ItemDfn();
        dfn.comments = this.$readComments();

        let line: string = this.$lines.shift();
        if (line === "}") {
            return null;
        }

        if (line.charAt(line.length - 1) === ";") {
            line = line.substr(0, line.length - 1);
        }

        const array: string[] = line.split(" ");
        dfn.name = StringUtil.trim(array[0]);
        dfn.value = StringUtil.trim(array[2]);
        return dfn;
    }

    private $readMessageLineDfn(): ItemDfn {
        const dfn: ItemDfn = new ItemDfn();
        dfn.comments = this.$readComments();

        let line: string = this.$lines.shift();
        if (line === "}") {
            return null;
        }

        if (line.charAt(line.length - 1) === ";") {
            line = line.substr(0, line.length - 1);
        }

        let array: string[] = line.split(" ");
        if (array.length === 5) {
            if (array[0] === "repeated") {
                dfn.flags |= DfnFlagEnum.REPEATED;
            }
            else {
                this.$throwError(line);
            }
            array.shift();
        }

        dfn.type = array[0];
        dfn.name = array[1];
        dfn.value = array[3];

        return dfn;
    }

    private $readDfnName(line: string): string {
        let reg0: number = line.indexOf(" ") + 1;
        if (reg0 === 0) {
            this.$throwError(line);
        }

        let index: number = line.indexOf(" {");
        if (index === -1) {
            index = line.indexOf("{");
        }
        if (index === -1) {
            this.$throwError(line);
        }
        return line.substring(reg0, index);
    }
}