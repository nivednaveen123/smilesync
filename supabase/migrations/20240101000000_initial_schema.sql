-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum for roles
CREATE TYPE public.user_role AS ENUM ('PATIENT', 'DENTIST', 'ADMIN');

-- Profiles table (extends auth.users)
CREATE TABLE public.patient_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dentists
CREATE TABLE public.dentists (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    specialization TEXT,
    consultation_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clinic Branches
CREATE TABLE public.clinic_branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.patient_profiles(id) ON DELETE CASCADE NOT NULL,
    dentist_id UUID REFERENCES public.dentists(id) ON DELETE CASCADE NOT NULL,
    branch_id UUID REFERENCES public.clinic_branches(id) ON DELETE CASCADE NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, confirmed, completed, cancelled, rescheduled
    payment_status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, refunded
    booking_reference TEXT UNIQUE,
    reserved_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT prevent_double_booking UNIQUE (appointment_date, appointment_time, dentist_id)
);

-- Payments
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_gateway TEXT NOT NULL,
    transaction_id TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Medical Notes
CREATE TABLE public.medical_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE NOT NULL,
    dentist_id UUID REFERENCES public.dentists(id) ON DELETE CASCADE NOT NULL,
    note TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID, -- Optional, can be null for system actions
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    old_value JSONB,
    new_value JSONB,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.patient_profiles(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.patient_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dentists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Functions for Roles

-- Check if User is Admin
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if User is Dentist
CREATE OR REPLACE FUNCTION public.is_dentist() RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.jwt() -> 'app_metadata' ->> 'role') = 'DENTIST' OR EXISTS (SELECT 1 FROM public.dentists WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies

-- Patient Profiles
CREATE POLICY "Patients can view own profile" ON public.patient_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Patients can update own profile" ON public.patient_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins have full access to patient profiles" ON public.patient_profiles FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Dentists can view patient profiles" ON public.patient_profiles FOR SELECT TO authenticated USING (public.is_dentist());

-- Dentists
CREATE POLICY "Anyone can view dentists" ON public.dentists FOR SELECT USING (true);
CREATE POLICY "Admins have full access to dentists" ON public.dentists FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Dentists can update own profile" ON public.dentists FOR UPDATE USING (auth.uid() = id);

-- Clinic Branches
CREATE POLICY "Anyone can view clinic branches" ON public.clinic_branches FOR SELECT USING (true);
CREATE POLICY "Admins have full access to branches" ON public.clinic_branches FOR ALL TO authenticated USING (public.is_admin());

-- Appointments
CREATE POLICY "Patients can view own appointments" ON public.appointments FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Patients can insert own appointments" ON public.appointments FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Patients can update own appointments" ON public.appointments FOR UPDATE USING (auth.uid() = patient_id);
CREATE POLICY "Dentists can view their appointments" ON public.appointments FOR SELECT USING (auth.uid() = dentist_id);
CREATE POLICY "Dentists can update their appointments" ON public.appointments FOR UPDATE USING (auth.uid() = dentist_id);
CREATE POLICY "Admins have full access to appointments" ON public.appointments FOR ALL TO authenticated USING (public.is_admin());

-- Payments
CREATE POLICY "Patients can view own payments" ON public.payments FOR SELECT USING (EXISTS (SELECT 1 FROM public.appointments a WHERE a.id = appointment_id AND a.patient_id = auth.uid()));
CREATE POLICY "Admins have full access to payments" ON public.payments FOR ALL TO authenticated USING (public.is_admin());

-- Medical Notes
CREATE POLICY "Dentists can view notes for their patients" ON public.medical_notes FOR SELECT USING (auth.uid() = dentist_id);
CREATE POLICY "Dentists can insert notes" ON public.medical_notes FOR INSERT WITH CHECK (auth.uid() = dentist_id);
CREATE POLICY "Dentists can update own notes" ON public.medical_notes FOR UPDATE USING (auth.uid() = dentist_id);
CREATE POLICY "Admins have full access to medical notes" ON public.medical_notes FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Patients can view own notes" ON public.medical_notes FOR SELECT USING (EXISTS (SELECT 1 FROM public.appointments a WHERE a.id = appointment_id AND a.patient_id = auth.uid()));

-- Audit Logs
CREATE POLICY "Admins have full access to audit logs" ON public.audit_logs FOR ALL TO authenticated USING (public.is_admin());
-- Insert by service role or triggers, so no manual insert policy needed for users.

-- Notifications
CREATE POLICY "Patients can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Admins have full access to notifications" ON public.notifications FOR ALL TO authenticated USING (public.is_admin());

-- Triggers for Audit Logging (Appointments Example)
CREATE OR REPLACE FUNCTION audit_appointment_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.audit_logs (user_id, action, entity, new_value)
        VALUES (auth.uid(), 'CREATE', 'appointments', row_to_json(NEW));
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public.audit_logs (user_id, action, entity, old_value, new_value)
        VALUES (auth.uid(), 'UPDATE', 'appointments', row_to_json(OLD), row_to_json(NEW));
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO public.audit_logs (user_id, action, entity, old_value)
        VALUES (auth.uid(), 'DELETE', 'appointments', row_to_json(OLD));
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER appointments_audit
AFTER INSERT OR UPDATE OR DELETE ON public.appointments
FOR EACH ROW EXECUTE FUNCTION audit_appointment_changes();

-- Function for reservation cleanup
CREATE OR REPLACE FUNCTION cleanup_expired_reservations()
RETURNS void AS $$
BEGIN
    UPDATE public.appointments
    SET status = 'cancelled'
    WHERE status = 'pending' 
      AND payment_status = 'pending' 
      AND reserved_until < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile and set role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into patient_profiles
  INSERT INTO public.patient_profiles (id, full_name, email)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', 'Patient'), new.email);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to assign PATIENT role on signup (Before Insert)
CREATE OR REPLACE FUNCTION public.set_default_role()
RETURNS TRIGGER AS $$
BEGIN
  new.raw_app_meta_data = coalesce(new.raw_app_meta_data, '{}'::jsonb) || '{"role":"PATIENT"}'::jsonb;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER set_default_role_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.set_default_role();
