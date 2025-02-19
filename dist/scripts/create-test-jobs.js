"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_1 = require("../lib/mongodb");
var job_1 = __importDefault(require("../models/job"));
var user_1 = __importDefault(require("../models/user"));
function createTestJobs() {
    return __awaiter(this, void 0, void 0, function () {
        var employer, jobs, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, mongodb_1.connectDB)()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, user_1.default.findOne({ role: 'admin' })];
                case 2:
                    employer = _a.sent();
                    if (!employer) {
                        console.error('No admin user found. Please create an admin user first.');
                        process.exit(1);
                    }
                    // Delete existing jobs
                    return [4 /*yield*/, job_1.default.deleteMany({})];
                case 3:
                    // Delete existing jobs
                    _a.sent();
                    jobs = [
                        {
                            title: 'Real Estate Agent',
                            company: 'Affordable Housing Co.',
                            description: 'We are looking for an experienced real estate agent to join our team. The ideal candidate will have a strong track record in residential property sales and excellent communication skills.',
                            location: {
                                city: 'San Francisco',
                                state: 'CA',
                                country: 'USA',
                                type: 'hybrid'
                            },
                            requirements: [
                                'Valid real estate license',
                                '2+ years of experience in residential sales',
                                'Excellent communication and negotiation skills',
                                'Strong knowledge of local property market'
                            ],
                            salary: {
                                min: 50000,
                                max: 100000,
                                currency: 'USD'
                            },
                            employmentType: 'full-time',
                            experienceLevel: 'mid',
                            employer: employer._id,
                            status: 'active'
                        },
                        {
                            title: 'Property Manager',
                            company: 'Affordable Housing Co.',
                            description: 'Seeking a detail-oriented property manager to oversee our residential properties. Responsibilities include tenant relations, maintenance coordination, and financial reporting.',
                            location: {
                                city: 'Los Angeles',
                                state: 'CA',
                                country: 'USA',
                                type: 'onsite'
                            },
                            requirements: [
                                'Property management certification',
                                '3+ years of property management experience',
                                'Strong organizational and problem-solving skills',
                                'Experience with property management software'
                            ],
                            salary: {
                                min: 45000,
                                max: 75000,
                                currency: 'USD'
                            },
                            employmentType: 'full-time',
                            experienceLevel: 'mid',
                            employer: employer._id,
                            status: 'active'
                        },
                        {
                            title: 'Leasing Consultant',
                            company: 'Affordable Housing Co.',
                            description: 'Join our leasing team to help match residents with their perfect home. You will conduct property tours, process applications, and provide excellent customer service.',
                            location: {
                                city: 'New York',
                                state: 'NY',
                                country: 'USA',
                                type: 'onsite'
                            },
                            requirements: [
                                'High school diploma or equivalent',
                                'Previous sales or customer service experience',
                                'Strong interpersonal skills',
                                'Availability to work weekends'
                            ],
                            salary: {
                                min: 35000,
                                max: 55000,
                                currency: 'USD'
                            },
                            employmentType: 'full-time',
                            experienceLevel: 'entry',
                            employer: employer._id,
                            status: 'active'
                        }
                    ];
                    return [4 /*yield*/, job_1.default.insertMany(jobs)];
                case 4:
                    _a.sent();
                    console.log('Test jobs created successfully!');
                    process.exit(0);
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.error('Error creating test jobs:', error_1);
                    process.exit(1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
createTestJobs();
