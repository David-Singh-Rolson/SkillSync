import fs from 'fs';
import path from 'path';

export const getAvailableTopics = () => {
  try {
    const filePath = path.resolve("ml-server", "topics.json"); // relative to root
    const data = fs.readFileSync(filePath, 'utf-8');
    const topics = JSON.parse(data);
    return topics;
  } catch (error) {
    console.error("Error reading topics.json:", error.message);
    return []; // fallback empty
  }
};
