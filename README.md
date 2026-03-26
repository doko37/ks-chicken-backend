# KS Chicken — Backend API

Backend API for KS Chicken, a Node.js based ordering system that supports product management, cart handling, and secure payment processing using Stripe.

---

## Overview

This backend provides RESTful API endpoints that power the KS Chicken frontend ordering experience.

It handles product data retrieval, order processing, payment integration, and secure management of sensitive credentials using AWS Secrets Manager.

The deployment workflow is fully automated using GitHub Actions and AWS CodeDeploy.

---

## Features

- RESTful API built with **Node.js** and **Express**
- Database integration using **MongoDB** and **Mongoose**
- Secure **Stripe API** payment processing
- API keys and secrets securely retrieved using **AWS Secrets Manager**
- Automated **CI/CD deployment pipeline**
- Production-style cloud deployment using **GitHub Actions + AWS CodeDeploy**

---

## Tech Stack

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose

**Payments**
- Stripe API

**Security**
- AWS Secrets Manager (secure API key retrieval)

**CI/CD & Deployment**
- GitHub Actions
- AWS CodeDeploy
- AWS EC2

---

## API Responsibilities

The backend API is responsible for:

- Retrieving product data
- Managing order creation
- Processing Stripe payment sessions
- Validating request data
- Securely handling sensitive credentials
- Returning structured responses to the frontend

---

## Security Implementation

Sensitive credentials such as API keys are **not stored in source code**.

Instead:

1. Secrets are stored securely in **AWS Secrets Manager**
2. The application retrieves secrets dynamically at runtime
3. Environment configuration remains secure across deployments

---

## Configuration

Local development uses environment variables.  
Production environments retrieve secrets securely from AWS Secrets Manager.

---

## Deployment Workflow

The backend deployment process is fully automated:

1. Code is pushed to GitHub
2. GitHub Actions installs dependencies and builds the application
3. Deployment artifacts are packaged and uploaded to S3
4. AWS CodeDeploy deploys the application to EC2 instances
5. Application updates automatically with minimal manual intervention
