# MULTI-RAG System

![Python](https://img.shields.io/badge/Python-3.9%2B-3776AB?logo=python&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react&logoColor=black)
![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)
![Pipelines](https://img.shields.io/badge/Pipelines-4%20Implemented-orange)
![Dataset](https://img.shields.io/badge/Dataset-CRAG%20Task%201%262-blue)

This project is a case-study style implementation of advanced Retrieval-Augmented Generation (RAG) strategies on a noisy, multi-domain web corpus. The goal is to compare how well different pipelines answer real-world questions when retrieval quality is imperfect.

Implemented pipelines:

- RAG Fusion
- HyDE
- CRAG
- Graph RAG

Full assignment requirements and constraints are in `ASSIGNMENT.md`.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Dataset Setup](#dataset-setup)
- [Configuration](#configuration)
- [Run the Project](#run-the-project)
- [Evaluation Output](#evaluation-output)
- [Project Structure](#project-structure)
- [Important Notes](#important-notes)

## Overview

The system builds a single global index from CRAG snippets and uses that shared index across all four pipelines for fair comparison. Evaluation computes pipeline-level metrics and saves the results to `evaluation_results.json`.

## Tech Stack

- Python 3.9+
- FastAPI backend
- React + Vite frontend
- Sentence-transformer style embedding workflow (configured via `config/config.yaml`)

## Quick Start

From the project root:

```bash
pip install -r requirements.txt
```

```bash
cd frontend
npm install
cd ..
```

Copy the config template:

```bash
copy config\config.example.yaml config\config.yaml
```

If `copy` is unavailable in your shell, duplicate the file manually.

## Dataset Setup

This assignment uses **CRAG Task 1 & 2 dev v4**.

1. Download the compressed dataset:
   - [crag_task_1_and_2_dev_v4.jsonl.bz2](https://github.com/facebookresearch/CRAG/raw/refs/heads/main/data/crag_task_1_and_2_dev_v4.jsonl.bz2)
2. Decompress it.
3. Place the extracted file at:
   - `dataset/crag_task_1_and_2_dev_v4.jsonl`

Dataset schema details are documented in `docs/dataset.md`.

## Configuration

Edit `config/config.yaml` and set at least:

- `dataset_path`: path to `dataset/crag_task_1_and_2_dev_v4.jsonl`
- `embedding_model`: for example `all-MiniLM-L6-v2`
- `generation_model`: your selected LLM name
- `top_k`: number of retrieved chunks per query

## Run the Project

### 1. Run Evaluation

```bash
python run_evaluation.py
```

What this does:

- Builds or loads a global index (`dataset/global_index.pkl`)
- Runs all four pipelines on the dev examples
- Computes metrics and writes them to `evaluation_results.json`

### 2. Start Backend API

```bash
python backend/main.py
```

Backend endpoint:

- `POST /query`

Default backend URL:

- `http://localhost:8000`

### 3. Start Frontend

```bash
cd frontend
npm run dev
```

Open the URL printed by Vite (commonly `http://localhost:5173`).

## Evaluation Output

Results are stored in:

- `evaluation_results.json`

Each pipeline reports:

- `accuracy`
- `correct`
- `total`

## Project Structure

```text
Assignment2/
|- backend/
|- config/
|- dataset/
|- docs/
|- frontend/
|- src/
|  |- pipelines/
|- run_evaluation.py
|- evaluation_results.json
|- ASSIGNMENT.md
|- README.md
```

## Important Notes

- Follow the assignment constraints in `ASSIGNMENT.md`.
- Do not change the required folder structure.
- Do not commit secrets in `config/config.yaml`.
- LLM/API policy for this assignment: do not use an OpenAI API key; use Groq, Gemini free tier, or another free/local option.
