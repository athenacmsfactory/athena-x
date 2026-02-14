import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: './factory/.env' });

async function run() {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  console.log('Key:', key ? 'Present' : 'Missing');
  const res = await fetch('https://generativelanguage.googleapis.com/v1/models?key=' + key);
  const data = await res.json();
  console.log('Connection OK');
}
run();
