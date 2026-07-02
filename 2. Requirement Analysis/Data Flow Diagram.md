# Phase 2: Data Flow Diagram (DFD)

This document details the Level 0 and Level 1 data flows within the **StudyAI** application.

---

## 1. DFD Level 0: Context Diagram

```
           +---------------------------------------+
           |                 User                  |
           +---+-------------------------------+---+
               |                               ^
               | File uploads, Text inputs,    | Summaries, Quizzes,
               | Quiz answers                  | Planners, Scores
               v                               |
           +---+-------------------------------+---+
           |               StudyAI App             |
           +-------------------+-------------------+
                               |
                               | API calls / SQL queries
                               v
           +-------------------+-------------------+
           |            External Services          |
           |    (Groq API & Firebase Database)     |
           +---------------------------------------+
```

---

## 2. DFD Level 1: System Process Diagram

```
+-----------+       1. Upload File       +-------------------+
|   User    |--------------------------->|  Ingestion Engine  |
|           |                            +---------+---------+
|           |                                      |
|           |       2. Parse & Store Text          v
|           |<---------------------------------[ Database ]
|           |                                      |
|           |       3. Call AI Service             v
|           |--------------------------->+-------------------+
|           |                            |    Groq Client    |
|           |                            +---------+---------+
|           |                                      |
|           |       4. Return JSON Guides          v
|           |<---------------------------------[ Database ]
|           |                                      |
|           |       5. Grade Quiz & Log            v
|           |--------------------------->+-------------------+
|           |                            | Evaluation Engine |
|           |                            +---------+---------+
|           |                                      |
|           |       6. Update Analytics Stats      v
|           |<---------------------------------[ Database ]
+-----------+
```
