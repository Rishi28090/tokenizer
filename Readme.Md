CLI Tokenizer
A simple Command Line Tokenizer in Node.js that can train, encode, and decode text.
It saves the vocabulary to vocab.json so encoding and decoding always match.

📦 Features
Train: Build vocabulary from any text file or input text.

Encode: Convert text into token IDs.

Decode: Convert token IDs back to text.

Vocabulary is saved automatically to vocab.json.

🚀 Installation
bash
Copy
Edit
# Clone or download the project
git clone <your-repo-url>
cd cli-tokenizer

# Install dependencies
npm install
📄 Usage
bash
Copy
Edit
node cli.js train <file-path>
node cli.js encode "<your text here>"
node cli.js decode "[1, 2, 3]"
1️⃣ Train
Train the tokenizer using a text file:

bash
Copy
Edit
node cli.js train sample.txt
Reads the text file.

Builds a vocabulary of unique words.

Saves it to vocab.json.

2️⃣ Encode
Convert text into token IDs:

bash
Copy
Edit
node cli.js encode "hello world"
Example output:

less
Copy
Edit
Encoded IDs: [2, 5, 3]
3️⃣ Decode
Convert token IDs back to text:

bash
Copy
Edit
node cli.js decode "[2, 5, 3]"
Example output:

scss
Copy
Edit
Decoded Text: hello world
📂 File Structure
pgsql
Copy
Edit
cli-tokenizer/
│
├── cli.js        # Main CLI script
├── vocab.json    # Vocabulary file (auto-generated after training)
├── package.json
└── sample.txt    # Example text for training
🛠 Notes
Special tokens:

<PAD> = 0

<UNK> = 1

<SOS> = 2

<EOS> = 3

Train before encoding or decoding.

Vocabulary is stored in vocab.json and reused automatically.

