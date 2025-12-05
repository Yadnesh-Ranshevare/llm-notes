import { encoding_for_model } from "@dqbd/tiktoken";

const enc = encoding_for_model("gpt-4o");

const text = "Hello! This is a tiktoken-lite example.";

const tokens = enc.encode(text);
console.log(tokens);             // token IDs

console.log(tokens.length);      // number of tokens

const decoded = enc.decode(tokens); // this is a Uint8Array (bytes)

const decodedText = new TextDecoder("utf-8").decode(decoded);
console.log(decodedText);        // → original text

enc.free();
