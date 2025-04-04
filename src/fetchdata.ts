import * as dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import fetch, { RequestInit } from "node-fetch";

interface ApiResponse {
  data: TtestHeaderData; 
}

const fetchData = async (): Promise<TtestHeaderData> => {
  try {
    const url = `${process.env.HOST_URL}/api/resource/${process.env.DOCTYPE}/${process.env.TESTCASE_TITLE}`;
    const key = process.env.HOST_KEY;

    if (!url || !key) {
      throw new Error("Missing required environment variables");
    }
    const myHeaders: Record<string, string> = {
      Authorization: key,
      Cookie: "full_name=Guest; sid=Guest; system_user=no; user_id=Guest; user_image=",
    };
    const requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const response = await fetch(url, requestOptions);
    const result = (await response.json()) as ApiResponse;
    delete result.data.json_response 
    // console.log("Logged result",result.data)
    const ltestHeader:TtestHeaderData = result.data 
    return ltestHeader; 

  } catch (error) {
    console.error("Error fetching data:", error);
    return null; 
  }
};
export default fetchData;

