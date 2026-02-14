import dotenv from 'dotenv';
dotenv.config({ path: './factory/.env' });

async function list() {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  console.log('--- V1 ---');
  const res1 = await fetch('https://generativelanguage.googleapis.com/v1/models?key=' + key);
  const data1 = await res1.json();
  console.table(data1.models?.map(m => m.name.replace('models/', '')) || []);

  console.log('--- V1BETA ---');
  const res2 = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + key);
  const data2 = await res2.json();
  console.table(data2.models?.map(m => m.name.replace('models/', '')) || []);
}
list();
