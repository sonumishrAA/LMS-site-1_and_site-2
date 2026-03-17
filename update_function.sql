CREATE OR REPLACE FUNCTION complete_library_registration(p_order_id TEXT, p_owner_uid UUID, p_library_data JSONB, p_seat_config JSONB, p_locker_config JSONB, p_shifts JSONB, p_combo_plans JSONB, p_locker_policy JSONB, p_owner_data JSONB, p_staff_list JSONB, p_plan TEXT, p_amount DECIMAL, p_razorpay_pid TEXT, p_razorpay_sig TEXT) RETURNS JSONB AS $$
DECLARE
  v_library_id  UUID;
  v_dur_min     INTEGER;
  v_sub_end     TIMESTAMPTZ;
  v_del_date    TIMESTAMPTZ;
  v_staff       JSONB;
  v_shift       JSONB;
  v_combo       JSONB;
  v_is_neutral  BOOLEAN;
  v_male_seats  INTEGER;
  v_female_seats INTEGER;
  v_neutral_seats INTEGER;
  v_has_lockers BOOLEAN;
  v_male_lockers INTEGER;
  v_female_lockers INTEGER;
  v_neutral_lockers INTEGER;
  i             INTEGER;
BEGIN
  SELECT duration_minutes INTO v_dur_min FROM pricing_config WHERE plan = p_plan;
  v_dur_min := COALESCE(v_dur_min, 43200);

  v_sub_end  := NOW() + (v_dur_min || ' minutes')::INTERVAL;
  v_del_date := v_sub_end + INTERVAL '15 days';

  v_is_neutral     := (p_seat_config->>'is_gender_neutral')::BOOLEAN;
  v_male_seats     := COALESCE((p_seat_config->>'male_seats')::INTEGER, 0);
  v_female_seats   := COALESCE((p_seat_config->>'female_seats')::INTEGER, 0);
  v_neutral_seats  := COALESCE((p_seat_config->>'neutral_seats')::INTEGER, 0);
  v_has_lockers    := COALESCE((p_locker_config->>'has_lockers')::BOOLEAN, false);
  v_male_lockers   := COALESCE((p_locker_config->>'male_lockers')::INTEGER, 0);
  v_female_lockers := COALESCE((p_locker_config->>'female_lockers')::INTEGER, 0);
  v_neutral_lockers:= COALESCE((p_locker_config->>'neutral_lockers')::INTEGER, 0);

  INSERT INTO libraries (
    owner_id, name, address, city, state, pincode, phone,
    is_gender_neutral, male_seats, female_seats, neutral_seats,
    has_lockers, male_lockers, female_lockers, neutral_lockers,
    subscription_plan, subscription_status, subscription_start, subscription_end, delete_date,
    original_plan_price, onboarding_done
  ) VALUES (
    p_owner_uid, p_library_data->>'name', p_library_data->>'address', p_library_data->>'city',
    p_library_data->>'state', p_library_data->>'pincode', p_library_data->>'phone',
    v_is_neutral, v_male_seats, v_female_seats, v_neutral_seats,
    v_has_lockers, v_male_lockers, v_female_lockers, v_neutral_lockers,
    p_plan, 'active', NOW(), v_sub_end, v_del_date, p_amount, false
  ) RETURNING id INTO v_library_id;

  FOR v_shift IN SELECT * FROM jsonb_array_elements(p_shifts) LOOP
    INSERT INTO shifts (library_id, code, name, start_time, end_time)
    VALUES (v_library_id, v_shift->>'code', v_shift->>'name', (v_shift->>'start_time')::TIME, (v_shift->>'end_time')::TIME);
  END LOOP;

  IF v_is_neutral THEN
    FOR i IN 1..v_neutral_seats LOOP
      INSERT INTO seats (library_id, seat_number, gender) VALUES (v_library_id, i::TEXT, 'neutral');
    END LOOP;
  ELSE
    FOR i IN 1..v_male_seats LOOP
      INSERT INTO seats (library_id, seat_number, gender) VALUES (v_library_id, 'M' || i, 'male');
    END LOOP;
    FOR i IN 1..v_female_seats LOOP
      INSERT INTO seats (library_id, seat_number, gender) VALUES (v_library_id, 'F' || i, 'female');
    END LOOP;
  END IF;

  IF v_has_lockers THEN
    IF v_is_neutral THEN
      FOR i IN 1..v_neutral_lockers LOOP
        INSERT INTO lockers (library_id, locker_number, gender) VALUES (v_library_id, 'L' || i, 'neutral');
      END LOOP;
    ELSE
      FOR i IN 1..v_male_lockers LOOP
        INSERT INTO lockers (library_id, locker_number, gender) VALUES (v_library_id, 'ML' || i, 'male');
      END LOOP;
      FOR i IN 1..v_female_lockers LOOP
        INSERT INTO lockers (library_id, locker_number, gender) VALUES (v_library_id, 'FL' || i, 'female');
      END LOOP;
    END IF;
  END IF;

  FOR v_combo IN SELECT * FROM jsonb_array_elements(p_combo_plans) LOOP
    INSERT INTO combo_plans (library_id, combination_key, months, fee)
    VALUES (v_library_id, v_combo->>'combination_key', (v_combo->>'months')::INTEGER, (v_combo->>'fee')::DECIMAL);
  END LOOP;

  IF v_has_lockers THEN
    INSERT INTO locker_policies (library_id, eligible_combos, monthly_fee)
    VALUES (v_library_id, ARRAY(SELECT jsonb_array_elements_text(p_locker_policy->'eligible_combos')), (p_locker_policy->>'monthly_fee')::DECIMAL);
  END IF;

  INSERT INTO staff (library_ids, user_id, name, email, role, staff_type, is_active)
  VALUES (ARRAY[v_library_id], p_owner_uid, p_owner_data->>'name', p_owner_data->>'email', 'owner', 'specific', true)
  ON CONFLICT (user_id) DO UPDATE SET library_ids = staff.library_ids || ARRAY[v_library_id];

  FOR v_staff IN SELECT * FROM jsonb_array_elements(p_staff_list) LOOP
    INSERT INTO staff (library_ids, user_id, name, email, role, staff_type, is_active, force_password_change)
    VALUES (ARRAY[v_library_id], (v_staff->>'user_id')::UUID, v_staff->>'name', v_staff->>'email', 'staff', COALESCE(v_staff->>'staff_type', 'specific'), true, false);
  END LOOP;

  UPDATE subscription_payments SET status = 'success', processed = true, razorpay_payment_id = p_razorpay_pid, razorpay_signature = p_razorpay_sig, library_id = v_library_id WHERE razorpay_order_id = p_order_id;
  DELETE FROM temp_registrations WHERE razorpay_order_id = p_order_id;

  RETURN jsonb_build_object('success', true, 'library_id', v_library_id, 'sub_end', v_sub_end, 'delete_date', v_del_date);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
