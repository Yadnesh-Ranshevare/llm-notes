import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";

const wiki = new WikipediaQueryRun({
  topKResults: 3,           // how many pages to fetch
  maxDocContentLength: 4000 // max characters from each page
});

const res = await wiki.invoke("LangChain");
console.log(res);
