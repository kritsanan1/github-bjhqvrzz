/*
  # Analytics and Performance Tracking Tables

  1. New Tables
    - `client_analytics`
      - `id` (uuid, primary key)
      - `user_id` (uuid, nullable for anonymous users)
      - `session_id` (text, for grouping events)
      - `event_type` (text, type of event)
      - `event_data` (jsonb, flexible event data)
      - `viewport_width` (integer)
      - `viewport_height` (integer)
      - `user_agent` (text)
      - `timestamp` (timestamptz)
      - `performance_metrics` (jsonb, Core Web Vitals and other metrics)
    
    - `performance_reports`
      - `id` (uuid, primary key)
      - `session_id` (text)
      - `report_type` (text, e.g., 'lighthouse', 'core-web-vitals')
      - `metrics` (jsonb, performance data)
      - `recommendations` (jsonb, optimization suggestions)
      - `score` (numeric, overall performance score)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read their own data
    - Allow anonymous analytics collection for public metrics
*/

-- Client Analytics Table
CREATE TABLE IF NOT EXISTS client_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id text NOT NULL,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}',
  viewport_width integer,
  viewport_height integer,
  user_agent text,
  timestamp timestamptz DEFAULT now(),
  performance_metrics jsonb DEFAULT '{}'
);

-- Performance Reports Table
CREATE TABLE IF NOT EXISTS performance_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  report_type text NOT NULL DEFAULT 'core-web-vitals',
  metrics jsonb NOT NULL DEFAULT '{}',
  recommendations jsonb DEFAULT '{}',
  score numeric(5,2),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE client_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_reports ENABLE ROW LEVEL SECURITY;

-- Policies for client_analytics
CREATE POLICY "Allow anonymous analytics collection"
  ON client_analytics
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can read their own analytics"
  ON client_analytics
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Allow public analytics for dashboard"
  ON client_analytics
  FOR SELECT
  TO authenticated
  USING (user_id IS NULL);

-- Policies for performance_reports
CREATE POLICY "Allow anonymous performance reports"
  ON performance_reports
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow reading performance reports"
  ON performance_reports
  FOR SELECT
  TO authenticated
  WITH CHECK (true);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_client_analytics_session_id ON client_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_client_analytics_event_type ON client_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_client_analytics_timestamp ON client_analytics(timestamp);
CREATE INDEX IF NOT EXISTS idx_performance_reports_session_id ON performance_reports(session_id);
CREATE INDEX IF NOT EXISTS idx_performance_reports_created_at ON performance_reports(created_at);