-- Insert dummy clinic branch
INSERT INTO public.clinic_branches (id, branch_name, address, phone)
VALUES ('11111111-1111-1111-1111-111111111111', 'SmileSync Central', '123 Main St, Tech City', '+1234567890');

-- Insert a dummy dentist (note: we need to create an auth user for them first, or just insert into dentists if we bypass auth foreign key checks... wait! dentist id references auth.users(id))
-- Actually, it's safer to just let the Admin create them if we have an admin dashboard, but for quick testing, we can inject a user into auth.users.

INSERT INTO auth.users (id, instance_id, email, role, aud, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES 
('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'dr.smith@smilesync.com', 'authenticated', 'authenticated', crypt('password123', gen_salt('bf')), now(), '{"role": "DENTIST"}', '{"full_name": "Dr. Sarah Smith"}', now(), now());

INSERT INTO public.dentists (id, name, specialization, consultation_fee, status)
VALUES ('22222222-2222-2222-2222-222222222222', 'Dr. Sarah Smith', 'Orthodontist', 150.00, 'active');
