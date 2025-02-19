"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var jobSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        city: String,
        state: String,
        country: String,
        type: {
            type: String,
            enum: ['remote', 'onsite', 'hybrid'],
            required: true
        }
    },
    requirements: [String],
    salary: {
        min: Number,
        max: Number,
        currency: String
    },
    employmentType: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'internship'],
        required: true
    },
    experienceLevel: {
        type: String,
        enum: ['entry', 'mid', 'senior', 'executive'],
        required: true
    },
    employer: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'closed', 'draft'],
        default: 'active'
    },
    applications: [{
            applicant: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'User'
            },
            status: {
                type: String,
                enum: ['pending', 'reviewed', 'accepted', 'rejected'],
                default: 'pending'
            },
            appliedAt: {
                type: Date,
                default: Date.now
            }
        }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
// Add timestamps
jobSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
var Job = mongoose_1.default.models.Job || mongoose_1.default.model('Job', jobSchema);
exports.default = Job;
