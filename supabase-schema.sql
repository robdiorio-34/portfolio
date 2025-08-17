-- Supabase Database Schema for Portfolio
-- Run this in your Supabase SQL Editor

-- Books table for reading list
CREATE TABLE books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  genre TEXT,
  cover_url TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  status TEXT CHECK (status IN ('currently_reading', 'want_to_read', 'have_read')) DEFAULT 'want_to_read',
  completion_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Comments table for falling comments feature
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  sentiment_score FLOAT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  user_id TEXT DEFAULT 'anonymous'
);

-- Projects table for project showcase
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  github_url TEXT,
  live_url TEXT,
  technologies TEXT[],
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Notes table for essays and thoughts
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  substack_url TEXT NOT NULL,
  published_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to books" ON books FOR SELECT USING (true);
CREATE POLICY "Allow public read access to comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Allow public read access to projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read access to notes" ON notes FOR SELECT USING (true);

-- Create policies for insert access (for now, allow all inserts)
CREATE POLICY "Allow public insert to books" ON books FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to comments" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to projects" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to notes" ON notes FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_books_status ON books(status);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_notes_published_date ON notes(published_date DESC);

