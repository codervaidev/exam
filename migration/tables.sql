CREATE TABLE IF NOT EXISTS "free_exam_users" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    district TEXT,
    thana TEXT,
    institute TEXT,
    role TEXT NOT NULL DEFAULT 'USER',
    level TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "free_exam_sessions" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_free_exam_sessions_user FOREIGN KEY (user_id) REFERENCES "free_exam_users" (id) ON DELETE CASCADE
);

alter table "free_exam_sessions" drop column "expires_at";

alter table "free_exam_sessions"
add column "expires_at" TIMESTAMP NOT NULL;

CREATE TABLE "free_exam_campaigns" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    total_exam INT NOT NULL DEFAULT 0,
    level TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "free_exam_exams" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    level TEXT NOT NULL,
    campaign_id UUID NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    duration INT NOT NULL,
    total_marks INT NOT NULL,
    result_publish_time TIMESTAMP NOT NULL,
    solution_publish_time TIMESTAMP NOT NULL,
    shuffle_questions BOOLEAN NOT NULL DEFAULT FALSE,
    negative_marking BOOLEAN NOT NULL DEFAULT FALSE,
    data JSON DEFAULT '{}',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "free_exam_questions" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    question TEXT NOT NULL,
    difficulty TEXT DEFAULT 'Medium',
    subject TEXT NOT NULL,
    exam_id UUID NOT NULL,
    explain TEXT,
    "order" INT NOT NULL DEFAULT 0,
    extra BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_free_exam_questions_exam FOREIGN KEY (exam_id) REFERENCES "free_exam_exams" (id)
);

CREATE TABLE "free_exam_question_options" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    option_text TEXT NOT NULL,
    correct BOOLEAN NOT NULL,
    question_id UUID NOT NULL,
    CONSTRAINT fk_free_exam_question_options_question FOREIGN KEY (question_id) REFERENCES "free_exam_questions" (id)
);

CREATE INDEX free_exam_question_id_index ON "free_exam_question_options" (question_id);

CREATE TABLE "free_exam_submissions" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL,
    exam_id UUID NOT NULL,
    answers TEXT [] NOT NULL,
    questions TEXT [] NOT NULL,
    attempt INT NOT NULL DEFAULT 1,
    marks FLOAT NOT NULL DEFAULT 0,
    correct INT NOT NULL DEFAULT 0,
    incorrect INT NOT NULL DEFAULT 0,
    skipped INT NOT NULL DEFAULT 0,
    duration INT,
    status TEXT NOT NULL DEFAULT 'pending',
    submitted_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_free_exam_submissions_user FOREIGN KEY (user_id) REFERENCES "free_exam_users" (id),
    CONSTRAINT fk_free_exam_submissions_exam FOREIGN KEY (exam_id) REFERENCES "free_exam_exams" (id)
);

CREATE INDEX free_exam_user_id_index ON "free_exam_submissions" (user_id);

CREATE INDEX free_exam_exam_id_index ON "free_exam_submissions" (exam_id);