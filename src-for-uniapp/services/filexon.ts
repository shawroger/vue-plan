import { Stream, Upload } from "filexon";

const stream = new Stream();

export function genFile(text: string) {
	stream.write(text);
	stream.out("plan.txt");
}

export {
    Upload
}
