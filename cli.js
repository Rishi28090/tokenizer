
import Tokenizer from "./tokenizer/SimpleTokenizer.js";
import path from "path";

const [,, command, ...rest] = process.argv;
const cwd = process.cwd();
const vocabFile = path.resolve(cwd, "vocab.json");
const tokenizer = new Tokenizer(vocabFile);

function parseIdsFromArgs(args) {
  if (!args || args.length === 0) return [];
  const joined = args.join(" ");
  const cleaned = joined.replace(/^\s*\[|\]\s*$/g, "");
  return cleaned
    .split(/[,\s]+/)
    .map(x => Number(x))
    .filter(n => !Number.isNaN(n));
}

switch ((command || "").toLowerCase()) {
  case "train": {
    const file = rest[0] ? path.resolve(cwd, rest[0]) : path.resolve(cwd, "corpus.txt");
    try {
      const added = tokenizer.trainFromFile(file);
      console.log(`Trained from ${file}. Added ${added} new tokens. Vocab saved to ${vocabFile}`);
    } catch (err) {
      console.error("Train failed:", err.message);
    }
    break;
  }

  case "encode": {
    if (!rest.length) {
      console.error("Please provide text to encode, e.g.:\n  node cli.js encode \"hello world\"");
      process.exit(1);
    }
    const text = rest.join(" ");
    const ids = tokenizer.encodeText(text, true);
    console.log(`# Encoded IDs: ${JSON.stringify(ids)}`);
    break;
  }

  case "decode": {
    if (!rest.length) {
      console.error("Provide IDs to decode, e.g.:\n  node cli.js decode 2 4 5 3\n  node cli.js decode \"2,4,5,3\"");
      process.exit(1);
    }
    const ids = parseIdsFromArgs(rest);
    if (!ids.length) {
      console.error("Could not parse IDs. Use e.g. `2 4 5 3` or `2,4,5,3`");
      process.exit(1);
    }
    const text = tokenizer.decodeIds(ids);
    console.log(`# Decoded Text: ${text}`);
    break;
  }

  case "vocab": {
    console.log(tokenizer.getVocab());
    break;
  }

  default:
    console.log(`Usage:
  node cli.js train <file.txt>       # build vocab from file (default: corpus.txt)
  node cli.js encode "your text"     # encode text (adds unknown tokens to vocab)
  node cli.js decode 2 4 5 3         # decode ids
  node cli.js vocab                  # print current vocab (word -> id)
`);
}
