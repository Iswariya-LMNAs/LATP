import jq from 'node-jq';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

// Load the .env variables
const HOST_URL = process.env.HOST_URL;
const HOST_KEY = process.env.HOST_KEY;

if (!HOST_URL || !HOST_KEY) {
    console.error('❌ HOST_URL or HOST_KEY not set in .env');
    process.exit(1);
}

// Sanitize HOST_URL for use in file names (removes invalid characters)
const sanitizedHostUrl = HOST_URL.replace(/[^a-zA-Z0-9._-]/g, '_');

// Define the directories and file paths
const baseDir = process.cwd();
const siteDetailsDir = path.join(baseDir, 'lens-test-pilot-config/document/Site Details');
const testConfigFile = path.join(baseDir, 'lens-test-pilot-config/document/Test Case Configurator/Sample Test.json');

// Ensure the target directory exists
if (!fs.existsSync(siteDetailsDir)) {
    console.error('❌ Site Details directory does not exist');
    process.exit(1);
}

// Define file paths
const targetJson = path.join(siteDetailsDir, `${sanitizedHostUrl}.json`);
const hostSiteJson = path.join(siteDetailsDir, 'host-site.json');

// Read and process host-site.json using node-jq
jq.run(
    `.site_name = "${HOST_URL}" | .authorization_key = "${HOST_KEY}"`,
    hostSiteJson, { input: 'file', output: 'json' }
).then((output) => {
    // Write the modified content to the new file
    fs.writeFileSync(targetJson, JSON.stringify(output, null, 2));

    // Update Sample Test.json with the new site URL
    jq.run(
        `.site = "${HOST_URL}"`,
        testConfigFile, { input: 'file', output: 'json' }
    ).then((updatedTestConfig) => {
        fs.writeFileSync(testConfigFile, JSON.stringify(updatedTestConfig, null, 2));
    }).catch((err) => {
        console.error('❌ Error updating Sample Test.json', err);
    });
}).catch((err) => {
    console.error('❌ Error processing host-site.json', err);
});
