import path from 'path';
import fs from 'fs';

/**
 * Utility om het pad naar een logbestand te genereren in de centrale output map.
 * @param {string} scriptName - De naam van het script/proces.
 * @returns {string} - Het volledige pad naar het logbestand.
 */
export function getLogPath(scriptName) {
    const root = process.cwd();
    const logDir = path.resolve(root, 'output/logs');
    
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return path.join(logDir, `${timestamp}_${scriptName}.log`);
}

/**
 * Helper voor scripts om direct naar een centrale log te schrijven (append).
 */
export function logToFile(scriptName, message) {
    const logPath = getLogPath(scriptName);
    const time = new Date().toLocaleTimeString();
    fs.appendFileSync(logPath, `[${time}] ${message}\n`);
}
