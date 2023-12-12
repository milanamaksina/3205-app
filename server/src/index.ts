import express from "express";
import cors from "cors";
import { body, validationResult } from "express-validator";
import * as fs from "fs";
import * as path from "path";
import { Request } from "express-validator/src/base";

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());
app.use(cors({ credentials: true }));

async function readUsersData() {
  try {
    const dataPath = path.join(__dirname, "..", "src", "users.json");
    return JSON.parse(fs.readFileSync(dataPath, "utf8"));
  } catch (error: any) {
    console.error("Error reading users:", error);
    return [];
  }
}

let lastRequestTimeout: string | number | NodeJS.Timeout | undefined;

app.post(
  "/search",
  [body("email").isEmail().withMessage("Invalid email format")],
  async (req: Request, res: any) => {
    console.log("req", req);
    if (lastRequestTimeout) {
      clearTimeout(lastRequestTimeout);
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const usersData = await readUsersData();
      const { email, number } = req.body;

      lastRequestTimeout = setTimeout(() => {
        const filteredUsers = usersData?.filter(
          (user: { email: any; number: any }) => {
            if (email && user.email !== email) {
              return false;
            }

            if (number && user.number !== number) {
              return false;
            }

            return true;
          }
        );

        res.json(filteredUsers);
      }, 5000);
    } catch (error: any) {
      console.error("Error processing request:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
