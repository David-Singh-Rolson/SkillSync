// // import fs from 'fs';
// // import path from 'path';

// // export const getAvailableTopics = () => {
// //   try {
// //     const filePath = path.resolve("ml-server", "topics.json"); // relative to root
// //     const data = fs.readFileSync(filePath, 'utf-8');
// //     const topics = JSON.parse(data);
// //     return topics;
// //   } catch (error) {
// //     console.error("Error reading topics.json:", error.message);
// //     return []; // fallback empty
// //   }
// // };

// import fs from 'fs';
// import path from 'path';

// export const getAvailableTopics = () => {
//   try {
//     const filePath = path.resolve(__dirname, "../../ml-server/topics.json");
//     const data = fs.readFileSync(filePath, 'utf-8');
//     const topics = JSON.parse(data);
//     return topics;
//   } catch (error) {
//     console.error("❌ Error reading topics.json:", error.message);
//     return []; // fallback: return empty list
//   }
// };

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ✅ ES module ke liye __dirname define kar rahe hain
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAvailableTopics = () => {
  try {
    const filePath = path.resolve(__dirname, "../../ml-server/topics.json");
    const data = fs.readFileSync(filePath, 'utf-8');
    const topics = JSON.parse(data);
    return topics;
  } catch (error) {
    console.error("❌ Error reading topics.json:", error.message);
    return []; // fallback: return empty list
  }
};