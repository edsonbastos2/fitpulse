-- ============================================================
-- Seed: Catálogo de Exercícios
-- ============================================================
-- Adiciona grupos musculares, equipamentos e exercícios para testes
-- ============================================================

-- ============================================================
-- 1. Grupos Musculares
-- ============================================================
INSERT INTO public.muscle_groups (name, name_pt, category) VALUES
  ('chest', 'Peito', 'primary'),
  ('back', 'Costas', 'primary'),
  ('shoulders', 'Ombros', 'primary'),
  ('biceps', 'Bíceps', 'primary'),
  ('triceps', 'Tríceps', 'primary'),
  ('quadriceps', 'Quadríceps', 'primary'),
  ('hamstrings', 'Posterior da Coxa', 'primary'),
  ('glutes', 'Glúteos', 'primary'),
  ('calves', 'Panturrilhas', 'primary'),
  ('abs', 'Abdômen', 'primary'),
  ('lats', 'Dorsais', 'secondary'),
  ('traps', 'Trapézio', 'secondary'),
  ('forearms', 'Antebraço', 'secondary'),
  ('lower_back', 'Lombar', 'secondary'),
  ('obliques', 'Oblíquos', 'secondary')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- 2. Equipamentos
-- ============================================================
INSERT INTO public.equipment (name, name_pt, category) VALUES
  ('barbell', 'Barra', 'barbell'),
  ('dumbbell', 'Halter', 'dumbbell'),
  ('cable_machine', 'Polia', 'cable'),
  ('leg_press_machine', 'Leg Press', 'machine'),
  ('bench', 'Banco', 'machine'),
  ('pull_up_bar', 'Barra Fixa', 'bodyweight'),
  ('kettlebell', 'Kettlebell', 'kettlebell'),
  ('resistance_bands', 'Elástico', 'bands'),
  ('none', 'Peso Corporal', 'bodyweight'),
  ('smith_machine', 'Smith Machine', 'machine'),
  ('leg_curl_machine', 'Mesa Flexora', 'machine'),
  ('calf_raise_machine', 'Panturrilha em Pé', 'machine'),
  ('lat_pulldown_machine', 'Puxada Frontal', 'machine'),
  ('rowing_machine', 'Remada Sentada', 'machine')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- 3. Exercícios
-- ============================================================
-- Pega os IDs para referência
DO $$
DECLARE
  v_chest_id UUID;
  v_back_id UUID;
  v_shoulders_id UUID;
  v_biceps_id UUID;
  v_triceps_id UUID;
  v_quads_id UUID;
  v_hamstrings_id UUID;
  v_glutes_id UUID;
  v_abs_id UUID;
  v_traps_id UUID;
  v_lats_id UUID;
  v_lower_back_id UUID;
  v_forearms_id UUID;
  v_obliques_id UUID;
  v_calves_id UUID;
  v_barbell_id UUID;
  v_dumbbell_id UUID;
  v_cable_id UUID;
  v_bodyweight_id UUID;
  v_machine_id UUID;
  v_kettlebell_id UUID;
  v_bands_id UUID;
BEGIN
  -- Muscle group IDs
  SELECT id INTO v_chest_id FROM public.muscle_groups WHERE name = 'chest' LIMIT 1;
  SELECT id INTO v_back_id FROM public.muscle_groups WHERE name = 'back' LIMIT 1;
  SELECT id INTO v_shoulders_id FROM public.muscle_groups WHERE name = 'shoulders' LIMIT 1;
  SELECT id INTO v_biceps_id FROM public.muscle_groups WHERE name = 'biceps' LIMIT 1;
  SELECT id INTO v_triceps_id FROM public.muscle_groups WHERE name = 'triceps' LIMIT 1;
  SELECT id INTO v_quads_id FROM public.muscle_groups WHERE name = 'quadriceps' LIMIT 1;
  SELECT id INTO v_hamstrings_id FROM public.muscle_groups WHERE name = 'hamstrings' LIMIT 1;
  SELECT id INTO v_glutes_id FROM public.muscle_groups WHERE name = 'glutes' LIMIT 1;
  SELECT id INTO v_abs_id FROM public.muscle_groups WHERE name = 'abs' LIMIT 1;
  SELECT id INTO v_traps_id FROM public.muscle_groups WHERE name = 'traps' LIMIT 1;
  SELECT id INTO v_lats_id FROM public.muscle_groups WHERE name = 'lats' LIMIT 1;
  SELECT id INTO v_lower_back_id FROM public.muscle_groups WHERE name = 'lower_back' LIMIT 1;
  SELECT id INTO v_forearms_id FROM public.muscle_groups WHERE name = 'forearms' LIMIT 1;
  SELECT id INTO v_obliques_id FROM public.muscle_groups WHERE name = 'obliques' LIMIT 1;
  SELECT id INTO v_calves_id FROM public.muscle_groups WHERE name = 'calves' LIMIT 1;

  -- Equipment IDs
  SELECT id INTO v_barbell_id FROM public.equipment WHERE name = 'barbell' LIMIT 1;
  SELECT id INTO v_dumbbell_id FROM public.equipment WHERE name = 'dumbbell' LIMIT 1;
  SELECT id INTO v_cable_id FROM public.equipment WHERE name = 'cable_machine' LIMIT 1;
  SELECT id INTO v_bodyweight_id FROM public.equipment WHERE name = 'none' LIMIT 1;
  SELECT id INTO v_machine_id FROM public.equipment WHERE name = 'leg_press_machine' LIMIT 1;
  SELECT id INTO v_kettlebell_id FROM public.equipment WHERE name = 'kettlebell' LIMIT 1;
  SELECT id INTO v_bands_id FROM public.equipment WHERE name = 'resistance_bands' LIMIT 1;

  -- ============================================================
  -- PEITO
  -- ============================================================
  INSERT INTO public.exercises (name, name_pt, description, description_pt, instructions, instructions_pt, difficulty, primary_muscles, secondary_muscles, equipment_id, is_compound, is_cardio, calories_per_minute) VALUES
    ('Barbell Bench Press', 'Supino Reto com Barra', 'Exercício clássico de peito usando barra.', 'O supino reto é o exercício mais completo para desenvolvimento do peitoral maior.',
     ARRAY['Lie on flat bench', 'Grip bar shoulder-width', 'Lower to mid-chest', 'Press up to full extension'],
     ARRAY['Deite no banco plano', 'Segure a barra na largura dos ombros', 'Desça até o meio do peito', 'Empurre até a extensão completa'],
     'medium', ARRAY[v_chest_id], ARRAY[v_triceps_id, v_shoulders_id], v_barbell_id, TRUE, FALSE, 8),

    ('Incline Dumbbell Press', 'Supino Inclinado com Halteres', 'Supino com ângulo para focar na parte superior do peito.', 'Trabalha principalmente a porção clavicular do peitoral.',
     ARRAY['Set bench to 30-45 degrees', 'Hold dumbbells at shoulder level', 'Press up and together', 'Lower with control'],
     ARRAY['Ajuste o banco em 30-45 graus', 'Segure os halteres na altura dos ombros', 'Empurre para cima e para dentro', 'Desça com controle'],
     'medium', ARRAY[v_chest_id], ARRAY[v_shoulders_id, v_triceps_id], v_dumbbell_id, TRUE, FALSE, 7),

    ('Cable Crossover', 'Crossover na Polia', 'Isolamento de peito com polia.', 'Ótimo para definição e contração no final do movimento.',
     ARRAY['Stand between cables', 'Slight forward lean', 'Bring hands together at chest level', 'Squeeze chest at peak contraction'],
     ARRAY['Fique entre as polias', 'Incline levemente para frente', 'Traga as mãos juntas na altura do peito', 'Contraia o peito no topo'],
     'easy', ARRAY[v_chest_id], ARRAY[v_shoulders_id], v_cable_id, FALSE, FALSE, 5),

    ('Push-Ups', 'Flexão de Braço', 'Exercício básico com peso corporal.', 'Excelente para quem treina em casa. Variação: mãos estreitas para tríceps.',
     ARRAY['Start in plank position', 'Lower chest to floor', 'Push back up to starting position', 'Keep core tight throughout'],
     ARRAY['Comece na posição de prancha', 'Desça o peito até o chão', 'Empurre de volta à posição inicial', 'Mantenha o core contraído'],
     'easy', ARRAY[v_chest_id], ARRAY[v_triceps_id, v_shoulders_id], v_bodyweight_id, TRUE, FALSE, 6);

  -- ============================================================
  -- COSTAS
  -- ============================================================
  INSERT INTO public.exercises (name, name_pt, description, description_pt, instructions, instructions_pt, difficulty, primary_muscles, secondary_muscles, equipment_id, is_compound, is_cardio, calories_per_minute) VALUES
    ('Barbell Deadlift', 'Levantamento Terra', 'Rei dos exercícios compostos para costas.', 'Trabalha toda a cadeia posterior: costas, glúteos e posterior da coxa.',
     ARRAY['Stand with feet hip-width apart', 'Grip bar with hands outside knees', 'Hinge at hips and lift bar', 'Lower with control, keeping back flat'],
     ARRAY['Fique com pés na largura do quadril', 'Segure a barra com mãos fora dos joelhos', 'Flexione o quadril e levante', 'Desça com controle, costas retas'],
     'hard', ARRAY[v_back_id], ARRAY[v_glutes_id, v_hamstrings_id], v_barbell_id, TRUE, FALSE, 12),

    ('Pull-Ups', 'Barra Fixa', 'Exercício de costas com peso corporal.', 'Melhor exercício para largura das costas. Use banda elástica se precisar de ajuda.',
     ARRAY['Hang from bar with overhand grip', 'Pull chest toward bar', 'Squeeze shoulder blades at top', 'Lower with control'],
     ARRAY['Pendure na barra com pegada pronada', 'Puxe o peito em direção à barra', 'Contraia as escápulas no topo', 'Desça com controle'],
     'hard', ARRAY[v_back_id, v_lats_id], ARRAY[v_biceps_id, v_traps_id], v_bodyweight_id, TRUE, FALSE, 10),

    ('Barbell Row', 'Remada Curvada', 'Remada com barra para espessura das costas.', 'Mantenha o tronco próximo da horizontal para máxima ativação.',
     ARRAY['Bend at hips, back flat', 'Grip bar with hands shoulder-width', 'Pull bar to lower chest', 'Squeeze back at top'],
     ARRAY['Flexione o quadril, costas retas', 'Segure a barra na largura dos ombros', 'Puxe a barra até o peito inferior', 'Contraia as costas no topo'],
     'medium', ARRAY[v_back_id], ARRAY[v_biceps_id, v_traps_id], v_barbell_id, TRUE, FALSE, 9),

    ('Lat Pulldown', 'Puxada Frontal', 'Puxada na máquina para iniciantes.', 'Excelente alternativa à barra fixa para quem está começando.',
     ARRAY['Sit with thighs secured', 'Grip bar wider than shoulders', 'Pull bar to upper chest', 'Control the return'],
     ARRAY['Sente com as coxas presas', 'Segure a barra mais larga que os ombros', 'Puxe a barra até o peito superior', 'Controle o retorno'],
     'easy', ARRAY[v_back_id, v_lats_id], ARRAY[v_biceps_id], v_machine_id, TRUE, FALSE, 7);

  -- ============================================================
  -- PERNAS
  -- ============================================================
  INSERT INTO public.exercises (name, name_pt, description, description_pt, instructions, instructions_pt, difficulty, primary_muscles, secondary_muscles, equipment_id, is_compound, is_cardio, calories_per_minute) VALUES
    ('Barbell Squat', 'Agachamento com Barra', 'Rei dos exercícios de pernas.', 'Desenvolve quadríceps, glúteos e core. Mantenha os joelhos alinhados com os pés.',
     ARRAY['Bar on upper back', 'Feet shoulder-width apart', 'Lower hips back and down', 'Drive through heels to stand'],
     ARRAY['Barra nas costas superiores', 'Pés na largura dos ombros', 'Desça o quadril para trás', 'Empurre pelos calcanhares para subir'],
     'hard', ARRAY[v_quads_id], ARRAY[v_glutes_id, v_hamstrings_id], v_barbell_id, TRUE, FALSE, 11),

    ('Romanian Deadlift', 'Stiff com Halteres', 'Foco no posterior da coxa.', 'Mantenha as pernas quase estendidas e foque na flexão do quadril.',
     ARRAY['Hold dumbbells in front of thighs', 'Slight bend in knees', 'Hinge at hips, lower weights', 'Feel stretch in hamstrings, then return'],
     ARRAY['Segure halteres à frente das coxas', 'Leve flexão nos joelhos', 'Flexione o quadril, desça os pesos', 'Sinta o alongamento no posterior, depois volte'],
     'medium', ARRAY[v_hamstrings_id], ARRAY[v_glutes_id, v_lower_back_id], v_dumbbell_id, TRUE, FALSE, 8),

    ('Leg Press', 'Leg Press 45°', 'Máquina de pernas para quadríceps.', 'Permite carga pesada com segurança. Não tranque os joelhos no topo.',
     ARRAY['Sit with back flat against pad', 'Feet shoulder-width on platform', 'Lower weight until knees at 90 degrees', 'Press through heels to extend legs'],
     ARRAY['Sente com costas apoiadas', 'Pés na plataforma na largura dos ombros', 'Desça até joelhos a 90 graus', 'Empurre pelos calcanhares para estender'],
     'medium', ARRAY[v_quads_id], ARRAY[v_glutes_id], v_machine_id, TRUE, FALSE, 9),

    ('Walking Lunges', 'Avanço Caminhando', 'Avanço dinâmico com halteres.', 'Excelente para equilíbrio e desenvolvimento unilateral.',
     ARRAY['Hold dumbbells at sides', 'Step forward into lunge position', 'Lower back knee toward ground', 'Push off front foot to next step'],
     ARRAY['Segure halteres ao lado do corpo', 'Dê um passo à frente em posição de afundo', 'Desça o joelho de trás em direção ao chão', 'Empurre com o pé da frente para o próximo passo'],
     'medium', ARRAY[v_quads_id], ARRAY[v_glutes_id, v_hamstrings_id], v_dumbbell_id, TRUE, FALSE, 10);

  -- ============================================================
  -- OMBROS
  -- ============================================================
  INSERT INTO public.exercises (name, name_pt, description, description_pt, instructions, instructions_pt, difficulty, primary_muscles, secondary_muscles, equipment_id, is_compound, is_cardio, calories_per_minute) VALUES
    ('Overhead Press', 'Desenvolvimento com Barra', 'Exercício composto para ombros.', 'Fique em pé, core contraído. Não arqueie as costas.',
     ARRAY['Bar at shoulder level', 'Press bar overhead', 'Full arm extension at top', 'Lower to shoulders with control'],
     ARRAY['Barra na altura dos ombros', 'Empurre a barra acima da cabeça', 'Extensão completa dos braços no topo', 'Desça até os ombros com controle'],
     'medium', ARRAY[v_shoulders_id], ARRAY[v_triceps_id, v_traps_id], v_barbell_id, TRUE, FALSE, 7),

    ('Lateral Raises', 'Elevação Lateral', 'Isolamento de ombros para largura.', 'Use peso leve e foque na contração. Não use impulso.',
     ARRAY['Hold dumbbells at sides', 'Raise arms to shoulder height', 'Slight bend in elbows', 'Lower with control'],
     ARRAY['Segure halteres ao lado do corpo', 'Eleve os braços até a altura dos ombros', 'Leve flexão nos cotovelos', 'Desça com controle'],
     'easy', ARRAY[v_shoulders_id], ARRAY[v_traps_id], v_dumbbell_id, FALSE, FALSE, 4),

    ('Face Pulls', 'Puxada no Rosto', 'Exercício para ombro posterior e postura.', 'Essencial para quem trabalha sentado. Foca na rotação externa.',
     ARRAY['Cable at face height', 'Pull rope to face', 'Squeeze shoulder blades', 'External rotation at end'],
     ARRAY['Polia na altura do rosto', 'Puxe a corda em direção ao rosto', 'Contraia as escápulas', 'Rotação externa no final'],
     'easy', ARRAY[v_shoulders_id], ARRAY[v_traps_id, v_back_id], v_cable_id, FALSE, FALSE, 4);

  -- ============================================================
  -- BRAÇOS
  -- ============================================================
  INSERT INTO public.exercises (name, name_pt, description, description_pt, instructions, instructions_pt, difficulty, primary_muscles, secondary_muscles, equipment_id, is_compound, is_cardio, calories_per_minute) VALUES
    ('Barbell Curl', 'Rosca Direta com Barra', 'Exercício clássico de bíceps.', 'Mantenha os cotovelos fixos ao lado do corpo. Não balance o tronco.',
     ARRAY['Grip bar shoulder-width, palms up', 'Curl bar to shoulder level', 'Squeeze biceps at top', 'Lower with control'],
     ARRAY['Segure a barra na largura dos ombros, palmas para cima', 'Flexione até a altura dos ombros', 'Contraia os bíceps no topo', 'Desça com controle'],
     'easy', ARRAY[v_biceps_id], ARRAY[v_forearms_id], v_barbell_id, FALSE, FALSE, 4),

    ('Tricep Dips', 'Mergulho para Tríceps', 'Exercício composto para tríceps.', 'Incline o tronco para frente para focar nos tríceps.',
     ARRAY['Support body on parallel bars', 'Lower body by bending elbows', 'Push back up to full extension', 'Keep elbows close to body'],
     ARRAY['Apoie o corpo nas barras paralelas', 'Desça o corpo flexionando os cotovelos', 'Empurre de volta até a extensão completa', 'Mantenha os cotovelos próximos ao corpo'],
     'medium', ARRAY[v_triceps_id], ARRAY[v_chest_id, v_shoulders_id], v_bodyweight_id, TRUE, FALSE, 6),

    ('Hammer Curls', 'Rosca Martelo', 'Rosca alternada com pegada neutra.', 'Trabalha bíceps e braquiorradial. Ótimo para antebraço.',
     ARRAY['Hold dumbbells with neutral grip', 'Curl one dumbbell at a time', 'Keep elbows stationary', 'Lower with control'],
     ARRAY['Segure halteres com pegada neutra', 'Flexione um haltere de cada vez', 'Mantenha os cotovelos fixos', 'Desça com controle'],
     'easy', ARRAY[v_biceps_id], ARRAY[v_forearms_id], v_dumbbell_id, FALSE, FALSE, 4);

  -- ============================================================
  -- ABDÔMEN
  -- ============================================================
  INSERT INTO public.exercises (name, name_pt, description, description_pt, instructions, instructions_pt, difficulty, primary_muscles, secondary_muscles, equipment_id, is_compound, is_cardio, calories_per_minute) VALUES
    ('Plank', 'Prancha', 'Exercício isométrico para core.', 'Mantenha o corpo alinhado como uma tábua. Contraia o abdômen e glúteos.',
     ARRAY['Start on forearms and toes', 'Body in straight line', 'Hold position', 'Breathe normally'],
     ARRAY['Comece nos antebraços e pontas dos pés', 'Corpo em linha reta', 'Mantenha a posição', 'Respire normalmente'],
     'easy', ARRAY[v_abs_id], ARRAY[v_shoulders_id, v_glutes_id], v_bodyweight_id, FALSE, FALSE, 5),

    ('Hanging Leg Raises', 'Elevação de Pernas Suspensa', 'Exercício avançado para abdômen inferior.', 'Use uma barra fixa. Controle o balanço.',
     ARRAY['Hang from pull-up bar', 'Raise legs to 90 degrees', 'Lower with control', 'Avoid swinging'],
     ARRAY['Pendure na barra fixa', 'Eleve as pernas a 90 graus', 'Desça com controle', 'Evite balançar'],
     'hard', ARRAY[v_abs_id], ARRAY[v_obliques_id], v_bodyweight_id, FALSE, FALSE, 6);

  -- ============================================================
  -- CARDIO
  -- ============================================================
  INSERT INTO public.exercises (name, name_pt, description, description_pt, instructions, instructions_pt, difficulty, primary_muscles, secondary_muscles, equipment_id, is_compound, is_cardio, calories_per_minute) VALUES
    ('Jumping Jacks', 'Polichinelo', 'Aquecimento clássico de cardio.', 'Ótimo para iniciar o treino. Mantenha um ritmo constante.',
     ARRAY['Stand with feet together', 'Jump feet apart while raising arms', 'Jump back to starting position', 'Maintain steady rhythm'],
     ARRAY['Fique com pés juntos', 'Salte abrindo as pernas e levantando os braços', 'Salte de volta à posição inicial', 'Mantenha ritmo constante'],
     'easy', ARRAY[v_quads_id], ARRAY[v_glutes_id, v_calves_id], v_bodyweight_id, FALSE, TRUE, 12),

    ('Burpees', 'Burpee', 'Exercício de corpo inteiro e cardio intenso.', 'Combina agachamento, flexão e salto. Alta queima calórica.',
     ARRAY['Start standing', 'Drop to squat, hands on floor', 'Jump feet back to plank', 'Jump feet forward, then jump up'],
     ARRAY['Comece em pé', 'Desça ao agachamento, mãos no chão', 'Salte os pés para trás em prancha', 'Salte os pés para frente, depois salte para cima'],
     'hard', ARRAY[v_quads_id], ARRAY[v_chest_id, v_abs_id], v_bodyweight_id, TRUE, TRUE, 15);

  RAISE NOTICE 'Seed completed successfully!';
END $$;
