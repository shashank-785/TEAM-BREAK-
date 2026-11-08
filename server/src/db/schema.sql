-- ====================================================================
-- LearnOS PostgreSQL / Supabase Schema Definition
-- Run this script in the Supabase SQL Editor or standard PostgreSQL
-- ====================================================================

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    university VARCHAR(255),
    major VARCHAR(255),
    semester INTEGER DEFAULT 5,
    target_gpa NUMERIC(3, 2) DEFAULT 3.90,
    current_gpa NUMERIC(3, 2) DEFAULT 3.75,
    streak_days INTEGER DEFAULT 14,
    total_study_hours NUMERIC(6, 1) DEFAULT 142.5,
    quizzes_completed INTEGER DEFAULT 28,
    problems_solved INTEGER DEFAULT 54,
    dream_role VARCHAR(255) DEFAULT 'Full-Stack AI Engineer',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(32) NOT NULL,
    name VARCHAR(255) NOT NULL,
    semester INTEGER DEFAULT 5,
    credits INTEGER DEFAULT 4,
    description TEXT,
    icon VARCHAR(64)
);

-- Units & Topics Table
CREATE TABLE IF NOT EXISTS units (
    id VARCHAR(64) PRIMARY KEY,
    subject_id VARCHAR(64) REFERENCES subjects(id) ON DELETE CASCADE,
    unit_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS topics (
    id VARCHAR(64) PRIMARY KEY,
    unit_id VARCHAR(64) REFERENCES units(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    estimated_minutes INTEGER DEFAULT 30,
    content TEXT,
    key_points JSONB DEFAULT '[]'::jsonb,
    code_examples JSONB DEFAULT '[]'::jsonb,
    is_completed BOOLEAN DEFAULT FALSE
);

-- Planner Tasks Table
CREATE TABLE IF NOT EXISTS planner_tasks (
    id VARCHAR(64) PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    subject_name VARCHAR(255),
    due_date DATE NOT NULL,
    priority VARCHAR(16) DEFAULT 'medium',
    status VARCHAR(20) DEFAULT 'todo',
    category VARCHAR(32) DEFAULT 'assignment',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Schedules Table
CREATE TABLE IF NOT EXISTS schedules (
    id VARCHAR(64) PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL, -- 0-6
    start_time VARCHAR(8) NOT NULL,
    end_time VARCHAR(8) NOT NULL,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    location VARCHAR(255),
    type VARCHAR(32) DEFAULT 'lecture'
);

-- Notes Table
CREATE TABLE IF NOT EXISTS notes (
    id VARCHAR(64) PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    tags JSONB DEFAULT '[]'::jsonb,
    summary TEXT,
    key_concepts JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quizzes and Flashcards Table
CREATE TABLE IF NOT EXISTS quiz_questions (
    id VARCHAR(64) PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_option INTEGER NOT NULL,
    explanation TEXT
);

CREATE TABLE IF NOT EXISTS flashcards (
    id VARCHAR(64) PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    mastered BOOLEAN DEFAULT FALSE,
    times_reviewed INTEGER DEFAULT 0
);

-- Coding Problems Table
CREATE TABLE IF NOT EXISTS coding_problems (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(128) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    difficulty VARCHAR(16) NOT NULL,
    category VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    constraints JSONB DEFAULT '[]'::jsonb,
    sample_input TEXT,
    sample_output TEXT,
    starter_code JSONB NOT NULL,
    test_cases JSONB NOT NULL
);

-- Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(64) NOT NULL,
    progress INTEGER DEFAULT 0,
    max_progress INTEGER DEFAULT 100,
    unlocked BOOLEAN DEFAULT FALSE,
    unlocked_at TIMESTAMP WITH TIME ZONE
);
