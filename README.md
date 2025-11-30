# **BinWise ♻️ — AI-Powered Recycling Management Platform**

BinWise is a full-stack recycling platform that helps users scan waste items, identify materials using Computer Vision (YOLOv8), estimate weight, and earn reward points. Users can redeem rewards through scheduled pickups or in-center drop-offs. Built as a MERN + Python microservice system.

------------------------------
## **Features**

### *AI-Powered Scanner*

Upload or capture a photo

YOLOv8 detects objects (55 classes)

Identifies material type (7 categories)

Estimates weight using lookup tables

Calculates reward points & monetary value

### *Pickup & Drop-Off*

Schedule pickups with date/time

Track pickup status (Pending → Assigned → Completed)

View centers on an interactive map (React Leaflet)

### *User Dashboard*

Track total points & monetary gains

See progress, achievements, badges

View scan/pickup history

### *Admin Dashboard*

Manage all pickups

Assign requests to agents

Track system stats in real-time
------------------------------------
## **Tech Stack**

### *Frontend*

React.js

Tailwind CSS

React Leaflet

Chart.js

### *Backend*

Node.js

Express.js

MongoDB + Mongoose

JWT authentication

Multer 

Nodemailer (OTP verification)

### *AI Microservice*

Python 3.10

YOLOv8 (Ultralytics)

FastAPI + Uvicorn

OpenCV, NumPy

Docker Container

Hosted on HuggingFace Spaces
---------------------------------------
## **Main User Flows**

### *User Flow*

Sign up → Email verification

Scan item with AI

View recyclable status, weight, and points

Schedule pickup or drop items at centers

Track progress & achievements

### *Admin Flow*

Login

View all pickups

Assign agents / mark completed

Monitor platform activity
-----------------------------------
## **Database (MongoDB)**

### *Main collections:*

Users (credentials, points, levels)

Pickups (requests & statuses)

Centers (location info, hours)

DeliveryAgents

Scans / AI results

### *Indexes used for:*

Email

Status filters

Geo queries

Leaderboards
-----------------------------------
## **AI Model Summary**

6,000+ manually collected & annotated images

55 object classes

7 material types

YOLOv8n model trained for 50 epochs

Accuracy: 70%

Precision: 0.69

Recall: 0.743

Response time: < 2 seconds
---------------------------------
## **Live Deployments**

Frontend: Vercel / Netlify

Backend API: Render / Railway

AI Microservice: HuggingFace Spaces
----------------------------------
## **License**

This project is for DEPI graduation purposes. License optional.

