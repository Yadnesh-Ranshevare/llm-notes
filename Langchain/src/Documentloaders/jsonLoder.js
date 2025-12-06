import { JSONLoader } from "@langchain/classic/document_loaders/fs/json";

const Path = "./src/Documentloaders/docs/JSONLoder.json";

const loader = new JSONLoader(Path);

const docs = await loader.load();
console.log({ docs });

// output
/*
[
  Document {
    pageContent: 'This is a sentence.',
    metadata: { source: 'example.json', line: 1 }
  },
  Document {
    pageContent: 'This is another sentence.',
    metadata: { source: 'example.json', line: 2 }
  },
  Document {
    pageContent: 'This is a sentence nested in an object.',
    metadata: { source: 'example.json', line: 3 }
  },
  Document {
    pageContent: 'This is another sentence nested in an object.',
    metadata: { source: 'example.json', line: 4 }
  }
]
*/