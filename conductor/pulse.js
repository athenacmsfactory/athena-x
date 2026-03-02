import fs from 'fs';
const role = process.argv[2] || 'unknown';
const id = process.argv[3] || 'unknown';

// Sense for PINGs (Lead) or DIRECTIVES/APPROVALS (Agent)
const targetTag = (role === 'lead') ? '[PING]' : `[DIRECTIVE] Agent (${id})`;
const approvalTag = (role === 'agent') ? `[APPROVED] Agent (${id})` : '[PROPOSAL]';
const globalTag = '[DIRECTIVE] ALL AGENTS';

console.log(`📡 Pulse active for ${role.toUpperCase()}: ${id} (v2.3)`);
console.log(`📂 Monitoring conductor/execution_log.md for: ${targetTag} or ${approvalTag}`);

let lastContent = '';
if (fs.existsSync('conductor/execution_log.md')) {
  lastContent = fs.readFileSync('conductor/execution_log.md', 'utf8');
}

const interval = setInterval(() => {
  if (fs.existsSync('conductor/execution_log.md')) {
    const currentContent = fs.readFileSync('conductor/execution_log.md', 'utf8');
    if (currentContent !== lastContent) {
      const diff = currentContent.replace(lastContent, '').trim();
      
      // Match the relevant sensing tags
      if (diff.includes(targetTag) || 
          diff.includes(approvalTag) || 
          (role === 'agent' && diff.includes(globalTag))) {
        console.log(`\n🔔 SIGNAL DETECTED:\n${diff}`);
        console.log(`🛑 Pulse stopping for synchronization.`);
        clearInterval(interval);
        process.exit(0);
      }
      lastContent = currentContent;
    }
  }
}, 1000);
