import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { config } from 'dotenv';
import jq from 'node-jq';

// Helper to ask for input
function ask(question, hidden = false) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    if (hidden) process.stdout.write(question);

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.trim());
        });

        if (hidden) {
            rl.input.on("data", (char) => {
                char = char + "";
                switch (char) {
                    case "\n":
                    case "\r":
                    case "\u0004":
                        break;
                    default:
                        process.stdout.clearLine();
                        process.stdout.cursorTo(0);
                        process.stdout.write(question + "*".repeat(rl.line.length));
                        break;
                }
            });
        }
    });
}

// Step 1: Copy sample_env -> .env and update keys
async function generateEnvIfMissing() {
    const envPath = path.join(process.cwd(), '.env');
    const samplePath = path.join(process.cwd(), 'sample_env');

    if (fs.existsSync(envPath)) {
        console.log('✅ .env already exists.');
        return;
    }

    if (!fs.existsSync(samplePath)) {
        console.error('❌ sample_env file not found.');
        process.exit(1);
    }

    // Copy sample_env → .env
    fs.copyFileSync(samplePath, envPath);
    console.log('📄 sample_env copied to .env');

    // Ask for credentials
    const password = await ask('Enter API Secret: ', true);
    const username = await ask('Enter API Key: ');
    console.log();

    const base64Key = Buffer.from(`${username}:${password}`).toString('base64');

    // Detect codespace name
    const codespaceName = process.env.CODESPACE_NAME || 'your-codespace-name';
    const url = `https://${codespaceName}-8080.app.github.dev`;

    // Append dynamic values to .env
    fs.appendFileSync(envPath, `\nHOST_URL=${url}`);
    fs.appendFileSync(envPath, `\nTARGET_URL=${url}`);
    fs.appendFileSync(envPath, `\nHOST_KEY=Basic ${base64Key}`);
    fs.appendFileSync(envPath, `\nTARGET_KEY=Basic ${base64Key}`);

    console.log('✅ .env created with dynamic values.');
}

async function main() {
    await generateEnvIfMissing();
    config(); // load .env
}

main();