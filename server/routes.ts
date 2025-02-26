// import type { Express } from "express";
// import { createServer } from "http";
// import { storage } from "./storage";
// import { insertMessageSchema } from "@shared/schema";
// import { z } from "zod";
// import type { IStorage } from "./storage";

// function scoreDocument(doc: any, question: string): number {
//   const questionLower = question.toLowerCase();
//   const keywords = questionLower.split(' ').filter(word =>
//     !['how', 'to', 'do', 'i', 'can', 'you', 'the', 'in'].includes(word)
//   );

//   let score = 0;

//   // Title match gives higher score
//   if (doc.title.toLowerCase().includes(questionLower)) {
//     score += 5;
//   }

//   // Count matching keywords in title and content
//   keywords.forEach(keyword => {
//     if (doc.title.toLowerCase().includes(keyword)) score += 3;
//     if (doc.content.toLowerCase().includes(keyword)) score += 1;
//   });

//   // Bonus for "how to" content
//   if (doc.content.toLowerCase().includes('steps') ||
//       doc.content.toLowerCase().includes('guide') ||
//       doc.content.toLowerCase().includes('tutorial')) {
//     score += 2;
//   }

//   return score;
// }

// function extractHowToSteps(content: string): string[] {
//   const steps: string[] = [];
//   const lines = content.split('\n');

//   for (const line of lines) {
//     // Match lines that start with numbers or bullet points
//     const match = line.match(/^\d+[\.\)][\s\t]*(.+)|^[\-\*][\s\t]*(.+)/);
//     if (match) {
//       // Get the step content without the number/bullet
//       const stepContent = match[1] || match[2];
//       if (stepContent) {
//         steps.push(stepContent.trim());
//       }
//     }
//   }

//   return steps;
// }

// async function addSampleDocumentation(storage: IStorage) {
//   const docs = [
//     {
//       cdp: "segment",
//       title: "Setting up a New Source in Segment",
//       content: `Follow these steps to set up a new source in Segment:
// 1. Log in to your Segment workspace
// 2. Click on 'Sources' in the left navigation
// 3. Click the 'Add Source' button
// 4. Search for your desired source type
// 5. Select the source and click 'Configure'
// 6. Enter the required configuration details
// 7. Enable any desired settings
// 8. Click 'Add Source' to complete the setup`,
//       url: "https://segment.com/docs/connections/sources/"
//     },
//     {
//       cdp: "segment",
//       title: "Advanced Segment Configuration",
//       content: `Advanced configuration options in Segment:
// 1. Set up custom tracking plans
// 2. Configure source filters and transformations
// 3. Implement custom destination settings
// 4. Set up user ID resolution rules
// 5. Configure data retention policies
// 6. Set up real-time event streaming`,
//       url: "https://segment.com/docs/connections/sources/catalog/"
//     },
//     {
//       cdp: "mparticle",
//       title: "Creating a User Profile in mParticle",
//       content: `To create a user profile in mParticle:
// 1. Navigate to the Users section
// 2. Click 'Create New User Profile'
// 3. Enter the required user information
// 4. Configure identity mappings
// 5. Set up user attributes
// 6. Save the profile configuration`,
//       url: "https://docs.mparticle.com/guides/platform-guide/users/"
//     },
//     {
//       cdp: "mparticle",
//       title: "Advanced mParticle Features",
//       content: `Advanced mParticle capabilities:
// 1. Set up real-time audience segmentation
// 2. Configure custom data transformations
// 3. Implement advanced identity resolution
// 4. Set up cross-platform data collection
// 5. Configure real-time data validation rules`,
//       url: "https://docs.mparticle.com/guides/platform-guide/advanced/"
//     },
//     {
//       cdp: "lytics",
//       title: "Building an Audience Segment in Lytics",
//       content: `Steps to create an audience segment:
// 1. Go to Audiences in the main menu
// 2. Click 'Create New Audience'
// 3. Define segment criteria using behavioral data
// 4. Add user attributes and filters
// 5. Preview the audience size
// 6. Name and save your segment
// 7. Monitor segment population`,
//       url: "https://docs.lytics.com/guide/audiences/"
//     },
//     {
//       cdp: "zeotap",
//       title: "Integrating Data with Zeotap",
//       content: `Follow this guide to integrate your data:
// 1. Access the Data Integration section
// 2. Choose your data source type
// 3. Configure the connection settings
// 4. Map your data fields
// 5. Set up data validation rules
// 6. Test the integration
// 7. Deploy to production`,
//       url: "https://docs.zeotap.com/home/en-us/category/data-integration"
//     }
//   ];

//   // Clear storage first to avoid duplicates
//   for (const doc of docs) {
//     try {
//       await storage.createDocument(doc);
//       console.log(`Added documentation for ${doc.cdp}: ${doc.title}`);
//     } catch (error) {
//       console.error(`Failed to add documentation for ${doc.cdp}:`, error);
//     }
//   }
// }

// function isComparisonQuestion(question: string): boolean {
//   const compareKeywords = ['compare', 'difference', 'versus', 'vs', 'better'];
//   return compareKeywords.some(keyword => question.toLowerCase().includes(keyword));
// }

// function isIrrelevantQuestion(question: string): boolean {
//   const cdpKeywords = ['cdp', 'segment', 'mparticle', 'lytics', 'zeotap', 'data', 'integration', 'profile', 'audience'];
//   const hasRelevantKeyword = cdpKeywords.some(keyword => question.toLowerCase().includes(keyword));
//   return !hasRelevantKeyword;
// }

// export async function registerRoutes(app: Express) {
//   const httpServer = createServer(app);

//   app.get("/api/messages", async (_req, res) => {
//     try {
//       const messages = await storage.getMessages();
//       res.json(messages);
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//       res.status(500).json({ error: "Failed to fetch messages" });
//     }
//   });

//   app.post("/api/chat", async (req, res) => {
//     try {
//       const question = z.string().parse(req.body.question);
//       const cdp = z.enum(["segment", "mparticle", "lytics", "zeotap"]).parse(
//         req.body.cdp,
//       );

//       // Handle irrelevant questions
//       if (isIrrelevantQuestion(question)) {
//         const message = await storage.createMessage({
//           question,
//           answer: "I'm specialized in answering questions about Customer Data Platforms (CDPs). Please ask me something about Segment, mParticle, Lytics, or Zeotap, and I'll be happy to help!",
//           cdp,
//           sources: [],
//         });
//         return res.json(message);
//       }

//       // Handle comparison questions differently
//       if (isComparisonQuestion(question)) {
//         const allDocs = await Promise.all([
//           storage.searchDocuments("segment", question),
//           storage.searchDocuments("mparticle", question),
//           storage.searchDocuments("lytics", question),
//           storage.searchDocuments("zeotap", question),
//         ]);

//         const comparisons = allDocs
//           .flat()
//           .map(doc => ({ ...doc, score: scoreDocument(doc, question) }))
//           .filter(doc => doc.score > 0)
//           .sort((a, b) => b.score - a.score)
//           .slice(0, 4);

//         if (comparisons.length < 2) {
//           const message = await storage.createMessage({
//             question,
//             answer: "I don't have enough information to make a detailed comparison. Try asking about specific features or capabilities of individual CDPs first.",
//             cdp,
//             sources: [],
//           });
//           return res.json(message);
//         }

//         const answer = `Here's a comparison based on the documentation:\n\n${
//           comparisons.map(doc => `${doc.title}:\n${doc.content}`).join('\n\n')
//         }`;

//         const message = await storage.createMessage({
//           question,
//           answer,
//           cdp,
//           sources: comparisons.map(doc => ({
//             title: doc.title,
//             url: doc.url
//           })),
//         });
//         return res.json(message);
//       }

//       console.log(`Processing question for ${cdp}: ${question}`);

//       // Regular question handling
//       const relevantDocs = await storage.searchDocuments(cdp, question);
//       console.log(`Found ${relevantDocs.length} relevant documents for ${cdp}`);

//       const scoredDocs = relevantDocs
//         .map(doc => ({ ...doc, score: scoreDocument(doc, question) }))
//         .filter(doc => doc.score > 0)
//         .sort((a, b) => b.score - a.score)
//         .slice(0, 3);

//       if (scoredDocs.length === 0) {
//         const message = await storage.createMessage({
//           question,
//           answer: "I couldn't find specific information about that in the documentation. Could you please rephrase your question or try asking about a different topic?",
//           cdp,
//           sources: [],
//         });
//         return res.json(message);
//       }

//       let answer = '';
//       const isHowToQuestion = question.toLowerCase().includes('how to') ||
//                            question.toLowerCase().startsWith('how do i');

//       if (isHowToQuestion) {
//         answer = "Here's how you can do that:\n\n";

//         scoredDocs.forEach((doc) => {
//           const steps = extractHowToSteps(doc.content);
//           if (steps.length > 0) {
//             answer += `From ${doc.title}:\n`;
//             steps.forEach((step, i) => answer += `${i + 1}. ${step}\n`);
//             answer += '\n';
//           } else {
//             // If no clear steps found, include relevant content
//             answer += `${doc.title}:\n${doc.content}\n\n`;
//           }
//         });
//       } else {
//         // For non-how-to questions, format response differently
//         answer = scoredDocs.map(doc => 
//           `${doc.title}:\n${doc.content}`
//         ).join('\n\n');
//       }

//       const sources = scoredDocs.map(doc => ({
//         title: doc.title,
//         url: doc.url
//       }));

//       const message = await storage.createMessage({
//         question,
//         answer,
//         cdp,
//         sources,
//       });

//       res.json(message);
//     } catch (error) {
//       console.error("Error processing chat:", error);
//       if (error instanceof z.ZodError) {
//         res.status(400).json({ error: "Invalid request format" });
//       } else {
//         res.status(500).json({ error: "Failed to process your question" });
//       }
//     }
//   });

//   await addSampleDocumentation(storage);
//   return httpServer;
// }

import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertMessageSchema } from "@shared/schema";
import { z } from "zod";
import type { IStorage } from "./storage";

function scoreDocument(doc: any, question: string): number {
  const questionLower = question.toLowerCase();
  const keywords = questionLower.split(' ').filter(word =>
    !['how', 'to', 'do', 'i', 'can', 'you', 'the', 'in'].includes(word)
  );

  let score = 0;

  // Title match gives higher score
  if (doc.title.toLowerCase().includes(questionLower)) {
    score += 5;
  }

  // Count matching keywords in title and content
  keywords.forEach(keyword => {
    if (doc.title.toLowerCase().includes(keyword)) score += 3;
    if (doc.content.toLowerCase().includes(keyword)) score += 1;
  });

  // Bonus for "how to" content
  if (doc.content.toLowerCase().includes('steps') ||
      doc.content.toLowerCase().includes('guide') ||
      doc.content.toLowerCase().includes('tutorial')) {
    score += 2;
  }

  return score;
}

function extractHowToSteps(content: string): string[] {
  const steps: string[] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    // Match lines that start with numbers or bullet points
    const match = line.match(/^\d+[\.\)][\s\t]*(.+)|^[\-\*][\s\t]*(.+)/);
    if (match) {
      // Get the step content without the number/bullet
      const stepContent = match[1] || match[2];
      if (stepContent) {
        steps.push(stepContent.trim());
      }
    }
  }

  return steps;
}

async function addSampleDocumentation(storage: IStorage) {
  const docs = [
    {
      cdp: "segment",
      title: "Setting up a New Source in Segment",
      content: `Follow these steps to set up a new source in Segment:
1. Log in to your Segment workspace
2. Click on 'Sources' in the left navigation
3. Click the 'Add Source' button
4. Search for your desired source type
5. Select the source and click 'Configure'
6. Enter the required configuration details
7. Enable any desired settings
8. Click 'Add Source' to complete the setup`,
      url: "https://segment.com/docs/connections/sources/"
    },
    {
      cdp: "segment",
      title: "Advanced Segment Configuration",
      content: `Advanced configuration options in Segment:
1. Set up custom tracking plans
2. Configure source filters and transformations
3. Implement custom destination settings
4. Set up user ID resolution rules
5. Configure data retention policies
6. Set up real-time event streaming`,
      url: "https://segment.com/docs/connections/sources/catalog/"
    },
    {
      cdp: "mparticle",
      title: "Creating a User Profile in mParticle",
      content: `To create a user profile in mParticle:
1. Navigate to the Users section
2. Click 'Create New User Profile'
3. Enter the required user information
4. Configure identity mappings
5. Set up user attributes
6. Save the profile configuration`,
      url: "https://docs.mparticle.com/guides/platform-guide/users/"
    },
    {
      cdp: "mparticle",
      title: "Advanced mParticle Features",
      content: `Advanced mParticle capabilities:
1. Set up real-time audience segmentation
2. Configure custom data transformations
3. Implement advanced identity resolution
4. Set up cross-platform data collection
5. Configure real-time data validation rules`,
      url: "https://docs.mparticle.com/guides/platform-guide/advanced/"
    },
    {
      cdp: "lytics",
      title: "Setting up Lytics CDP",
      content: `Follow these steps to set up Lytics:
1. Sign up for a Lytics account at dashboard.lytics.com
2. Create your first project workspace
3. Install the Lytics tag in your website's <head> section
4. Configure your data sources in the Integration menu
5. Set up user identity resolution rules
6. Create your first audience segment
7. Test data collection using the debugger
8. Set up your first campaign`,
      url: "https://docs.lytics.com/guide/getting-started/"
    },
    {
      cdp: "lytics",
      title: "Building an Audience Segment in Lytics",
      content: `Steps to create an audience segment:
1. Go to Audiences in the main menu
2. Click 'Create New Audience'
3. Define segment criteria using behavioral data
4. Add user attributes and filters
5. Preview the audience size
6. Name and save your segment
7. Monitor segment population`,
      url: "https://docs.lytics.com/guide/audiences/"
    },
    {
      cdp: "zeotap",
      title: "Integrating Data with Zeotap",
      content: `Follow this guide to integrate your data:
1. Access the Data Integration section
2. Choose your data source type
3. Configure the connection settings
4. Map your data fields
5. Set up data validation rules
6. Test the integration
7. Deploy to production`,
      url: "https://docs.zeotap.com/home/en-us/category/data-integration"
    }
  ];

  // Clear storage first to avoid duplicates
  for (const doc of docs) {
    try {
      await storage.createDocument(doc);
      console.log(`Added documentation for ${doc.cdp}: ${doc.title}`);
    } catch (error) {
      console.error(`Failed to add documentation for ${doc.cdp}:`, error);
    }
  }
}

function isComparisonQuestion(question: string): boolean {
  const compareKeywords = ['compare', 'difference', 'versus', 'vs', 'better'];
  return compareKeywords.some(keyword => question.toLowerCase().includes(keyword));
}

function isIrrelevantQuestion(question: string): boolean {
  const cdpKeywords = ['cdp', 'segment', 'mparticle', 'lytics', 'zeotap', 'data', 'integration', 'profile', 'audience'];
  const hasRelevantKeyword = cdpKeywords.some(keyword => question.toLowerCase().includes(keyword));
  return !hasRelevantKeyword;
}

export async function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  app.get("/api/messages", async (_req, res) => {
    try {
      const messages = await storage.getMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const question = z.string().parse(req.body.question);
      const cdp = z.enum(["segment", "mparticle", "lytics", "zeotap"]).parse(
        req.body.cdp,
      );

      // Handle irrelevant questions
      if (isIrrelevantQuestion(question)) {
        const message = await storage.createMessage({
          question,
          answer: "I'm specialized in answering questions about Customer Data Platforms (CDPs). Please ask me something about Segment, mParticle, Lytics, or Zeotap, and I'll be happy to help!",
          cdp,
          sources: [],
        });
        return res.json(message);
      }

      // Handle comparison questions differently
      if (isComparisonQuestion(question)) {
        const allDocs = await Promise.all([
          storage.searchDocuments("segment", question),
          storage.searchDocuments("mparticle", question),
          storage.searchDocuments("lytics", question),
          storage.searchDocuments("zeotap", question),
        ]);

        const comparisons = allDocs
          .flat()
          .map(doc => ({ ...doc, score: scoreDocument(doc, question) }))
          .filter(doc => doc.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 4);

        if (comparisons.length < 2) {
          const message = await storage.createMessage({
            question,
            answer: "I don't have enough information to make a detailed comparison. Try asking about specific features or capabilities of individual CDPs first.",
            cdp,
            sources: [],
          });
          return res.json(message);
        }

        const answer = `Here's a comparison based on the documentation:\n\n${
          comparisons.map(doc => `${doc.title}:\n${doc.content}`).join('\n\n')
        }`;

        const message = await storage.createMessage({
          question,
          answer,
          cdp,
          sources: comparisons.map(doc => ({
            title: doc.title,
            url: doc.url
          })),
        });
        return res.json(message);
      }

      console.log(`Processing question for ${cdp}: ${question}`);

      // Regular question handling
      const relevantDocs = await storage.searchDocuments(cdp, question);
      console.log(`Found ${relevantDocs.length} relevant documents for ${cdp}`);

      const scoredDocs = relevantDocs
        .map(doc => ({ ...doc, score: scoreDocument(doc, question) }))
        .filter(doc => doc.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      if (scoredDocs.length === 0) {
        const message = await storage.createMessage({
          question,
          answer: "I couldn't find specific information about that in the documentation. Could you please rephrase your question or try asking about a different topic?",
          cdp,
          sources: [],
        });
        return res.json(message);
      }

      let answer = '';
      const isHowToQuestion = question.toLowerCase().includes('how to') ||
                           question.toLowerCase().startsWith('how do i');

      if (isHowToQuestion) {
        answer = "Here's how you can do that:\n\n";

        scoredDocs.forEach((doc) => {
          const steps = extractHowToSteps(doc.content);
          if (steps.length > 0) {
            answer += `From ${doc.title}:\n`;
            steps.forEach((step, i) => answer += `${i + 1}. ${step}\n`);
            answer += '\n';
          } else {
            // If no clear steps found, include relevant content
            answer += `${doc.title}:\n${doc.content}\n\n`;
          }
        });
      } else {
        // For non-how-to questions, format response differently
        answer = scoredDocs.map(doc => 
          `${doc.title}:\n${doc.content}`
        ).join('\n\n');
      }

      const sources = scoredDocs.map(doc => ({
        title: doc.title,
        url: doc.url
      }));

      const message = await storage.createMessage({
        question,
        answer,
        cdp,
        sources,
      });

      res.json(message);
    } catch (error) {
      console.error("Error processing chat:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid request format" });
      } else {
        res.status(500).json({ error: "Failed to process your question" });
      }
    }
  });

  await addSampleDocumentation(storage);
  return httpServer;
}