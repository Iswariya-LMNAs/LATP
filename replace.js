import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import jq from 'node-jq';
import { config } from 'dotenv';
// Load environment variables
config();
// Clone the repo if it does not exist
const REPO_NAME = "lens-test-pilot-config";
const repoPath = path.join(process.cwd(), REPO_NAME);
if (!fs.existsSync(repoPath)) {
    try {
        execSync(`git clone -b develop https://github.com/lmnaslimited/${REPO_NAME}.git`, { stdio: 'ignore' });
    } catch (error) {
        console.error(`:x: Failed to clone ${REPO_NAME}`, error);
        process.exit(1);
    }
}
// Load HOST_URL and HOST_KEY
const HOST_URL = process.env.HOST_URL;
const HOST_KEY = process.env.HOST_KEY;
if (!HOST_URL || !HOST_KEY) {
    console.error(':x: HOST_URL or HOST_KEY not set in .env');
    process.exit(1);
}
// Define directories and file paths
const siteDetailsDir = path.join(repoPath, 'document/Site Details');
const testConfigFile = path.join(repoPath, 'document/Test Case Configurator/Sample Test.json');
// Ensure the target directory exists
if (!fs.existsSync(siteDetailsDir)) {
    console.error(':x: Site Details directory does not exist');
    process.exit(1);
}
// Define file path
const hostSiteJson = path.join(siteDetailsDir, 'host-site.json');
// Read and process host-site.json using node-jq
jq.run(
    `.site_name = "${HOST_URL}" | .authorization_key = "${HOST_KEY}"`,
    hostSiteJson, { input: 'file', output: 'json' }
).then((output) => {
    // Write the modified content back to host-site.json itself
    fs.writeFileSync(hostSiteJson, JSON.stringify(output, null, 2));
    // Update Sample Test.json with the new site URL
    return jq.run(
        `.site = "${HOST_URL}"`,
        testConfigFile, { input: 'file', output: 'json' }
    );
}).then((updatedTestConfig) => {
    fs.writeFileSync(testConfigFile, JSON.stringify(updatedTestConfig, null, 2));
}).catch((err) => {
    console.error(':x: Error during JSON updates:', err);
});