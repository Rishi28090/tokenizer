// tokenizer.js
import fs from "fs";
import path from "path";

export default class Tokenizer {
  constructor(vocabPath = path.resolve(process.cwd(), "vocab.json")) {
    this.vocabPath = vocabPath;
    this.vocab = {};
    this.reverse = {};
    
    this.special = { "<PAD>": 0, "<UNK>": 1, "<SOS>": 2, "<EOS>": 3 };
    this.nextId = Object.keys(this.special).length;
  }

 
  load() {
    if (!fs.existsSync(this.vocabPath)) {
      this._initSpecials();
      return;
    }
    try {
      const raw = fs.readFileSync(this.vocabPath, "utf-8").trim();
      if (!raw) {
        this._initSpecials();
        return;
      }
      const parsed = JSON.parse(raw);
     
      this.vocab = parsed;
     
      this.reverse = Object.fromEntries(
        Object.entries(this.vocab).map(([w, id]) => [Number(id), w])
      );
    
      const ids = Object.values(this.vocab).map(v => Number(v)).filter(n => !Number.isNaN(n));
      this.nextId = ids.length === 0 ? Object.keys(this.special).length : Math.max(...ids) + 1;
      
      this._ensureSpecials();
    } catch (err) {
      console.warn("Failed to load vocab.json — reinitializing. Error:", err.message);
      this._initSpecials();
    }
  }

  _initSpecials() {
    this.vocab = { ...this.special };
    this.reverse = Object.fromEntries(Object.entries(this.vocab).map(([w, id]) => [id, w]));
    this.nextId = Object.keys(this.special).length;
  }

  _ensureSpecials() {
    let changed = false;
    for (const [tok, id] of Object.entries(this.special)) {
      if (!(tok in this.vocab)) {
       
        if (Object.values(this.vocab).includes(id)) {
         
          this.vocab[tok] = this.nextId;
          this.reverse[this.nextId] = tok;
          this.nextId++;
        } else {
          this.vocab[tok] = id;
          this.reverse[id] = tok;
        }
        changed = true;
      }
    }
    if (changed) this.save();
  }

  save() {
    fs.writeFileSync(this.vocabPath, JSON.stringify(this.vocab, null, 2), "utf-8");
  }

  
  trainFromFile(filePath) {
    if (!fs.existsSync(filePath)) throw new Error(`Train file not found: ${filePath}`);
    this.load();
    const raw = fs.readFileSync(filePath, "utf-8");
    const words = raw.split(/\s+/).filter(Boolean);
    const uniq = Array.from(new Set(words));
    let added = 0;
    for (const w of uniq) {
      if (!(w in this.vocab)) {
        this.vocab[w] = this.nextId;
        this.reverse[this.nextId] = w;
        this.nextId++;
        added++;
      }
    }
    this.save();
    return added;
  }

 
  encodeText(text, learnNew = true) {
    this.load();
    const words = text.split(/\s+/).filter(Boolean);
    const ids = [];
    ids.push(this.vocab["<SOS>"] ?? this.special["<SOS>"]);
    let changed = false;
    for (const w of words) {
      if (w in this.vocab) {
        ids.push(Number(this.vocab[w]));
      } else if (learnNew) {
        const id = this.nextId++;
        this.vocab[w] = id;
        this.reverse[id] = w;
        ids.push(id);
        changed = true;
      } else {
        ids.push(this.vocab["<UNK>"] ?? this.special["<UNK>"]);
      }
    }
    ids.push(this.vocab["<EOS>"] ?? this.special["<EOS>"]);
    if (changed) this.save();
    return ids;
  }

  
  decodeIds(ids) {
    this.load();
   
    if (!this.reverse || Object.keys(this.reverse).length === 0) {
      this.reverse = Object.fromEntries(Object.entries(this.vocab).map(([w, id]) => [Number(id), w]));
    }
    const words = ids.map(n => {
      const id = Number(n);
      return this.reverse[id] ?? "<UNK>";
    }).filter(w => !["<SOS>", "<EOS>", "<PAD>"].includes(w));
    return words.join(" ");
  }

  getVocab() {
    this.load();
    return this.vocab;
  }
}
