import express from "express";
import cors from "cors";
import multer from "multer";
import csvToJson from "convert-csv-to-json";

const app = express();
const port = process.env.PORT ?? 3000;

const storage = multer.memoryStorage(); // store the file in memory
const upload = multer({ storage }); // configure multer

let userData: Array<Record<string, string>> = []; // store the user data in memory
app.use(cors()); // Enable CORS

app.post("/api/files", upload.single("file"), async (req, res) => {
  // extract the file from the request
  const { file } = req;
  // validate the file
  if (!file) {
    return res.status(500).json({ message: "File is required" });
  }
  // validate the mime type of the file(csv)
  if (file.mimetype !== "text/csv") {
    return res.status(500).json({ message: "Invalid file type" });
  }

  let json: Array<Record<string, string>> = [];

  try {
    // transform the file (Buffer) to a string
    const csv = Buffer.from(file.buffer).toString("utf-8"); // convert the buffer to a string
    // transform the string to (JSON)
    json = csvToJson.fieldDelimiter(",").csvStringToJson(csv);
  } catch (error) {
    return res.status(500).json({ message: "Invalid file content" });
  }

  // store the JSON data in memory
  userData = json;

  // return the JSON data
  return res
    .status(200)
    .json({ data: json, message: "File uploaded successfully" });
});

app.get("/api/users", async (req, res) => {
  // extract the query params from the request
  const { query } = req.query;
  // validate the query params
  if (!query) {
    return res.status(500).json({ message: "Query is required" });
  }
  // fetch the data from the database (MongoDB) or memory based on the query params
  const search = query.toString().toLowerCase(); // convert the query to lowercase for case-insensitive search
  const data = userData.filter((user) =>
    Object.values(user).some((value) => value.toLowerCase().includes(search))
  );
  // return the JSON data based on the query params
  return res.status(200).json({ data });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
