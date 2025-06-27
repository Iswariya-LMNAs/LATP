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
    const username = await ask('Enter Auth Username: ');
    const password = await ask('Enter Auth Password: ', true);
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

    const REPO_NAME = "lens-test-pilot-config";
    const repoPath = path.join(process.cwd(), REPO_NAME);
    if (!fs.existsSync(repoPath)) {
        try {
            execSync(`git clone -b develop https://github.com/lmnaslimited/${REPO_NAME}.git`, { stdio: 'ignore' });
        } catch (error) {
            console.error(`❌ Failed to clone ${REPO_NAME}`, error);
            process.exit(1);
        }
    }

    const { HOST_URL, HOST_KEY } = process.env;
    if (!HOST_URL || !HOST_KEY) {
        console.error('❌ HOST_URL or HOST_KEY missing from .env');
        process.exit(1);
    }

    const siteDetailsDir = path.join(repoPath, 'document/Site Details');
    const testConfigFile = path.join(repoPath, 'document/Test Case Configurator/Sample Test.json');

    if (!fs.existsSync(siteDetailsDir)) {
        console.error('❌ Site Details directory does not exist');
        process.exit(1);
    }

    const hostSiteJson = path.join(siteDetailsDir, 'host-site.json');

    try {
        const updatedHostSite = await jq.run(
            `.site_name = "${HOST_URL}" | .authorization_key = "${HOST_KEY}"`,
            hostSiteJson, { input: 'file', output: 'json' }
        );
        fs.writeFileSync(hostSiteJson, JSON.stringify(updatedHostSite, null, 2));

        const updatedTestConfig = await jq.run(
            `.site = "${HOST_URL}"`,
            testConfigFile, { input: 'file', output: 'json' }
        );
        fs.writeFileSync(testConfigFile, JSON.stringify(updatedTestConfig, null, 2));

        console.log('✅ JSON files updated successfully.');
    } catch (err) {
        console.error('❌ Error during JSON updates:', err);
    }
}

main();