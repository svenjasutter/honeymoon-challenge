import { timeStamp } from "console";
import { Interface } from "readline";
import * as internal from "stream";

export interface Challenge {
    id?: Number;
    title: String;
    description: String;
    profit: Number;
    difficulty: Number;
    done: Boolean;
    path: string;

}