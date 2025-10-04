# Job Sequencing Visualization

## Table of Contents
- [Introduction](#introduction)  
- [Problem Statement](#problem-statement)  
- [Algorithm](#algorithm)  
- [Features](#features)  
- [Input Options](#input-options)  
- [Installation & Run](#installation--run)  
- [Usage](#usage)  
- [Screenshots](#screenshots)  
- [Time & Space Complexity](#time--space-complexity)  
- [Author](#author)  

---

## Introduction
This project implements the **Job Sequencing Problem** using a **Greedy Algorithm** and provides an **interactive step-by-step visualization** in the browser using HTML, CSS, and JavaScript. The main goal is to schedule jobs/startups to maximize total profit within their deadlines.  

---

## Problem Statement
Each job has a **deadline** and a **profit**. Only one job can be scheduled in a single time slot. The objective is to schedule the jobs in such a way that the total profit is maximized.

Example:

| Startup | Deadline | Profit |
|---------|----------|--------|
| S1      | 2        | 100    |
| S2      | 1        | 19     |
| S3      | 2        | 27     |

---

## Algorithm
**Greedy Approach:**
1. Sort jobs in descending order of profit.  
2. Find the maximum deadline among jobs.  
3. Initialize `slot[]` array to track free slots.  
4. For each job, find the latest free slot ≤ job’s deadline.  
5. Assign the job to that slot if available.  
6. Calculate total profit of scheduled jobs.  

**Complexity:**
- **Time Complexity:** O(n log n + n * maxDeadline)  
- **Space Complexity:** O(maxDeadline + n)  

---

## Features
- Stepwise visualization of sorting and scheduling.  
- Controls: **Play**, **Pause**, **Step Forward**, **Step Backward**, **Reset**.  
- Displays key variables: Jobs array, Slot array, Total Profit.  
- Input options: User-defined, Random, Preset (Best/Worst cases).  

---

## Input Options
1. **User-defined:** Enter number of startups and their [Deadline, Profit].  
2. **Random Input:** Automatically generates random jobs.  
3. **Preset Input:** Choose best or worst case examples.  

---

## Installation & Run
1. Clone or download the repository.  
2. Open `index.html` in any modern web browser (Chrome/Firefox).  
3. No additional dependencies required.  

---

## Usage
1. Enter number of jobs/startups.  
2. Fill deadlines and profits (or select random/preset).  
3. Click **Start Visualization**.  
4. Use controls to **step through the algorithm** or **reset**.  
5. Observe scheduled jobs and total profit.  

---

## Screenshots
*(Insert screenshots here for clarity)*  
- **Input Form**  
- **Jobs Sorted by Profit**  
- **Stepwise Slot Assignment**  
- **Final Scheduled Jobs & Total Profit**  

---

## Time & Space Complexity
- Sorting: O(n log n)  
- Scheduling: O(n * maxDeadline)  
- **Overall:** O(n log n + n * maxDeadline)  
- Space used for arrays: O(maxDeadline + n)  

---

## Author
- **Name:** Vedant Jadhav  
- **Course:** B.Tech Computer Science  
- **College:** Walchand College of Engineering  
