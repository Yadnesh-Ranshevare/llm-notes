import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";

const tool = new WikipediaQueryRun({
  topKResults: 3,
  maxDocContentLength: 200,
});

const res = await tool.invoke("LangChain");

console.log(res);