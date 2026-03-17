# Supabase Full Schema & RLS Policies (Latest)

## 1. Tables & Indexes

```sql
-- ─────────────────────────────────────────
-- 1. libraries
-- ─────────────────────────────────────────
CREATE TABLE public.libraries (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  owner_id uuid NULL,
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  pincode character(6) NOT NULL,
  phone text NOT NULL,
  is_gender_neutral boolean NULL DEFAULT false,
  male_seats integer NULL DEFAULT 0,
  female_seats integer NULL DEFAULT 0,
  neutral_seats integer NULL DEFAULT 0,
  has_lockers boolean NULL DEFAULT false,
  male_lockers integer NULL DEFAULT 0,
  female_lockers integer NULL DEFAULT 0,
  neutral_lockers integer NULL DEFAULT 0,
  subscription_plan text NULL,
  subscription_status text NULL DEFAULT 'inactive'::text,
  subscription_start date NULL,
  subscription_end date NULL,
  delete_date date NULL,
  data_cleared boolean NULL DEFAULT false,
  original_plan_price numeric(10, 2) NULL,
  onboarding_done boolean NULL DEFAULT false,
  notif_sent_7d boolean NULL DEFAULT false,
  notif_sent_3d boolean NULL DEFAULT false,
  notif_sent_1d boolean NULL DEFAULT false,
  cleanup_warn_sent boolean NULL DEFAULT false,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT libraries_pkey PRIMARY KEY (id),
  CONSTRAINT libraries_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES auth.users (id),
  CONSTRAINT libraries_phone_check CHECK ((phone ~ '^[6-9]\d{9}$'::text)),
  CONSTRAINT libraries_subscription_plan_check CHECK (
    (subscription_plan = ANY (ARRAY['1m'::text, '3m'::text, '6m'::text, '12m'::text]))
  ),
  CONSTRAINT libraries_subscription_status_check CHECK (
    (subscription_status = ANY (ARRAY['active'::text, 'inactive'::text, 'expired'::text, 'deleted'::text]))
  )
);
CREATE INDEX IF NOT EXISTS idx_libs_delete_date ON public.libraries USING btree (delete_date, subscription_status);

-- ─────────────────────────────────────────
-- 2. combo_plans
-- ─────────────────────────────────────────
CREATE TABLE public.combo_plans (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  library_id uuid NULL,
  combination_key text NOT NULL,
  months integer NOT NULL,
  fee numeric(10, 2) NOT NULL,
  CONSTRAINT combo_plans_pkey PRIMARY KEY (id),
  CONSTRAINT combo_plans_library_id_combination_key_months_key UNIQUE (library_id, combination_key, months),
  CONSTRAINT combo_plans_library_id_fkey FOREIGN KEY (library_id) REFERENCES libraries (id) ON DELETE CASCADE,
  CONSTRAINT combo_plans_months_check CHECK (((months >= 1) AND (months <= 12)))
);
CREATE INDEX IF NOT EXISTS idx_combo_lookup ON public.combo_plans USING btree (library_id, combination_key, months);

-- ─────────────────────────────────────────
-- 3. contact_messages
-- ─────────────────────────────────────────
CREATE TABLE public.contact_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  name text NOT NULL,
  phone text NOT NULL,
  message text NOT NULL,
  is_read boolean NULL DEFAULT false,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT contact_messages_pkey PRIMARY KEY (id),
  CONSTRAINT contact_messages_phone_check CHECK ((phone ~ '^[6-9]\d{9}$'::text))
);

-- ─────────────────────────────────────────
-- 4. financial_events
-- ─────────────────────────────────────────
CREATE TABLE public.financial_events (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  library_id uuid NOT NULL,
  student_id uuid NULL,
  student_name text NOT NULL,
  event_type text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  pending_amount numeric NOT NULL DEFAULT 0,
  payment_mode text NULL DEFAULT 'cash'::text,
  actor_role text NOT NULL,
  actor_name text NOT NULL,
  note text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT financial_events_pkey PRIMARY KEY (id),
  CONSTRAINT financial_events_library_id_fkey FOREIGN KEY (library_id) REFERENCES libraries (id) ON DELETE CASCADE,
  CONSTRAINT financial_events_actor_role_check CHECK ((actor_role = ANY (ARRAY['owner'::text, 'staff'::text]))),
  CONSTRAINT financial_events_event_type_check CHECK (
    (event_type = ANY (ARRAY[
      'ADMISSION_FULL'::text, 'ADMISSION_PARTIAL'::text, 'ADMISSION_PENDING'::text,
      'PAYMENT_RECEIVED'::text, 'DISCOUNT_APPLIED'::text, 'RENEWAL'::text,
      'REFUND_ON_DELETE'::text, 'NO_REFUND_ON_DELETE'::text
    ]))
  )
);
CREATE INDEX IF NOT EXISTS idx_fe_library ON public.financial_events USING btree (library_id);
CREATE INDEX IF NOT EXISTS idx_fe_created ON public.financial_events USING btree (created_at);
CREATE INDEX IF NOT EXISTS idx_fe_type ON public.financial_events USING btree (event_type);

-- ─────────────────────────────────────────
-- 5. locker_policies
-- ─────────────────────────────────────────
CREATE TABLE public.locker_policies (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  library_id uuid NULL,
  eligible_combos text[] NOT NULL DEFAULT '{}'::text[],
  monthly_fee numeric(10, 2) NOT NULL,
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT locker_policies_pkey PRIMARY KEY (id),
  CONSTRAINT locker_policies_library_id_key UNIQUE (library_id),
  CONSTRAINT locker_policies_library_id_fkey FOREIGN KEY (library_id) REFERENCES libraries (id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────
-- 6. lockers
-- ─────────────────────────────────────────
CREATE TABLE public.lockers (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  library_id uuid NULL,
  locker_number text NOT NULL,
  gender text NOT NULL,
  status text NULL DEFAULT 'free'::text,
  CONSTRAINT lockers_pkey PRIMARY KEY (id),
  CONSTRAINT lockers_library_id_locker_number_key UNIQUE (library_id, locker_number),
  CONSTRAINT lockers_library_id_fkey FOREIGN KEY (library_id) REFERENCES libraries (id) ON DELETE CASCADE,
  CONSTRAINT lockers_gender_check CHECK ((gender = ANY (ARRAY['male'::text, 'female'::text, 'neutral'::text]))),
  CONSTRAINT lockers_status_check CHECK ((status = ANY (ARRAY['free'::text, 'occupied'::text, 'key_pending'::text])))
);

-- ─────────────────────────────────────────
-- 7. seats
-- ─────────────────────────────────────────
CREATE TABLE public.seats (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  library_id uuid NULL,
  seat_number text NOT NULL,
  gender text NOT NULL,
  is_active boolean NULL DEFAULT true,
  CONSTRAINT seats_pkey PRIMARY KEY (id),
  CONSTRAINT seats_library_id_seat_number_key UNIQUE (library_id, seat_number),
  CONSTRAINT seats_library_id_fkey FOREIGN KEY (library_id) REFERENCES libraries (id) ON DELETE CASCADE,
  CONSTRAINT seats_gender_check CHECK ((gender = ANY (ARRAY['male'::text, 'female'::text, 'neutral'::text])))
);

-- ─────────────────────────────────────────
-- 8. shifts
-- ─────────────────────────────────────────
CREATE TABLE public.shifts (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  library_id uuid NULL,
  code text NOT NULL,
  name text NOT NULL,
  start_time time without time zone NOT NULL,
  end_time time without time zone NOT NULL,
  CONSTRAINT shifts_pkey PRIMARY KEY (id),
  CONSTRAINT shifts_library_id_code_key UNIQUE (library_id, code),
  CONSTRAINT shifts_library_id_fkey FOREIGN KEY (library_id) REFERENCES libraries (id) ON DELETE CASCADE,
  CONSTRAINT shifts_code_check CHECK ((code = ANY (ARRAY['M'::text, 'A'::text, 'E'::text, 'N'::text])))
);

-- ─────────────────────────────────────────
-- 9. staff
-- ─────────────────────────────────────────
CREATE TABLE public.staff (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  library_ids uuid[] NOT NULL,
  user_id uuid NULL,
  name text NOT NULL,
  email text NOT NULL,
  role text NULL DEFAULT 'staff'::text,
  staff_type text NULL DEFAULT 'specific'::text,
  is_active boolean NULL DEFAULT true,
  force_password_change boolean NULL DEFAULT false,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT staff_pkey PRIMARY KEY (id),
  CONSTRAINT staff_email_key UNIQUE (email),
  CONSTRAINT staff_user_id_key UNIQUE (user_id),
  CONSTRAINT staff_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE,
  CONSTRAINT staff_role_check CHECK ((role = ANY (ARRAY['owner'::text, 'staff'::text]))),
  CONSTRAINT staff_staff_type_check CHECK ((staff_type = ANY (ARRAY['specific'::text, 'combined'::text])))
);
CREATE INDEX IF NOT EXISTS idx_staff_user ON public.staff USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_staff_libs ON public.staff USING gin (library_ids);

-- ─────────────────────────────────────────
-- 10. students
-- ─────────────────────────────────────────
CREATE TABLE public.students (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  library_id uuid NULL,
  name text NOT NULL,
  father_name text NULL,
  address text NULL,
  phone text NULL,
  gender text NOT NULL,
  seat_id uuid NULL,
  combination_key text NOT NULL,
  shift_display text NOT NULL,
  selected_shifts text[] NOT NULL,
  locker_id uuid NULL,
  admission_date date NOT NULL DEFAULT CURRENT_DATE,
  plan_months integer NOT NULL,
  end_date date NOT NULL,
  payment_status text NULL DEFAULT 'pending'::text,
  monthly_rate numeric(10, 2) NOT NULL,
  total_fee numeric(10, 2) NOT NULL,
  is_deleted boolean NULL DEFAULT false,
  deleted_at timestamp with time zone NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  amount_paid numeric NULL DEFAULT 0,
  discount_amount numeric NULL DEFAULT 0,
  CONSTRAINT students_pkey PRIMARY KEY (id),
  CONSTRAINT students_library_id_fkey FOREIGN KEY (library_id) REFERENCES libraries (id) ON DELETE CASCADE,
  CONSTRAINT students_seat_id_fkey FOREIGN KEY (seat_id) REFERENCES seats (id) ON DELETE SET NULL,
  CONSTRAINT students_locker_id_fkey FOREIGN KEY (locker_id) REFERENCES lockers (id) ON DELETE SET NULL,
  CONSTRAINT students_phone_check CHECK (((phone IS NULL) OR (phone ~ '^[6-9]\d{9}$'::text))),
  CONSTRAINT students_payment_status_check CHECK (
    (payment_status = ANY (ARRAY['paid'::text, 'pending'::text, 'partial'::text, 'discounted'::text]))
  ),
  CONSTRAINT students_gender_check CHECK ((gender = ANY (ARRAY['male'::text, 'female'::text]))),
  CONSTRAINT students_plan_months_check CHECK (((plan_months >= 1) AND (plan_months <= 12)))
);
CREATE INDEX IF NOT EXISTS idx_students_library ON public.students USING btree (library_id);
CREATE INDEX IF NOT EXISTS idx_students_end_date ON public.students USING btree (end_date);
CREATE INDEX IF NOT EXISTS idx_students_deleted ON public.students USING btree (is_deleted);
CREATE INDEX IF NOT EXISTS idx_students_seat ON public.students USING btree (seat_id);

-- ─────────────────────────────────────────
-- 11. student_seat_shifts
-- ─────────────────────────────────────────
CREATE TABLE public.student_seat_shifts (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  student_id uuid NULL,
  seat_id uuid NULL,
  shift_code text NOT NULL,
  end_date date NOT NULL,
  CONSTRAINT student_seat_shifts_pkey PRIMARY KEY (id),
  CONSTRAINT student_seat_shifts_seat_id_fkey FOREIGN KEY (seat_id) REFERENCES seats (id) ON DELETE CASCADE,
  CONSTRAINT student_seat_shifts_student_id_fkey FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE,
  CONSTRAINT student_seat_shifts_shift_code_check CHECK ((shift_code = ANY (ARRAY['M'::text, 'A'::text, 'E'::text, 'N'::text])))
);
CREATE INDEX IF NOT EXISTS idx_sss_active_lookup ON public.student_seat_shifts USING btree (seat_id, shift_code, end_date);
CREATE INDEX IF NOT EXISTS idx_sss_seat_shift ON public.student_seat_shifts USING btree (seat_id, shift_code);

-- ─────────────────────────────────────────
-- 12. notifications
-- ─────────────────────────────────────────
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  library_id uuid NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  student_id uuid NULL,
  is_read boolean NULL DEFAULT false,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_library_id_fkey FOREIGN KEY (library_id) REFERENCES libraries (id) ON DELETE CASCADE,
  CONSTRAINT notifications_student_id_fkey FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE,
  CONSTRAINT notifications_type_check CHECK (
    (type = ANY (ARRAY[
      'expiry_warning'::text, 'subscription_expiry'::text, 'new_admission'::text,
      'fee_collected'::text, 'renewal_done'::text, 'student_renewed'::text,
      'seat_changed'::text, 'data_cleanup_warning'::text
    ]))
  )
);
CREATE INDEX IF NOT EXISTS idx_notif_lib ON public.notifications USING btree (library_id, is_read);

-- ─────────────────────────────────────────
-- 13. payment_records
-- ─────────────────────────────────────────
CREATE TABLE public.payment_records (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  library_id uuid NULL,
  student_id uuid NULL,
  amount numeric(10, 2) NOT NULL,
  payment_method text NULL DEFAULT 'cash'::text,
  payment_date date NOT NULL DEFAULT CURRENT_DATE,
  received_by uuid NULL,
  notes text NULL,
  type text NOT NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT payment_records_pkey PRIMARY KEY (id),
  CONSTRAINT payment_records_library_id_fkey FOREIGN KEY (library_id) REFERENCES libraries (id) ON DELETE CASCADE,
  CONSTRAINT payment_records_student_id_fkey FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE,
  CONSTRAINT payment_records_payment_method_check CHECK (
    (payment_method = ANY (ARRAY['cash'::text, 'upi'::text, 'online'::text, 'other'::text]))
  ),
  CONSTRAINT payment_records_type_check CHECK (
    (type = ANY (ARRAY['admission'::text, 'renewal'::text, 'locker_deposit'::text]))
  )
);
CREATE INDEX IF NOT EXISTS idx_pay_records_lib ON public.payment_records USING btree (library_id, created_at);
CREATE INDEX IF NOT EXISTS idx_pay_records_student ON public.payment_records USING btree (student_id);

-- ─────────────────────────────────────────
-- 14. subscription_payments
-- ─────────────────────────────────────────
CREATE TABLE public.subscription_payments (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  library_id uuid NULL,
  razorpay_order_id text NOT NULL,
  razorpay_payment_id text NULL,
  razorpay_signature text NULL,
  amount numeric(10, 2) NOT NULL,
  plan text NOT NULL,
  status text NULL DEFAULT 'pending'::text,
  processed boolean NULL DEFAULT false,
  type text NOT NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT subscription_payments_pkey PRIMARY KEY (id),
  CONSTRAINT subscription_payments_razorpay_order_id_key UNIQUE (razorpay_order_id),
  CONSTRAINT subscription_payments_library_id_fkey FOREIGN KEY (library_id) REFERENCES libraries (id) ON DELETE CASCADE,
  CONSTRAINT subscription_payments_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'success'::text, 'failed'::text]))),
  CONSTRAINT subscription_payments_type_check CHECK ((type = ANY (ARRAY['registration'::text, 'renewal'::text])))
);
CREATE INDEX IF NOT EXISTS idx_sub_pay_order ON public.subscription_payments USING btree (razorpay_order_id);

-- ─────────────────────────────────────────
-- 15. pricing_config
-- ─────────────────────────────────────────
CREATE TABLE public.pricing_config (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  plan text NOT NULL,
  amount numeric(10, 2) NOT NULL,
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT pricing_config_pkey PRIMARY KEY (id),
  CONSTRAINT pricing_config_plan_key UNIQUE (plan),
  CONSTRAINT pricing_config_plan_check CHECK ((plan = ANY (ARRAY['1m'::text, '3m'::text, '6m'::text, '12m'::text])))
);

-- ─────────────────────────────────────────
-- 16. temp_registrations
-- ─────────────────────────────────────────
CREATE TABLE public.temp_registrations (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  razorpay_order_id text NOT NULL,
  form_data jsonb NOT NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  expires_at timestamp with time zone NULL DEFAULT (now() + '02:00:00'::interval),
  CONSTRAINT temp_registrations_pkey PRIMARY KEY (id),
  CONSTRAINT temp_registrations_razorpay_order_id_key UNIQUE (razorpay_order_id)
);
CREATE INDEX IF NOT EXISTS idx_temp_reg_order ON public.temp_registrations USING btree (razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_temp_reg_expires ON public.temp_registrations USING btree (expires_at);
```

## 2. Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE libraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE combo_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE locker_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE lockers ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_events ENABLE ROW LEVEL SECURITY;

-- 1. libraries
CREATE POLICY libraries_select ON libraries FOR SELECT TO authenticated USING (id = ANY (get_user_library_ids()));
CREATE POLICY libraries_insert ON libraries FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());
CREATE POLICY libraries_update ON libraries FOR UPDATE TO authenticated USING (owner_id = auth.uid());
CREATE POLICY libraries_delete ON libraries FOR DELETE TO authenticated USING (owner_id = auth.uid());

-- 2. shifts
CREATE POLICY shifts_select ON shifts FOR SELECT TO authenticated USING (library_id = ANY (get_user_library_ids()));
CREATE POLICY shifts_modify ON shifts FOR ALL TO authenticated USING (is_library_owner(library_id));

-- 3. combo_plans
CREATE POLICY combo_plans_select ON combo_plans FOR SELECT TO authenticated USING (library_id = ANY (get_user_library_ids()));
CREATE POLICY combo_plans_modify ON combo_plans FOR ALL TO authenticated USING (is_library_owner(library_id));

-- 4. locker_policies
CREATE POLICY locker_policies_select ON locker_policies FOR SELECT TO authenticated USING (library_id = ANY (get_user_library_ids()));
CREATE POLICY locker_policies_modify ON locker_policies FOR ALL TO authenticated USING (is_library_owner(library_id));

-- 5. seats
CREATE POLICY seats_select ON seats FOR SELECT TO authenticated USING (library_id = ANY (get_user_library_ids()));
CREATE POLICY seats_modify ON seats FOR ALL TO authenticated USING (is_library_owner(library_id));

-- 6. lockers
CREATE POLICY lockers_select ON lockers FOR SELECT TO authenticated USING (library_id = ANY (get_user_library_ids()));
CREATE POLICY lockers_modify ON lockers FOR ALL TO authenticated USING (is_library_owner(library_id));

-- 7. staff
CREATE POLICY staff_select ON staff FOR SELECT TO authenticated USING (library_ids && get_user_library_ids());

-- 8. students
CREATE POLICY students_select ON students FOR SELECT TO authenticated USING (library_id = ANY (get_user_library_ids()));
CREATE POLICY students_insert ON students FOR INSERT TO authenticated WITH CHECK (library_id = ANY (get_user_library_ids()));
CREATE POLICY students_update ON students FOR UPDATE TO authenticated USING (library_id = ANY (get_user_library_ids()));
CREATE POLICY students_delete ON students FOR DELETE TO authenticated USING (is_library_owner(library_id));

-- 9. payment_records
CREATE POLICY payment_records_select ON payment_records FOR SELECT TO authenticated USING (library_id = ANY (get_user_library_ids()));
CREATE POLICY payment_records_insert ON payment_records FOR INSERT TO authenticated WITH CHECK (library_id = ANY (get_user_library_ids()));

-- 10. notifications
CREATE POLICY notifications_select ON notifications FOR SELECT TO authenticated USING (library_id = ANY (get_user_library_ids()));
CREATE POLICY notifications_update ON notifications FOR UPDATE TO authenticated USING (library_id = ANY (get_user_library_ids()));

-- 11. contact_messages
CREATE POLICY contact_messages_insert ON contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);

-- 12. pricing_config
CREATE POLICY pricing_config_select ON pricing_config FOR SELECT TO authenticated USING (true);

-- 13. financial_events
CREATE POLICY "Allow select" ON financial_events FOR SELECT TO public USING (true);
CREATE POLICY "Allow insert" ON financial_events FOR INSERT TO public WITH CHECK (true);
```
