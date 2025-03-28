-- Enable the necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    role TEXT NOT NULL CHECK (role IN ('faculty', 'admin')),
    institution TEXT
);

-- Create templates table
CREATE TABLE IF NOT EXISTS public.templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    specialty TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create cases table
CREATE TABLE IF NOT EXISTS public.cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    learning_objectives TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    template_id UUID REFERENCES public.templates(id) ON DELETE SET NULL,
    content JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Create case_components table for structured case data
CREATE TABLE IF NOT EXISTS public.case_components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('patient_profile', 'history', 'physical_exam', 'labs', 'imaging', 'diagnosis', 'treatment', 'outcome')),
    title TEXT NOT NULL,
    content JSONB NOT NULL,
    order_number INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create case_files table for attachments
CREATE TABLE IF NOT EXISTS public.case_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cases_user_id ON public.cases(user_id);
CREATE INDEX IF NOT EXISTS idx_cases_template_id ON public.cases(template_id);
CREATE INDEX IF NOT EXISTS idx_case_components_case_id ON public.case_components(case_id);
CREATE INDEX IF NOT EXISTS idx_case_files_case_id ON public.case_files(case_id);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_cases_updated_at
    BEFORE UPDATE ON public.cases
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_case_components_updated_at
    BEFORE UPDATE ON public.case_components
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Set up Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_files ENABLE ROW LEVEL SECURITY;

-- Create policies for users
CREATE POLICY "Users can view their own data"
    ON public.users
    FOR SELECT
    USING (auth.uid() = id);

-- Create policies for cases
CREATE POLICY "Users can view their own cases"
    ON public.cases
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cases"
    ON public.cases
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cases"
    ON public.cases
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cases"
    ON public.cases
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for templates
CREATE POLICY "Everyone can view templates"
    ON public.templates
    FOR SELECT
    USING (true);

CREATE POLICY "Only admins can manage templates"
    ON public.templates
    FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND users.role = 'admin'
    ));

-- Create policies for case components
CREATE POLICY "Users can manage their own case components"
    ON public.case_components
    FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.cases
        WHERE cases.id = case_id
        AND cases.user_id = auth.uid()
    ));

-- Create policies for case files
CREATE POLICY "Users can manage their own case files"
    ON public.case_files
    FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.cases
        WHERE cases.id = case_id
        AND cases.user_id = auth.uid()
    )); 