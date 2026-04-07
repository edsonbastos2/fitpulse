-- ============================================
-- FitPulse - Schema do Banco de Dados
-- ============================================

-- ============================================
-- EXTENSÕES
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TIPOS PERSONALIZADOS
-- ============================================

-- Nível do usuário
CREATE TYPE user_level AS ENUM ('beginner', 'intermediate', 'advanced');

-- Objetivos do usuário
CREATE TYPE user_goal AS ENUM ('weight_loss', 'muscle_gain', 'endurance', 'flexibility', 'general');

-- Tipo de treino
CREATE TYPE workout_type AS ENUM ('strength', 'cardio', 'hiit', 'flexibility', 'mixed');

-- Status da sessão
CREATE TYPE session_status AS ENUM ('planned', 'in_progress', 'completed', 'skipped');

-- ============================================
-- TABELAS
-- ============================================

-- Perfil do Usuário
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    avatar_url TEXT,
    level user_level NOT NULL DEFAULT 'beginner',
    goals user_goal[] NOT NULL DEFAULT ARRAY['general'],
    restrictions TEXT[] DEFAULT ARRAY[]::TEXT[],
    experience_years INTEGER DEFAULT 0,
    workout_frequency INTEGER NOT NULL DEFAULT 3, -- dias por semana
    preferred_duration INTEGER NOT NULL DEFAULT 60, -- minutos
    equipment_available TEXT[] DEFAULT ARRAY[]::TEXT[],
    injuries TEXT[] DEFAULT ARRAY[]::TEXT[],
    body_weight DECIMAL(5,2),
    body_height DECIMAL(5,2),
    body_age INTEGER,
    body_gender TEXT CHECK (body_gender IN ('male', 'female', 'other')),
    weekly_goal INTEGER DEFAULT 5,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    total_workouts INTEGER DEFAULT 0,
    total_volume DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Grupos Musculares
CREATE TABLE muscle_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    name_pt TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('primary', 'secondary')),
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Equipamentos
CREATE TABLE equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    name_pt TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('barbell', 'dumbbell', 'machine', 'cable', 'bodyweight', 'kettlebell', 'bands', 'other')),
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Exercícios
CREATE TABLE exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    name_pt TEXT NOT NULL,
    description TEXT,
    description_pt TEXT,
    instructions TEXT[],
    instructions_pt TEXT[],
    video_url TEXT,
    image_url TEXT,
    thumbnail_url TEXT,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    primary_muscles UUID[] DEFAULT ARRAY[]::UUID[],
    secondary_muscles UUID[] DEFAULT ARRAY[]::UUID[],
    equipment_id UUID REFERENCES equipment(id),
    is_compound BOOLEAN DEFAULT FALSE,
    is_cardio BOOLEAN DEFAULT FALSE,
    calories_per_minute INTEGER,
    is_custom BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Treinos
CREATE TABLE workouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    type workout_type NOT NULL DEFAULT 'strength',
    difficulty user_level NOT NULL DEFAULT 'beginner',
    estimated_duration INTEGER NOT NULL DEFAULT 60, -- minutos
    is_template BOOLEAN DEFAULT FALSE,
    is_recommended BOOLEAN DEFAULT FALSE,
    recommended_for UUID[], -- IDs de profiles que foram recomendados
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    cover_image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Exercícios do Treino
CREATE TABLE workout_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id),
    order_index INTEGER NOT NULL DEFAULT 0,
    sets INTEGER NOT NULL DEFAULT 3,
    reps INTEGER, -- NULL para exercícios de tempo
    duration_seconds INTEGER, -- NULL para exercícios de repetições
    rest_seconds INTEGER NOT NULL DEFAULT 60,
    notes TEXT,
    rpe INTEGER CHECK (rpe >= 1 AND rpe <= 10), -- Rate of Perceived Exertion
    superset_group INTEGER, -- Para exercícios em superset
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sessões de Treino (instâncias de treino)
CREATE TABLE workout_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    workout_id UUID NOT NULL REFERENCES workouts(id),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    status session_status NOT NULL DEFAULT 'planned',
    notes TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Log de Treino (registro de cada série executada)
CREATE TABLE workout_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
    workout_exercise_id UUID NOT NULL REFERENCES workout_exercises(id),
    set_number INTEGER NOT NULL DEFAULT 1,
    weight DECIMAL(6,2), -- kg
    reps INTEGER,
    duration_seconds INTEGER,
    rpe INTEGER CHECK (rpe >= 1 AND rpe <= 10),
    completed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Treinos Agendados
CREATE TABLE scheduled_workouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    workout_id UUID NOT NULL REFERENCES workouts(id),
    scheduled_date DATE NOT NULL,
    scheduled_time TIME,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'skipped')),
    reminder_enabled BOOLEAN DEFAULT TRUE,
    reminder_minutes_before INTEGER DEFAULT 30,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, scheduled_date, workout_id)
);

-- Conquistas/Badges
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    name_pt TEXT NOT NULL,
    description TEXT,
    description_pt TEXT,
    icon TEXT NOT NULL,
    category TEXT NOT NULL, -- streak, volume, workouts, etc
    requirement JSONB NOT NULL, -- { type: 'streak', value: 7 }
    points INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Conquistas do Usuário
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id),
    earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Preferências do App
CREATE TABLE app_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark', 'system')),
    notifications_enabled BOOLEAN DEFAULT TRUE,
    reminder_time TIME DEFAULT '09:00',
    weight_unit TEXT DEFAULT 'kg' CHECK (weight_unit IN ('kg', 'lb')),
    language TEXT DEFAULT 'pt-BR',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ============================================
-- ÍNDICES
-- ============================================

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_workouts_user_id ON workouts(user_id);
CREATE INDEX idx_workouts_type ON workouts(type);
CREATE INDEX idx_workout_exercises_workout_id ON workout_exercises(workout_id);
CREATE INDEX idx_workout_sessions_user_id ON workout_sessions(user_id);
CREATE INDEX idx_workout_sessions_workout_id ON workout_sessions(workout_id);
CREATE INDEX idx_workout_sessions_status ON workout_sessions(status);
CREATE INDEX idx_workout_logs_session_id ON workout_logs(session_id);
CREATE INDEX idx_scheduled_workouts_user_id ON scheduled_workouts(user_id);
CREATE INDEX idx_scheduled_workouts_date ON scheduled_workouts(scheduled_date);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty);
CREATE INDEX idx_exercises_is_cardio ON exercises(is_cardio);

-- ============================================
-- FUNÇÕES
-- ============================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para incrementar streak
CREATE OR REPLACE FUNCTION update_streak()
RETURNS TRIGGER AS $$
DECLARE
    last_workout_date DATE;
    current_streak INTEGER;
BEGIN
    IF NEW.status = 'completed' THEN
        SELECT scheduled_date INTO last_workout_date
        FROM workout_sessions ws
        WHERE ws.user_id = NEW.user_id
        AND ws.id != NEW.id
        AND ws.status = 'completed'
        ORDER BY ws.completed_at DESC
        LIMIT 1;

        SELECT current_streak INTO current_streak
        FROM user_profiles
        WHERE user_id = NEW.user_id;

        IF last_workout_date IS NULL OR (NEW.scheduled_date - last_workout_date) = 1 THEN
            UPDATE user_profiles
            SET current_streak = current_streak + 1,
                longest_streak = GREATEST(longest_streak, current_streak + 1),
                total_workouts = total_workouts + 1
            WHERE user_id = NEW.user_id;
        ELSE
            UPDATE user_profiles
            SET current_streak = 1,
                total_workouts = total_workouts + 1
            WHERE user_id = NEW.user_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_exercises_updated_at
    BEFORE UPDATE ON exercises
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_workouts_updated_at
    BEFORE UPDATE ON workouts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_app_settings_updated_at
    BEFORE UPDATE ON app_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Políticas para user_profiles
CREATE POLICY "Users can view own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
    ON user_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Políticas para workouts
CREATE POLICY "Users can view own workouts"
    ON workouts FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own workouts"
    ON workouts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workouts"
    ON workouts FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workouts"
    ON workouts FOR DELETE
    USING (auth.uid() = user_id);

-- Políticas para workout_exercises
CREATE POLICY "Users can manage own workout exercises"
    ON workout_exercises FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM workouts
            WHERE workouts.id = workout_exercises.workout_id
            AND (workouts.user_id = auth.uid() OR workouts.user_id IS NULL)
        )
    );

-- Políticas para workout_sessions
CREATE POLICY "Users can manage own sessions"
    ON workout_sessions FOR ALL
    USING (auth.uid() = user_id);

-- Políticas para workout_logs
CREATE POLICY "Users can manage own logs"
    ON workout_logs FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM workout_sessions
            WHERE workout_sessions.id = workout_logs.session_id
            AND workout_sessions.user_id = auth.uid()
        )
    );

-- Políticas para scheduled_workouts
CREATE POLICY "Users can manage own scheduled workouts"
    ON scheduled_workouts FOR ALL
    USING (auth.uid() = user_id);

-- Políticas para user_achievements
CREATE POLICY "Users can view own achievements"
    ON user_achievements FOR SELECT
    USING (auth.uid() = user_id);

-- Políticas para app_settings
CREATE POLICY "Users can manage own settings"
    ON app_settings FOR ALL
    USING (auth.uid() = user_id);

-- ============================================
-- SEED DATA - Grupos Musculares
-- ============================================

INSERT INTO muscle_groups (name, name_pt, category) VALUES
('Chest', 'Peito', 'primary'),
('Back', 'Costas', 'primary'),
('Shoulders', 'Ombros', 'primary'),
('Biceps', 'Bíceps', 'primary'),
('Triceps', 'Tríceps', 'primary'),
('Quadriceps', 'Quadríceps', 'primary'),
('Hamstrings', 'Posterior de coxa', 'primary'),
('Glutes', 'Glúteos', 'primary'),
('Calves', 'Panturrilha', 'primary'),
('Core', 'Core/Abdômen', 'primary'),
('Forearms', 'Antebraço', 'secondary'),
('Traps', 'Trapézio', 'secondary'),
('Lats', 'Latíssimo', 'secondary'),
('Adductors', 'Adutores', 'secondary'),
('Abductors', 'Abdutores', 'secondary');

-- ============================================
-- SEED DATA - Equipamentos
-- ============================================

INSERT INTO equipment (name, name_pt, category) VALUES
('Barbell', 'Barra', 'barbell'),
('Dumbbell', 'Halteres', 'dumbbell'),
('Kettlebell', 'Kettlebell', 'kettlebell'),
('Cable Machine', 'Máquina de cabos', 'cable'),
('Leg Press Machine', 'Leg press', 'machine'),
('Lat Pulldown Machine', 'Puxada frontal', 'machine'),
('Chest Press Machine', 'Supino máquina', 'machine'),
('Smith Machine', 'Smith machine', 'machine'),
('EZ Bar', 'Barra EZ', 'barbell'),
('Resistance Bands', 'Elásticos', 'bands'),
('Pull-up Bar', 'Barra fixa', 'bodyweight'),
('Dip Station', 'Bars paralelas', 'bodyweight'),
('Medicine Ball', 'Bola medicin', 'other'),
('None (Bodyweight)', 'Peso corporal', 'bodyweight');

-- ============================================
-- SEED DATA - Exercícios Populares
-- ============================================

INSERT INTO exercises (name, name_pt, description, description_pt, instructions, instructions_pt, difficulty, is_compound, is_cardio, calories_per_minute) VALUES
('Bench Press', 'Supino Reto', 'Classic chest exercise with barbell', 'Exercício clássico de peito com barra', ARRAY['Lie on bench', 'Grip bar slightly wider than shoulders', 'Lower to chest', 'Press up'], ARRAY['Deite no banco', 'Segure a barra levemente mais larga que os ombros', 'Desça até o peito', 'Pressione para cima'], 'medium', true, false, 8),

('Squat', 'Agachamento', 'Fundamental leg exercise', 'Exercício fundamental de pernas', ARRAY['Stand with feet shoulder-width', 'Lower hips back and down', 'Keep chest up', 'Return to standing'], ARRAY['Fique em pé com os pés na largura dos ombros', 'Desça os quadris para trás e para baixo', 'Mantenha o peito erguido', 'Volte para posição em pé'], 'medium', true, false, 10),

('Deadlift', 'Levantamento Terra', 'Full body pulling exercise', 'Exercício de puxar para todo o corpo', ARRAY['Stand with feet hip-width', 'Hinge at hips', 'Grip bar', 'Lift by extending hips and knees'], ARRAY['Fique em pé com os pés na largura do quadril', 'Flexione no quadril', 'Segure a barra', 'Levante estendendo quadril e joelhos'], 'hard', true, false, 12),

('Pull-up', 'Barra Fixa', 'Upper body pulling exercise', 'Exercício de puxar para parte superior', ARRAY['Hang from bar with overhand grip', 'Pull body up until chin over bar', 'Lower with control'], ARRAY['Pendure-se na barra com pegada pronada', 'Puxe o corpo até o queixo passar da barra', 'Desça com controle'], 'hard', true, false, 9),

('Plank', 'Prancha', 'Core stability exercise', 'Exercício de estabilidade do core', ARRAY['Get in push-up position', 'Rest on forearms', 'Keep body straight', 'Hold position'], ARRAY['Fique na posição de flexão', 'Apoie nos antebraços', 'Mantenha o corpo reto', 'Mantenha a posição'], 'easy', false, false, 5),

('Push-up', 'Flexão', 'Classic bodyweight chest exercise', 'Exercício clássico de peito com peso corporal', ARRAY['Start in plank position', 'Lower chest to floor', 'Push back up'], ARRAY['Comece na posição de prancha', 'Baixe o peito até o chão', 'Empurre de volta'], 'easy', true, false, 7),

('Lunges', 'Avanço', 'Unilateral leg exercise', 'Exercício unilateral de pernas', ARRAY['Step forward', 'Lower back knee toward floor', 'Push back to start'], ARRAY['Dê um passo à frente', 'Baixe o joelho de trás em direção ao chão', 'Empurre de volta ao início'], 'easy', true, false, 6),

('Bicep Curl', 'Rosca Direta', 'Isolation exercise for biceps', 'Exercício de isolamento para bíceps', ARRAY['Stand with dumbbells', 'Curl weights up', 'Squeeze biceps', 'Lower with control'], ARRAY['Fique em pé com halteres', 'Curle os pesos para cima', 'Aperte os bíceps', 'Desça com controle'], 'easy', false, false, 4),

('Tricep Pushdown', 'Tríceps Pulley', 'Cable exercise for triceps', 'Exercício com cabo para tríceps', ARRAY['Face cable machine', 'Grip bar', 'Push down until arms straight', 'Control return'], ARRAY['Fique de frente para a máquina de cabo', 'Segure a barra', 'Empurre para baixo até os braços ficarem retos', 'Controle o retorno'], 'easy', false, false, 4),

('Leg Press', 'Leg Press', 'Machine exercise for legs', 'Exercício na máquina para pernas', ARRAY['Sit in leg press', 'Place feet on platform', 'Lower weight', 'Press back up'], ARRAY['Sente na leg press', 'Coloque os pés na plataforma', 'Baixe o peso', 'Pressione de volta'], 'medium', true, false, 8);

-- ============================================
-- SEED DATA - Conquistas
-- ============================================

INSERT INTO achievements (name, name_pt, description, description_pt, icon, category, requirement, points) VALUES
('First Workout', 'Primeiro Treino', 'Complete your first workout', 'Complete seu primeiro treino', 'trophy', 'workouts', '{"type": "total_workouts", "value": 1}', 10),
('10 Workouts', '10 Treinos', 'Complete 10 workouts', 'Complete 10 treinos', 'medal', 'workouts', '{"type": "total_workouts", "value": 10}', 50),
('50 Workouts', '50 Treinos', 'Complete 50 workouts', 'Complete 50 treinos', 'award', 'workouts', '{"type": "total_workouts", "value": 50}', 100),
('Week Warrior', 'Guerreiro da Semana', '7 day workout streak', '7 dias seguidos de treino', 'fire', 'streak', '{"type": "streak", "value": 7}', 75),
('Month Master', 'Mestre do Mês', '30 day workout streak', '30 dias seguidos de treino', 'star', 'streak', '{"type": "streak", "value": 30}', 200),
('Volume King', 'Rei do Volume', 'Lift 10,000 kg total', 'Levante 10.000 kg no total', 'dumbbell', 'volume', '{"type": "total_volume", "value": 10000}', 150),
('Early Bird', 'Madrugador', 'Complete 10 workouts before 9 AM', 'Complete 10 treinos antes das 9h', 'sun', 'special', '{"type": "early_workouts", "value": 10}', 50),
('Night Owl', 'Coruja', 'Complete 10 workouts after 9 PM', 'Complete 10 treinos depois das 21h', 'moon', 'special', '{"type": "night_workouts", "value": 10}', 50);

-- ============================================
-- FUNÇÃO PARA CRIAR PERFIL AUTOMATICAMENTE
-- ============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (user_id, name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', 'Atleta'),
        NEW.raw_user_meta_data->>'avatar_url'
    );

    INSERT INTO app_settings (user_id)
    VALUES (NEW.id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil quando novo usuário se registra
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- HABILITAR REALTIME (opcional)
-- ============================================
-- ALTER PUBLICATION supabase_realtime ADD TABLE workout_sessions;
-- ALTER PUBLICATION supabase_realtime ADD TABLE workout_logs;
