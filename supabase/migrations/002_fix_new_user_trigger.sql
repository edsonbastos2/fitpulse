-- ============================================
-- Fix: Tornar o trigger de novo usuário mais resiliente
-- ============================================

-- Drop do trigger antigo (se existir)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Recriar função com melhor tratamento de erros
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (
        user_id,
        name,
        avatar_url,
        level,
        goals,
        workout_frequency,
        preferred_duration,
        weekly_goal,
        current_streak,
        longest_streak,
        total_workouts,
        total_volume
    )
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', 'Atleta'),
        NEW.raw_user_meta_data->>'avatar_url',
        'beginner',
        ARRAY['general']::user_goal[],
        3,
        60,
        5,
        0,
        0,
        0,
        0
    );

    INSERT INTO public.app_settings (user_id)
    VALUES (NEW.id);

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log do erro mas permite o registro do usuário
        RAISE WARNING 'Falha ao criar perfil para usuário %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recriar trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
