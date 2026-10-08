# BRIEFING — 2026-10-08T20:28:00Z

## Mission
Sentinel monitoring and lifecycle management for La Foret real estate website production maintenance, Cloudinary-to-ImageKit migration, hero/banner asset config, and Ouedkniss property population.

## 🔒 My Identity
- Archetype: sentinel
- Working directory: c:\Users\pc\Desktop\website REALESTATE la foret\.agents\teamwork\sentinel
- Orchestrator: b863cc06-cee0-46cb-8c78-0bd3815ddda9
- Cron 1 (Progress Reporting */8m): task-16
- Cron 2 (Liveness Check */10m): task-18
- Victory Auditor: to be spawned on victory claim

## 🔒 Key Constraints
- No technical decisions — relay only
- Victory Audit is MANDATORY before reporting completion
- Must not write code, analyze problems, or make any technical decisions
- Keep context ultra-light
- Route to teamwork_preview_orchestrator for general SWE work
- Run Cron 1 (Progress Reporting */8 * * * *) and Cron 2 (Liveness Check */10 * * * *)
- Independent verification before reporting success to caller/user

## User Context
- **Last user request**: Multi-agent execution of La Foret real estate website project (R1-R6)
- **Pending clarifications**: none
- **Delivered results**: Initialized sentinel state and recorded ORIGINAL_REQUEST.md

## Project Status
- **Phase**: in progress

## Routing Decision
- **Chosen path**: General (`teamwork_preview_orchestrator`)
- **Rationale**: Full multi-stage software engineering, migration, and data population task across frontend and backend; does not match document review, math/proof, or single-change SWE Light. Pre-flight audit not required.

## Victory Audit Status
- **Triggered**: no
- **Verdict**: pending
- **Retry count**: 0

## Artifact Index
- c:\Users\pc\Desktop\website REALESTATE la foret\.agents\teamwork\ORIGINAL_REQUEST.md — Verbatim user request record
