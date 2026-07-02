import json
import random
from config import Config

# Initialize Groq client conditionally
groq_client = None
if Config.GROQ_API_KEY:
    try:
        from groq import Groq
        groq_client = Groq(api_key=Config.GROQ_API_KEY)
    except Exception as e:
        print(f"Failed to initialize Groq client: {str(e)}. Using Mock mode.")

class AIService:
    @staticmethod
    def _call_groq(system_prompt, user_prompt):
        if not groq_client:
            return None
        
        try:
            chat_completion = groq_client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                model=Config.GROQ_MODEL,
                response_format={"type": "json_object"},
                temperature=0.3
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            print(f"Groq API Error: {str(e)}. Falling back to Mock.")
            return None

    @staticmethod
    def generate_summary(text):
        # Clip text to stay within token limits if very large
        clipped_text = text[:15000]
        
        system_prompt = (
            "You are an AI educational summaries generator. Generate a study guide in JSON format. "
            "The JSON MUST have the following keys:\n"
            "- 'summary': A comprehensive study summary formatted in markdown, with headings, lists and bold terms.\n"
            "- 'key_points': A list of the top 5 essential takeaways.\n"
            "- 'definitions': A list of key terms defined, e.g., [{'term': 'X', 'definition': 'Y'}]\n"
            "- 'examples': A list of 2-3 detailed examples or case studies.\n"
            "- 'memory_tricks': A list of 2-3 mnemonics or tricks to remember these concepts."
        )
        
        user_prompt = f"Please summarize the following material:\n\n{clipped_text}"
        
        response_json = AIService._call_groq(system_prompt, user_prompt)
        if response_json:
            try:
                return json.loads(response_json)
            except Exception:
                pass
                
        # Mock summary fallback
        return AIService._mock_summary(text)

    @staticmethod
    def generate_flashcards(text):
        clipped_text = text[:10000]
        
        system_prompt = (
            "You are an expert tutor. Generate study flashcards based on the material in JSON format. "
            "The JSON MUST be an object containing a list named 'flashcards'. "
            "Each flashcard object MUST contain 'question', 'answer', and 'difficulty' (easy, medium, hard). "
            "Provide between 5 to 10 cards. Example:\n"
            "{'flashcards': [{'question': '...', 'answer': '...', 'difficulty': 'medium'}]}"
        )
        
        user_prompt = f"Create flashcards for:\n\n{clipped_text}"
        
        response_json = AIService._call_groq(system_prompt, user_prompt)
        if response_json:
            try:
                data = json.loads(response_json)
                if 'flashcards' in data:
                    return data['flashcards']
            except Exception:
                pass
                
        return AIService._mock_flashcards(text)

    @staticmethod
    def generate_quiz(text, question_count=5, quiz_type='MCQ', difficulty='medium'):
        clipped_text = text[:10000]
        
        system_prompt = (
            f"You are a test generator. Generate a quiz of type {quiz_type} containing {question_count} questions "
            f"at a {difficulty} level based on the material. Return the quiz in JSON format.\n"
            "The JSON MUST contain a single list named 'questions'.\n"
            "Each question object MUST contain the following keys:\n"
            "- 'question': The question prompt.\n"
            "- 'topic': The subtopic this question belongs to.\n"
            "- 'explanation': A detailed explanation of why the answer is correct.\n"
        )
        
        if quiz_type == 'MCQ':
            system_prompt += (
                "- 'options': A list of 4 options.\n"
                "- 'correct_answer': The exact string of the correct option from the options list.\n"
            )
        elif quiz_type == 'True/False':
            system_prompt += (
                "- 'options': ['True', 'False']\n"
                "- 'correct_answer': Either 'True' or 'False'.\n"
            )
        else: # Short Answer
            system_prompt += (
                "- 'correct_answer': A model answer string showing the key concepts that must be mentioned.\n"
            )
            
        user_prompt = f"Generate this quiz based on this text:\n\n{clipped_text}"
        
        response_json = AIService._call_groq(system_prompt, user_prompt)
        if response_json:
            try:
                data = json.loads(response_json)
                if 'questions' in data:
                    return data['questions']
            except Exception:
                pass
                
        return AIService._mock_quiz(text, question_count, quiz_type, difficulty)

    @staticmethod
    def generate_study_plan(text, duration_days=7):
        clipped_text = text[:5000]
        
        system_prompt = (
            f"You are a study coordinator. Generate a highly detailed {duration_days}-day study plan based on "
            "the provided material. Return the plan in JSON format.\n"
            "The JSON MUST be an object with the key 'schedule'. The 'schedule' must contain daily keys "
            "like 'Day 1', 'Day 2', etc. Each day must contain:\n"
            "- 'title': The focus topic for the day.\n"
            "- 'priority': 'high', 'medium', or 'low'.\n"
            "- 'activities': A list of 3 actionable study tasks, reading targets, or exercises."
        )
        
        user_prompt = f"Plan study schedule for:\n\n{clipped_text}"
        
        response_json = AIService._call_groq(system_prompt, user_prompt)
        if response_json:
            try:
                data = json.loads(response_json)
                if 'schedule' in data:
                    return data['schedule']
            except Exception:
                pass
                
        return AIService._mock_study_plan(text, duration_days)

    # --- Fallback Mock Generators for Offline Run ---

    @staticmethod
    def _mock_summary(text):
        snippet = text[:60] + "..." if len(text) > 60 else text
        return {
            'summary': (
                f"# Study Summary: {snippet}\n\n"
                "## Overview\n"
                "This study summary covers the core foundational concepts, frameworks, and equations relevant "
                "to the uploaded document. It synthesizes the most crucial theoretical details into a comprehensive outline.\n\n"
                "### Core Themes\n"
                "1. **Fundamentals & Directives**: System elements that set up the primary framework.\n"
                "2. **Process Pipelines**: Operations that structure input data and generate outputs.\n"
                "3. **Optimization & Error Control**: Fallback policies, constraints, and adaptive tuning parameters.\n\n"
                "## Key Explanations\n"
                "A deeper look into the document shows structured components interacting under specific load conditions. "
                "Understanding the relationships between active modules helps predict scaling behaviors and resource utilization."
            ),
            'key_points': [
                "Primary workflows rely on core components interacting dynamically.",
                "Optimizations prevent bottlenecks in high-throughput environments.",
                "Hashed tokens provide secure authentication and session management.",
                "Adaptive learning loops use progress logs to determine future content.",
                "Fallback storage mechanisms guarantee system uptime during Firestore maintenance."
            ],
            'definitions': [
                {'term': 'Polymorphism', 'definition': 'The ability of different objects to respond to the same message in unique ways.'},
                {'term': 'JWT (Json Web Token)', 'definition': 'A compact, URL-safe means of representing claims to be transferred between two parties.'},
                {'term': 'Glassmorphism', 'definition': 'A user interface design trend characterized by frosted-glass effects, soft borders, and floating elements.'}
            ],
            'examples': [
                "Example A: Running a local server with SQLite database fallback when internet endpoints or cloud credentials are unavailable.",
                "Example B: Creating a 3D flippable card system using React and Framer Motion which handles scale, rotation, and z-indexing."
            ],
            'memory_tricks': [
                "Use the acronym **F.I.T.S.** to recall state criteria: **F**ile type, **I**nteractions, **T**opic coverage, **S**core limits.",
                "Picture a frosted windowpane to remember **Glassmorphism** styling keys: background blur, thin white border, semi-transparent backing."
            ]
        }

    @staticmethod
    def _mock_flashcards(text):
        return [
            {'question': 'What is the main topic covered in this document?', 'answer': 'This document discusses core learning frameworks and education pipelines.', 'difficulty': 'easy'},
            {'question': 'Explain the difference between SQLite database fallback and Firestore database drivers.', 'answer': 'Firestore is a cloud NoSQL database, while SQLite is a local file-based relational database used as a fallback.', 'difficulty': 'medium'},
            {'question': 'How does study time tracking help in adaptive learning?', 'answer': 'It enables the system to estimate focus density and suggest relevant topics based on study trends.', 'difficulty': 'hard'},
            {'question': 'What role does JWT play in API authentication?', 'answer': 'It securely transmits identity statements between frontend clients and the Flask server.', 'difficulty': 'medium'},
            {'question': 'Why is glassmorphism used in modern dashboard UIs?', 'answer': 'It offers visual depth, premium contrast, and sleek card layout structuring.', 'difficulty': 'easy'}
        ]

    @staticmethod
    def _mock_quiz(text, question_count, quiz_type, difficulty):
        questions = []
        topics = ["Architecture", "Configuration", "APIs", "Security", "Analytics"]
        
        for i in range(question_count):
            topic = random.choice(topics)
            q_num = i + 1
            if quiz_type == 'MCQ':
                options = [
                    f"Option A: Focuses on optimized {topic} pipelines.",
                    f"Option B: Utilizes default structural {topic} limits.",
                    f"Option C: Handles fallback parameters directly in the {topic} controller.",
                    f"Option D: Restricts token parsing to unauthorized {topic} modules."
                ]
                correct = options[random.randint(0, 2)]
                questions.append({
                    'question': f"Question {q_num}: Which of the following best describes the core standard for {topic}?",
                    'options': options,
                    'correct_answer': correct,
                    'explanation': f"The system validates {topic} parameters using the correct implementation logic specified in Option A, B, or C.",
                    'topic': topic
                })
            elif quiz_type == 'True/False':
                correct = random.choice(["True", "False"])
                questions.append({
                    'question': f"Question {q_num}: True or False: {topic} mechanisms automatically scale in high latency production setups.",
                    'options': ["True", "False"],
                    'correct_answer': correct,
                    'explanation': f"The behavior of {topic} structures depends entirely on active profile settings and DB connection pools.",
                    'topic': topic
                })
            else: # Short Answer
                questions.append({
                    'question': f"Question {q_num}: Describe the primary architectural purpose of a {topic} layer.",
                    'correct_answer': f"A {topic} layer separates configuration parameters from execution environments to increase system modularity and security.",
                    'explanation': f"The role of {topic} is to maintain modular abstraction boundaries across backend and database operations.",
                    'topic': topic
                })
        return questions

    @staticmethod
    def _mock_study_plan(text, duration_days):
        schedule = {}
        focus_topics = ["Fundamentals & Setup", "Data Ingestion & Parsing", "AI Generation & Prompt Tuning", "Auth Systems & Security", "Visualizing Progress & Analytics", "Refactoring & Production Config", "Final Exam Mock Review"]
        
        for i in range(duration_days):
            day_num = i + 1
            topic_idx = (i) % len(focus_topics)
            schedule[f"Day {day_num}"] = {
                'title': f"Mastering {focus_topics[topic_idx]}",
                'priority': 'high' if day_num in [1, 3, 7] else 'medium',
                'activities': [
                    f"Review the generated study summary on {focus_topics[topic_idx]}.",
                    f"Go through the generated flashcard deck, rating cards until all are marked Easy.",
                    f"Take a 5-question Quiz on this subtopic and target scoring above 80%."
                ]
            }
        return schedule
