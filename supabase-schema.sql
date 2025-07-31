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

-- Enable Row Level Security (RLS)
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to books" ON books FOR SELECT USING (true);
CREATE POLICY "Allow public read access to comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Allow public read access to projects" ON projects FOR SELECT USING (true);

-- Create policies for insert access (for now, allow all inserts)
CREATE POLICY "Allow public insert to books" ON books FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to comments" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to projects" ON projects FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_books_status ON books(status);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX idx_projects_featured ON projects(featured);

-- Insert some sample data
INSERT INTO books (title, author, genre, cover_url, status, notes) VALUES
('Nightfall', 'Isaac Asimov and Robert Silverberg', 'Science Fiction', 'https://images-na.ssl-images-amazon.com/images/P/0553290991.01.L.jpg', 'currently_reading', 'Currently reading this science fiction novel.'),
('The Brothers Karamazov', 'Fyodor Dostoevsky', 'Fiction', 'https://images-na.ssl-images-amazon.com/images/P/0374528373.01.L.jpg', 'currently_reading', 'Currently reading this classic Russian novel.'),
('1Q84', 'Haruki Murakami', 'Fiction', 'https://images-na.ssl-images-amazon.com/images/P/0099578077.01.L.jpg', 'want_to_read', 'Want to read this acclaimed novel by Haruki Murakami.');

INSERT INTO comments (text, sentiment_score) VALUES
('This portfolio is amazing!', 0.8),
('Love the falling comments feature', 0.9),
('Great projects showcase', 0.7),
('The dark mode is so smooth', 0.8);

INSERT INTO projects (title, description, github_url, technologies, featured) VALUES
('Portfolio Website', 'This website. Built with Cursor.', 'https://github.com/robdiorio-34/portfolio', ARRAY['HTML', 'CSS', 'JavaScript'], true),
('Dots', 'Combine Strava API + Hevy API to create an aggregated workout calendar view.', 'https://github.com/robdiorio-34/dots', ARRAY['JavaScript', 'API Integration'], true),
('Spotify - Roast Me', 'Messing around with Spotify API and ChatGPT API to generate a personalized roast of your music taste.', 'https://github.com/robdiorio-34/Spotify-roast', ARRAY['JavaScript', 'API Integration'], true); 