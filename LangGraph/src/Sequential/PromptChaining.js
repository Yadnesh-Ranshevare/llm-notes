import "dotenv/config"
import { StateGraph, START, END } from "@langchain/langgraph"
import {z} from "zod"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const GraphState = z.object({
    topic: z.string(),
    outline: z.string(),
    blog: z.string(),
})

const graph = new StateGraph(GraphState);

const llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.LLM_API_KEY,
});

async function GenerateOutline(state){
    const outline = await llm.invoke(`Generate an outline for a blog post about ${state.topic}.`);
    state.outline = outline.content
    return state
}

graph.addNode("generate_outline", GenerateOutline);

async function GenerateBlog(state){
    const blog = await llm.invoke(`Generate a blog post about ${state.topic} with the outline ${state.outline}.`);
    state.blog = blog.content
    return state
}

graph.addNode("generate_blog", GenerateBlog);

graph.addEdge(START, "generate_outline");
graph.addEdge("generate_outline", "generate_blog");
graph.addEdge("generate_blog", END);

const workflow = graph.compile();

const initialState = {
    topic: "AI",
};

const res = await workflow.invoke(initialState);

console.log(res);


/*
{
  topic: 'AI',
  outline: "Here's a comprehensive outline for a blog post about AI, designed to be informative, engaging, and accessible to a general audience.\n" +
    '\n' +
    '---\n' +
    '\n' +
    '## Blog Post Outline: Unlocking the World of AI: Your Essential Guide\n' +
    '\n' +
    '**Target Audience:** General audience, tech enthusiasts, professionals curious about AI, students.\n' +
    '**Tone:** Informative, engaging, slightly futuristic, balanced (acknowledging both potential and challenges).\n' +
    '**Word Count Goal:** 1000-1500 words\n' +
    '\n' +
    '---\n' +
    '\n' +
    '### I. Catchy Title Options:\n' +
    '*   Unlocking the World of AI: Your Essential Guide\n' +
    '*   Beyond the Buzzword: What is AI and Why Does It Matter?\n' +
    '*   AI Demystified: Everything You Need to Know About Artificial Intelligence\n' +
    '*   The Future is Now: Navigating the Landscape of Artificial Intelligence\n' +
    '\n' +
    '---\n' +
    '\n' +
    '### II. Introduction (Approx. 150-200 words)\n' +
    `*   **A. Hook:** Start with a relatable scenario or common misconception about AI (e.g., "AI isn't just sci-fi robots..." or "From your phone's assistant to Netflix recommendations, AI is everywhere...").\n` +
    "*   **B. Define AI (Simply):** Briefly explain what Artificial Intelligence is in layman's terms – systems that can perform tasks requiring human-like intelligence.\n" +
    '*   **C. Why This Post Matters:** State the purpose – to demystify AI, break down its components, explore its impact, and look at its future.\n' +
    '*   **D. Thesis Statement:** AI is a transformative technology with immense potential and significant challenges, shaping our present and future in profound ways.\n' +
    '\n' +
    '---\n' +
    '\n' +
    '### III. What Exactly is AI? (The Core Concepts) (Approx. 200 words)\n' +
    '*   **A. A Simple Definition:** Artificial intelligence refers to the simulation of human intelligence in machines that are programmed to think like humans and mimic their actions.\n' +
    '*   **B. Key Characteristics:**\n' +
    '    *   Learning (from data)\n' +
    '    *   Problem-solving\n' +
    '    *   Decision-making\n' +
    '    *   Perception\n' +
    '    *   Language understanding\n' +
    '*   **C. Different Flavors of AI (Briefly):**\n' +
    '    *   **Narrow AI (ANI):** The AI we have today. excels at specific tasks (e.g., Siri, self-driving cars, Netflix recommendations).\n' +
    '    *   **General AI (AGI):** Hypothetical AI that can understand, learn, and apply intelligence to any intellectual task a human can (human-level intelligence).\n' +
    '    *   **Superintelligence (ASI):** Hypothetical AI that surpasses human intelligence in every aspect.\n' +
    '*   **D. Common Misconceptions to Clarify:** AI is not inherently conscious or sentient (yet).\n' +
    '\n' +
    '---\n' +
    '\n' +
    "### IV. A Glimpse into AI's Journey (Brief History & Evolution) (Approx. 150 words)\n" +
    '*   **A. Early Ideas:** Alan Turing (Turing Test), "thinking machines."\n' +
    '*   **B. The "AI Winters":** Periods of reduced funding and interest due to unmet expectations.\n' +
    '*   **C. The Resurgence (Modern AI Boom):**\n' +
    '    *   **Big Data:** Availability of massive datasets.\n' +
    '    *   **Computational Power:** Advances in hardware (GPUs).\n' +
    '    *   **Algorithm Breakthroughs:** Deep learning, neural networks.\n' +
    '    *   **Cloud Computing:** Accessible infrastructure.\n' +
    '\n' +
    '---\n' +
    '\n' +
    '### V. Where Do We See AI Today? (Real-World Applications) (Approx. 250 words)\n' +
    '*   **A. Everyday Life:**\n' +
    '    *   **Personal Assistants:** Siri, Alexa, Google Assistant\n' +
    '    *   **Recommendation Engines:** Netflix, Amazon, Spotify\n' +
    '    *   **Spam Filters & Fraud Detection:** Banking, email\n' +
    '    *   **Facial Recognition:** Unlocking phones, security\n' +
    '*   **B. Industry & Business:**\n' +
    '    *   **Healthcare:** Diagnostics, drug discovery, personalized treatment.\n' +
    '    *   **Automotive:** Self-driving cars, autonomous vehicles.\n' +
    '    *   **Finance:** Algorithmic trading, risk assessment.\n' +
    '    *   **Manufacturing:** Robotics, predictive maintenance.\n' +
    '    *   **Education:** Personalized learning, grading.\n' +
    '*   **C. Creative AI:**\n' +
    '    *   **Generative AI:** ChatGPT, DALL-E, Midjourney (creating text, images, code).\n' +
    '\n' +
    '---\n' +
    '\n' +
    '### VI. The Double-Edged Sword: Benefits & Challenges of AI (Approx. 300 words)\n' +
    '*   **A. The Immense Potential (Benefits):**\n' +
    '    *   **Efficiency & Productivity:** Automating repetitive tasks, optimizing processes.\n' +
    '    *   **Innovation:** Solving complex problems (climate change, disease).\n' +
    '    *   **Personalization:** Tailored experiences in various services.\n' +
    '    *   **Accessibility:** Assisting individuals with disabilities.\n' +
    '    *   **Data Analysis:** Extracting insights from vast amounts of data.\n' +
    '*   **B. The Crucial Concerns (Challenges & Ethical Dilemmas):**\n' +
    '    *   **Job Displacement:** Automation impacting certain industries.\n' +
    '    *   **Bias & Fairness:** Algorithms reflecting biases present in training data.\n' +
    '    *   **Privacy & Surveillance:** Data collection, facial recognition.\n' +
    '    *   **Ethical Use:** Accountability, transparency ("black box" problem), misuse (deepfakes).\n' +
    '    *   **Security Risks:** AI-powered cyberattacks.\n' +
    '    *   **The "Control Problem":** Concerns about superintelligent AI.\n' +
    '\n' +
    '---\n' +
    '\n' +
    "### VII. The Road Ahead: What's Next for AI? (Approx. 100 words)\n" +
    '*   **A. Continued Integration:** AI becoming even more embedded in our lives.\n' +
    '*   **B. Advancements in AGI Research:** While distant, ongoing efforts.\n' +
    '*   **C. Focus on Responsible AI:** Development of ethical guidelines, regulations, and safe practices.\n' +
    '*   **D. Human-AI Collaboration:** Augmenting human capabilities rather than replacing them.\n' +
    '\n' +
    '---\n' +
    '\n' +
    '### VIII. Conclusion (Approx. 100-150 words)\n' +
    '*   **A. Recap Key Points:** AI is a powerful, evolving tool with a broad spectrum of applications, offering incredible promise alongside significant challenges.\n' +
    '*   **B. Reiterate Thesis:** Its impact will continue to grow, making understanding and thoughtful engagement crucial.\n' +
    `*   **C. Final Thought/Call to Action:** Encourage readers to engage critically with AI, understand its potential and limitations, and participate in the ongoing conversation about its ethical development. "The future of AI is not just about technology; it's about the choices we make today."\n` +
    '\n' +
    '---\n' +
    '\n' +
    '### IX. Potential Visuals/Multimedia:\n' +
    '*   Infographics explaining AI types.\n' +
    '*   Images of AI applications (self-driving car, smart home devices, robots).\n' +
    '*   Charts showing AI growth/investment.\n' +
    '*   Illustrations of neural networks.\n' +
    '\n' +
    '---\n' +
    '\n' +
    '### X. Keywords for SEO:\n' +
    '*   Artificial Intelligence\n' +
    '*   What is AI\n' +
    '*   AI explained\n' +
    '*   Types of AI\n' +
    '*   AI applications\n' +
    '*   Future of AI\n' +
    '*   AI benefits\n' +
    '*   AI challenges\n' +
    '*   Ethical AI\n' +
    '*   Generative AI\n' +
    '*   Machine Learning\n' +
    '*   Deep Learning',
  blog: '## Unlocking the World of AI: Your Essential Guide\n' +
    '\n' +
    'Forget the menacing robots of sci-fi films for a moment. While those make for thrilling cinema, the reality of Artificial Intelligence (AI) is far more integrated into our daily lives – and often much more subtle. From the moment your smartphone suggests the next word in your text, to the personalized recommendations popping up on your streaming service, AI is silently shaping our world.\n' +
    '\n' +
    "At its core, AI refers to computer systems designed to simulate human intelligence. These systems can learn, solve problems, make decisions, and even understand language, mimicking cognitive functions we once thought exclusive to the human mind. Yet, for many, AI remains a buzzword shrouded in mystery, excitement, and sometimes, apprehension. This guide aims to demystify AI, breaking down its fundamental concepts, exploring its vast applications, and looking ahead to its future impact. We'll uncover how AI is not merely a technological advancement but a transformative force with immense potential and significant challenges, fundamentally reshaping our present and future.\n" +
    '\n' +
    '### What Exactly is AI? The Core Concepts\n' +
    '\n' +
    `At its heart, Artificial Intelligence (AI) is about creating machines that can "think" and "learn" in ways that resemble human cognition. It's not about replicating human consciousness, but rather about developing algorithms and systems that can perform tasks traditionally requiring human intelligence. Key characteristics of AI include its ability to learn from data (Machine Learning is a crucial subset of AI), solve complex problems, make informed decisions, perceive its environment (through sensors or data), and understand and generate human language.\n` +
    '\n' +
    'To truly understand AI, it helps to distinguish its "flavors":\n' +
    '\n' +
    '*   **Narrow AI (ANI):** Also known as "Weak AI," this is the AI we have today. It excels at specific tasks, often better than humans. Think of Siri, self-driving car navigation, or the recommendation engine suggesting your next binge-watch. ANI is powerful but limited to its trained domain.\n' +
    '*   **General AI (AGI):** "Strong AI" refers to hypothetical AI with human-level intelligence that can understand, learn, and apply knowledge across a wide range of tasks, just like a human. We are not there yet, and achieving AGI remains a significant scientific challenge.\n' +
    '*   **Superintelligence (ASI):** A hypothetical future state where AI surpasses human intelligence in virtually every aspect, from creativity to problem-solving. This concept is largely theoretical and often discussed in philosophical and ethical contexts.\n' +
    '\n' +
    "Crucially, it's important to clarify a common misconception: current AI (Narrow AI) is not conscious, sentient, or self-aware. It executes programmed functions, no matter how sophisticated they appear.\n" +
    '\n' +
    "### A Glimpse into AI's Journey: Brief History & Evolution\n" +
    '\n' +
    `The concept of "thinking machines" isn't new. Visionaries like Alan Turing pondered the possibility in the 1950s, proposing the "Turing Test" to determine if a machine could exhibit intelligent behavior indistinguishable from a human. Early AI research, though groundbreaking, often faced limitations in computational power and data availability.\n` +
    '\n' +
    `However, AI's journey has seen its share of "winters" – periods of reduced funding and skepticism when early promises outpaced technological capabilities. Expectations were high, but the technology wasn't quite ready to deliver on the ambitious visions of human-level intelligence.\n` +
    '\n' +
    'The current "AI spring" began in the early 21st century, fueled by several breakthroughs:\n' +
    '\n' +
    '*   **Big Data:** The explosion of digital information provided vast datasets for AI models to learn from, allowing them to identify complex patterns.\n' +      
    '*   **Computational Power:** Advances in hardware, particularly Graphics Processing Units (GPUs), offered the immense processing power needed for complex AI computations and training large models.\n' +
    '*   **Algorithm Breakthroughs:** Innovations in machine learning, especially deep learning and neural networks, unlocked new levels of performance in areas like image recognition and natural language processing.\n' +
    '*   **Cloud Computing:** Made these powerful resources and vast datasets accessible to researchers and developers worldwide, democratizing AI development.\n' +  
    '\n' +
    'These converging factors have propelled AI into its current golden age.\n' +
    '\n' +
    '### Where Do We See AI Today? Real-World Applications\n' +
    '\n' +
    'AI is no longer confined to research labs; it’s deeply embedded in our daily routines and transforming entire industries:\n' +
    '\n' +
    '**A. Everyday Life:**\n' +
    '*   **Personal Assistants:** Siri, Alexa, and Google Assistant respond to our voice commands, set alarms, and answer questions, making our lives more convenient.\n' +
    "*   **Recommendation Engines:** Whether you're choosing a movie on Netflix, a product on Amazon, or a song on Spotify, AI algorithms work behind the scenes to suggest items you'll love, based on your past behavior and preferences.\n" +
    '*   **Spam Filters & Fraud Detection:** AI tirelessly works to protect your inbox from unwanted messages and your bank account from fraudulent transactions, learning to identify suspicious patterns.\n' +
    '*   **Facial Recognition:** Used for unlocking your smartphone, tagging friends in photos, or enhancing security systems, AI-powered facial recognition is becoming ubiquitous.\n' +
    '\n' +
    '**B. Industry & Business:**\n' +
    '*   **Healthcare:** AI assists in diagnostics (e.g., analyzing medical images), accelerates drug discovery, and helps create personalized treatment plans based on patient data.\n' +
    '*   **Automotive:** Self-driving cars and advanced driver-assistance systems (ADAS) are powered by sophisticated AI that perceives the environment, makes decisions, and controls the vehicle.\n' +
    '*   **Finance:** Algorithmic trading executes high-frequency trades, while AI is used for risk assessment, fraud prevention, and personalized financial advice.\n' +
    '*   **Manufacturing:** Robotics perform complex tasks on assembly lines, and predictive maintenance systems use AI to analyze sensor data and prevent equipment failures.\n' +
    '*   **Education:** Personalized learning platforms adapt to individual student needs, offering tailored content and feedback, and AI can even assist with grading and administrative tasks.\n' +
    '\n' +
    '**C. Creative AI:**\n' +
    "*   A newer, astonishing frontier is **Generative AI**, exemplified by tools like ChatGPT, DALL-E, and Midjourney. These systems can create original text, stunning images from simple prompts, complex code, and even music, blurring the lines between machine output and human creativity. This subfield showcases AI's ability to not just process but *produce*.\n" +
    '\n' +
    '### The Double-Edged Sword: Benefits & Challenges of AI\n' +
    '\n' +
    'The transformative power of AI comes with a dual nature, offering both incredible opportunities and significant hurdles that demand careful consideration.\n' +  
    '\n' +
    '**A. The Immense Potential (Benefits):**\n' +
    '*   **Efficiency & Productivity:** AI automates repetitive, mundane, or dangerous tasks, freeing up human workers for more creative and strategic endeavors and optimizing countless processes across industries, leading to economic growth.\n' +
    '*   **Innovation:** AI is a powerful tool for scientific discovery, capable of analyzing vast datasets to solve complex global problems, from accelerating climate change research to developing new treatments for diseases.\n' +
    '*   **Personalization:** From tailored news feeds to custom learning experiences and highly specific medical treatments, AI delivers highly personalized services that cater to individual needs and preferences.\n' +
    '*   **Accessibility:** AI-powered tools can significantly assist individuals with disabilities, providing advanced screen readers, real-time translation services, voice control, and adaptive interfaces, enhancing independence.\n' +
    '*   **Data Analysis:** AI can process and extract meaningful insights from quantities of data far beyond human capacity, driving better decision-making in business, science, and governance.\n' +
    '\n' +
    '**B. The Crucial Concerns (Challenges & Ethical Dilemmas):**\n' +
    '*   **Job Displacement:** Automation, while boosting productivity, raises legitimate concerns about job losses in sectors where AI can perform tasks more cheaply or efficiently, necessitating workforce retraining and new social safety nets.\n' +
    '*   **Bias & Fairness:** AI systems learn from the data they are fed. If that data contains historical biases (e.g., in hiring, lending, or law enforcement), the AI will perpetuate and even amplify those biases, leading to unfair or discriminatory outcomes. Ensuring algorithmic fairness is a massive challenge.\n' +
    '*   **Privacy & Surveillance:** The extensive data collection required for AI training, coupled with advanced recognition technologies, raises significant privacy concerns and the potential for increased surveillance by both governments and corporations.\n' +
    `*   **Ethical Use & Accountability:** Determining who is responsible when AI makes a mistake or causes harm (the developer, the user, the AI itself?) is complex. The "black box" problem, where an AI's decision-making process is opaque, further complicates accountability. Misuse, such as creating realistic deepfakes for propaganda or manipulating public opinion, is also a serious threat.\n` +
    '*   **Security Risks:** As AI becomes more powerful and integral to infrastructure, it can be weaponized for sophisticated cyberattacks, autonomous warfare, or to disrupt critical systems.\n' +
    '*   **The "Control Problem":** Though largely theoretical for now, the long-term concern about superintelligent AI acting against human interests or goals remains a subject of intense debate among experts, urging caution in development.\n' +
    '\n' +
    "### The Road Ahead: What's Next for AI?\n" +
    '\n' +
    "The journey of AI is far from over. We can expect AI to become even more seamlessly integrated into every facet of our lives, transforming industries and personal experiences in ways we're just beginning to imagine. Research into Artificial General Intelligence (AGI) will co"... 1746 more characters
}

*/