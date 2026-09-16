const http = require("http");

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YWFhNDczYzczM2IyYWM1NDljNjdlMDkiLCJyb2xlIjoiRVZBTFVBVE9SIiwiaWF0IjoxNzg5NTQ3MTk4LCJleHAiOjE3OTAxNTE5OTh9.vcRnh-5mxVXPZGSBLtjBW7uWhqdwAB5xITgvj4ldJkA";
const submissionId = "6aaa52be18be7eb398928e16";

const testEndpoints = [
  { method: "GET", path: "/" },
  { method: "POST", path: `/api/evaluations/${submissionId}/ai-evaluate`, auth: true },
  { method: "GET", path: `/api/evaluations/${submissionId}/ai-evaluation`, auth: true },
  { method: "POST", path: `/api/ai-evaluations/${submissionId}`, auth: true },
  { method: "GET", path: `/api/ai-evaluations/${submissionId}`, auth: true }
];

async function runLiveVerification() {
  for (const ep of testEndpoints) {
    await new Promise((resolve) => {
      const headers = { "Content-Type": "application/json" };
      if (ep.auth) headers["Authorization"] = `Bearer ${token}`;

      const req = http.request({
        hostname: "127.0.0.1",
        port: 5000,
        path: ep.path,
        method: ep.method,
        headers
      }, (res) => {
        let body = "";
        res.on("data", (chunk) => body += chunk);
        res.on("end", () => {
          console.log(`[${res.statusCode}] ${ep.method} ${ep.path} -> ${body.slice(0, 120)}...`);
          resolve();
        });
      });

      req.on("error", (e) => {
        console.error(`Error on ${ep.path}:`, e.message);
        resolve();
      });

      if (ep.method === "POST") req.write("{}");
      req.end();
    });
  }
}

runLiveVerification();
