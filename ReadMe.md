# AyurMart_Secure: Security Vulnerability Fixes & Remediation Record

---

## 🔗 Project Repository

> You can access the source code, pull requests, and commit history on the official repository:
> **[AyurMart_Secure GitHub Repository](https://github.com/?utm_source=gemini)** https://github.com/Ravishka2000/AyurMart_E-Commerce

---

## 🎥 YouTube Demonstration

The video below demonstrates the identified vulnerabilities, implemented remediation changes, and final verification of all security fixes:

*  https://www.youtube.com/watch?v=PMUIeQ-yXlY

---

## 📋 Vulnerability Summary Table

| ID | Vulnerability | OWASP Category | Detection Tool | Status | Owner |
| --- | --- | --- | --- | --- | --- |
| **V1** | Hardcoded and committed API credentials | A02 / A05 (CWE-798) | GitHub Push Protection | **Fixed** | D.M.R.S Medhawa (IT23212404) |
| **V2** | Weak authentication controls & lack of federated sign-in | A07:2021 | ZAP, Manual Testing | **Fixed** | D.M.R.S Medhawa (IT23212404) |
| **V3** | Cross-site scripting (XSS) in edit functionality | A03:2021 (CWE-79) | Snyk | **Fixed** | D.M.R.S Medhawa (IT23212404) |
| **V4** | CSRF risk from cookie middleware & weak refresh tokens | A01:2021 (CWE-352) | Snyk | **Fixed** | D.M.R.S Medhawa (IT23212404) |
| **V5** | Denial of Service via Uncaught Exception | A06:2021 (CWE-248) | Snyk Open Source | **Fixed** | P.A.K.I Abhayawardhana |
| **V6** | Heap-based Buffer Overflow | A06:2021 (CWE-122) | Snyk Open Source | **Fixed** | P.A.K.I Abhayawardhana |
| **V7** | Denial of Service via Unchecked Input for Loop Condition | A03:2021 (CWE-606) | Snyk Code | **Fixed** | P.A.K.I Abhayawardhana |
| **V8** | Path Traversal in Product Image Upload & File Handling | A01:2021 (CWE-22) | Snyk | **Fixed** | PATHIRANA U.M (IT22167828) |
| **V9** | Information Exposure through X-Powered-By Header | A05:2021 (CWE-200) | Snyk | **Fixed** | PATHIRANA U.M (IT22167828) |
| **V10** | Log Injection through User-Controlled Request Headers | A09:2021 (CWE-117) | Semgrep | **Fixed** | PATHIRANA U.M (IT22167828) |
| **V11** | Missing Rate Limiting on Seller Login Endpoint | A07:2021 (CWE-400, CWE-770, CWE-307) | CodeQL, Postman | **Fixed** | Nujaba M.I.F (IT23237636) |
| **V12** | CSP Directive Missing Fallback Protection | A05:2021 (CWE-693) | ZAP | **Fixed** | Nujaba M.I.F (IT23237636) |
| **V13** | Information Exposure Through HTTP Response Headers | A05:2021 (CWE-200) | PowerShell / cURL | **Fixed** | Nujaba M.I.F (IT23237636) |

---

## 🛠️ Security Detection & Testing Tools Used

* GitHub Push Protection
* OWASP ZAP
* Snyk / Snyk Open Source / Snyk Code
* Semgrep
* CodeQL
* Postman
* PowerShell & cURL
* Manual security testing

---
