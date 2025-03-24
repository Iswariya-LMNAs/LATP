// import * as dotenv from "dotenv";
// dotenv.config({ path: "../.env" });

// import fetch, { RequestInit } from "node-fetch";


// const fetchData = async (): Promise<any> => {
//   try {
//     const url = `${process.env.URL}/api/resource/${process.env.DOCTYPE}/Quotation Workflow`;
//     const key = process.env.KEY;

//     if (!url || !key) {
//       throw new Error("Missing required environment variables");
//     }

//     const myHeaders: Record<string, string> = {
//       Authorization: key,
//       Cookie: "full_name=Guest; sid=Guest; system_user=no; user_id=Guest; user_image=",
//     };

//     const requestOptions: RequestInit = {
//       method: "GET",
//       headers: myHeaders,
//       redirect: "follow",
//     };

//     const response = await fetch(url, requestOptions);
//     const result = await response.json()
//       console.log(result);
//     return await response.json(); // Return parsed JSON data

//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return { error: error.message }; // Return error message if failed
//   }
// };

// export default fetchData;






import * as dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import fetch, { RequestInit } from "node-fetch";

interface ApiResponse {
  data: TtestHeaderData; 
}

const fetchData = async (): Promise<TtestHeaderData> => {
  try {
    // const url = `${process.env.URL}/api/resource/${process.env.DOCTYPE}/Quotation Workflow`;
    const url = `${process.env.URL}/api/resource/${process.env.DOCTYPE}/ertyu`;
    const key = process.env.KEY;

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
    // console.log(result.data);
    const ltestHeader:TtestHeaderData = result.data 
    return ltestHeader; 

  } catch (error) {
    console.error("Error fetching data:", error);
    return null; 
  }
};

export default fetchData;
