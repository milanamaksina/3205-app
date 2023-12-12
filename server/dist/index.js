"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_validator_1 = require("express-validator");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const PORT = process.env.PORT || 3001;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({ credentials: true }));
function readUsersData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dataPath = path.join(__dirname, "..", "src", "users.json");
            return JSON.parse(fs.readFileSync(dataPath, "utf8"));
        }
        catch (error) {
            console.error("Error reading users:", error);
            return [];
        }
    });
}
let lastRequestTimeout;
app.post("/search", [(0, express_validator_1.body)("email").isEmail().withMessage("Invalid email format")], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("req", req);
    if (lastRequestTimeout) {
        clearTimeout(lastRequestTimeout);
    }
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const usersData = yield readUsersData();
        const { email, number } = req.body;
        lastRequestTimeout = setTimeout(() => {
            const filteredUsers = usersData === null || usersData === void 0 ? void 0 : usersData.filter((user) => {
                if (email && user.email !== email) {
                    return false;
                }
                if (number && user.number !== number) {
                    return false;
                }
                return true;
            });
            res.json(filteredUsers);
        }, 5000);
    }
    catch (error) {
        console.error("Error processing request:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
