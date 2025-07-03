import * as fs from "fs";
import * as path from "path";
import fetch from "node-fetch";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type ApiResponse = {
    message: {
        test_run: any;
        master_data: any[];
    };
}

async function fetchAndSaveTestData() {
    try {
        const url = `${process.env.HOST_URL}/api/method/ai_test_pilot_handle_request?i_test_lab=${process.env.TEST_LAB}&i_action=get_test_data`;

        const response = await fetch(url, {
            headers: {
                Authorization: `${process.env.HOST_KEY}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }

        const jsonData = (await response.json()) as ApiResponse;

        if (!jsonData.message) {
            throw new Error("Invalid response structure: missing 'message' property");
        }

        const fixturesDir = path.resolve(__dirname, "../fixtures");
        if (!fs.existsSync(fixturesDir)) {
            fs.mkdirSync(fixturesDir, { recursive: true });
        }

        const filePath = path.join(fixturesDir, "testdata.json");

        fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), "utf-8");

    } catch (error) {
        console.error("❌ Error fetching and saving test data:", error);
        process.exit(1);
    }
}

fetchAndSaveTestData();