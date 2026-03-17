[
{
"type": "POLICY",
"name": "combo_plans",
"detail1": "combo_plans_select",
"detail2": "SELECT",
"detail3": "(library_id = ANY (get_user_library_ids()))",
"detail4": null
},
{
"type": "POLICY",
"name": "combo_plans",
"detail1": "combo_plans_modify",
"detail2": "ALL",
"detail3": "is_library_owner(library_id)",
"detail4": null
},
{
"type": "POLICY",
"name": "contact_messages",
"detail1": "contact_messages_insert",
"detail2": "INSERT",
"detail3": null,
"detail4": "true"
},
{
"type": "POLICY",
"name": "financial_events",
"detail1": "Allow insert",
"detail2": "INSERT",
"detail3": null,
"detail4": "true"
},
{
"type": "POLICY",
"name": "financial_events",
"detail1": "Allow select",
"detail2": "SELECT",
"detail3": "true",
"detail4": null
},
{
"type": "POLICY",
"name": "libraries",
"detail1": "libraries_insert",
"detail2": "INSERT",
"detail3": null,
"detail4": "(owner_id = auth.uid())"
},
{
"type": "POLICY",
"name": "libraries",
"detail1": "libraries_delete",
"detail2": "DELETE",
"detail3": "(owner_id = auth.uid())",
"detail4": null
},
{
"type": "POLICY",
"name": "libraries",
"detail1": "libraries_update",
"detail2": "UPDATE",
"detail3": "(owner_id = auth.uid())",
"detail4": null
},
{
"type": "POLICY",
"name": "libraries",
"detail1": "libraries_select",
"detail2": "SELECT",
"detail3": "(id = ANY (get_user_library_ids()))",
"detail4": null
},
{
"type": "POLICY",
"name": "locker_policies",
"detail1": "locker_policies_select",
"detail2": "SELECT",
"detail3": "(library_id = ANY (get_user_library_ids()))",
"detail4": null
},
{
"type": "POLICY",
"name": "locker_policies",
"detail1": "locker_policies_modify",
"detail2": "ALL",
"detail3": "is_library_owner(library_id)",
"detail4": null
},
{
"type": "POLICY",
"name": "lockers",
"detail1": "lockers_modify",
"detail2": "ALL",
"detail3": "is_library_owner(library_id)",
"detail4": null
},
{
"type": "POLICY",
"name": "lockers",
"detail1": "lockers_select",
"detail2": "SELECT",
"detail3": "(library_id = ANY (get_user_library_ids()))",
"detail4": null
},
{
"type": "POLICY",
"name": "notifications",
"detail1": "notifications_update",
"detail2": "UPDATE",
"detail3": "(library_id = ANY (get_user_library_ids()))",
"detail4": null
},
{
"type": "POLICY",
"name": "notifications",
"detail1": "notifications_select",
"detail2": "SELECT",
"detail3": "(library_id = ANY (get_user_library_ids()))",
"detail4": null
},
{
"type": "POLICY",
"name": "payment_records",
"detail1": "payment_records_insert",
"detail2": "INSERT",
"detail3": null,
"detail4": "(library_id = ANY (get_user_library_ids()))"
},
{
"type": "POLICY",
"name": "payment_records",
"detail1": "payment_records_select",
"detail2": "SELECT",
"detail3": "(library_id = ANY (get_user_library_ids()))",
"detail4": null
},
{
"type": "POLICY",
"name": "pricing_config",
"detail1": "pricing_config_select",
"detail2": "SELECT",
"detail3": "true",
"detail4": null
},
{
"type": "POLICY",
"name": "seats",
"detail1": "seats_select",
"detail2": "SELECT",
"detail3": "(library_id = ANY (get_user_library_ids()))",
"detail4": null
},
{
"type": "POLICY",
"name": "seats",
"detail1": "seats_modify",
"detail2": "ALL",
"detail3": "is_library_owner(library_id)",
"detail4": null
},
{
"type": "POLICY",
"name": "shifts",
"detail1": "shifts_modify",
"detail2": "ALL",
"detail3": "is_library_owner(library_id)",
"detail4": null
},
{
"type": "POLICY",
"name": "shifts",
"detail1": "shifts_select",
"detail2": "SELECT",
"detail3": "(library_id = ANY (get_user_library_ids()))",
"detail4": null
},
{
"type": "POLICY",
"name": "staff",
"detail1": "staff_select",
"detail2": "SELECT",
"detail3": "(library_ids && get_user_library_ids())",
"detail4": null
},
{
"type": "POLICY",
"name": "students",
"detail1": "students_insert",
"detail2": "INSERT",
"detail3": null,
"detail4": "(library_id = ANY (get_user_library_ids()))"
},
{
"type": "POLICY",
"name": "students",
"detail1": "students_select",
"detail2": "SELECT",
"detail3": "(library_id = ANY (get_user_library_ids()))",
"detail4": null
},
{
"type": "POLICY",
"name": "students",
"detail1": "students_update",
"detail2": "UPDATE",
"detail3": "(library_id = ANY (get_user_library_ids()))",
"detail4": null
},
{
"type": "POLICY",
"name": "students",
"detail1": "students_delete",
"detail2": "DELETE",
"detail3": "is_library_owner(library_id)",
"detail4": null
},
{
"type": "TABLE",
"name": "combo_plans",
"detail1": "combination_key",
"detail2": "text",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "combo_plans",
"detail1": "library_id",
"detail2": "uuid",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "combo_plans",
"detail1": "id",
"detail2": "uuid",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "combo_plans",
"detail1": "fee",
"detail2": "numeric",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "combo_plans",
"detail1": "months",
"detail2": "integer",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "contact_messages",
"detail1": "phone",
"detail2": "text",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "contact_messages",
"detail1": "name",
"detail2": "text",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "contact_messages",
"detail1": "id",
"detail2": "uuid",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "contact_messages",
"detail1": "created_at",
"detail2": "timestamp with time zone",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "contact_messages",
"detail1": "is_read",
"detail2": "boolean",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "contact_messages",
"detail1": "message",
"detail2": "text",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "financial_events",
"detail1": "note",
"detail2": "text",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "financial_events",
"detail1": "created_at",
"detail2": "timestamp with time zone",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "financial_events",
"detail1": "payment_mode",
"detail2": "text",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "financial_events",
"detail1": "event_type",
"detail2": "text",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "financial_events",
"detail1": "student_name",
"detail2": "text",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "financial_events",
"detail1": "student_id",
"detail2": "uuid",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "financial_events",
"detail1": "library_id",
"detail2": "uuid",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "financial_events",
"detail1": "id",
"detail2": "uuid",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "financial_events",
"detail1": "actor_role",
"detail2": "text",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "financial_events",
"detail1": "amount",
"detail2": "numeric",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "financial_events",
"detail1": "actor_name",
"detail2": "text",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "financial_events",
"detail1": "pending_amount",
"detail2": "numeric",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "libraries",
"detail1": "original_plan_price",
"detail2": "numeric",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "libraries",
"detail1": "owner_id",
"detail2": "uuid",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "libraries",
"detail1": "name",
"detail2": "text",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "libraries",
"detail1": "address",
"detail2": "text",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "libraries",
"detail1": "city",
"detail2": "text",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "libraries",
"detail1": "state",
"detail2": "text",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "libraries",
"detail1": "pincode",
"detail2": "character",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "libraries",
"detail1": "phone",
"detail2": "text",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "libraries",
"detail1": "is_gender_neutral",
"detail2": "boolean",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "libraries",
"detail1": "male_seats",
"detail2": "integer",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "libraries",
"detail1": "female_seats",
"detail2": "integer",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "libraries",
"detail1": "neutral_seats",
"detail2": "integer",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "libraries",
"detail1": "has_lockers",
"detail2": "boolean",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "libraries",
"detail1": "male_lockers",
"detail2": "integer",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "libraries",
"detail1": "female_lockers",
"detail2": "integer",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "libraries",
"detail1": "neutral_lockers",
"detail2": "integer",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "libraries",
"detail1": "subscription_plan",
"detail2": "text",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "libraries",
"detail1": "subscription_status",
"detail2": "text",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "libraries",
"detail1": "subscription_start",
"detail2": "date",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "libraries",
"detail1": "subscription_end",
"detail2": "date",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "libraries",
"detail1": "delete_date",
"detail2": "date",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "libraries",
"detail1": "data_cleared",
"detail2": "boolean",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "libraries",
"detail1": "id",
"detail2": "uuid",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "libraries",
"detail1": "onboarding_done",
"detail2": "boolean",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "libraries",
"detail1": "notif_sent_7d",
"detail2": "boolean",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "libraries",
"detail1": "notif_sent_3d",
"detail2": "boolean",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "libraries",
"detail1": "notif_sent_1d",
"detail2": "boolean",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "libraries",
"detail1": "cleanup_warn_sent",
"detail2": "boolean",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "libraries",
"detail1": "created_at",
"detail2": "timestamp with time zone",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "libraries",
"detail1": "updated_at",
"detail2": "timestamp with time zone",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "locker_policies",
"detail1": "id",
"detail2": "uuid",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "locker_policies",
"detail1": "updated_at",
"detail2": "timestamp with time zone",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "locker_policies",
"detail1": "monthly_fee",
"detail2": "numeric",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "locker_policies",
"detail1": "eligible_combos",
"detail2": "ARRAY",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "locker_policies",
"detail1": "library_id",
"detail2": "uuid",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "lockers",
"detail1": "id",
"detail2": "uuid",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "lockers",
"detail1": "status",
"detail2": "text",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "lockers",
"detail1": "gender",
"detail2": "text",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "lockers",
"detail1": "locker_number",
"detail2": "text",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "lockers",
"detail1": "library_id",
"detail2": "uuid",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "notifications",
"detail1": "type",
"detail2": "text",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "notifications",
"detail1": "created_at",
"detail2": "timestamp with time zone",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "notifications",
"detail1": "is_read",
"detail2": "boolean",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "notifications",
"detail1": "student_id",
"detail2": "uuid",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "notifications",
"detail1": "message",
"detail2": "text",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "notifications",
"detail1": "id",
"detail2": "uuid",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "notifications",
"detail1": "library_id",
"detail2": "uuid",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "notifications",
"detail1": "title",
"detail2": "text",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "payment_records",
"detail1": "id",
"detail2": "uuid",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "payment_records",
"detail1": "library_id",
"detail2": "uuid",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "payment_records",
"detail1": "student_id",
"detail2": "uuid",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "payment_records",
"detail1": "amount",
"detail2": "numeric",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "payment_records",
"detail1": "created_at",
"detail2": "timestamp with time zone",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "payment_records",
"detail1": "type",
"detail2": "text",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "payment_records",
"detail1": "notes",
"detail2": "text",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "payment_records",
"detail1": "received_by",
"detail2": "uuid",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "payment_records",
"detail1": "payment_date",
"detail2": "date",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "payment_records",
"detail1": "payment_method",
"detail2": "text",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "pricing_config",
"detail1": "updated_at",
"detail2": "timestamp with time zone",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "pricing_config",
"detail1": "amount",
"detail2": "numeric",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "pricing_config",
"detail1": "plan",
"detail2": "text",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "pricing_config",
"detail1": "id",
"detail2": "uuid",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "seats",
"detail1": "id",
"detail2": "uuid",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "seats",
"detail1": "seat_number",
"detail2": "text",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "seats",
"detail1": "gender",
"detail2": "text",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "seats",
"detail1": "is_active",
"detail2": "boolean",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "seats",
"detail1": "library_id",
"detail2": "uuid",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "shifts",
"detail1": "start_time",
"detail2": "time without time zone",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "shifts",
"detail1": "name",
"detail2": "text",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "shifts",
"detail1": "code",
"detail2": "text",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "shifts",
"detail1": "library_id",
"detail2": "uuid",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "shifts",
"detail1": "id",
"detail2": "uuid",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "shifts",
"detail1": "end_time",
"detail2": "time without time zone",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "staff",
"detail1": "role",
"detail2": "text",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "staff",
"detail1": "created_at",
"detail2": "timestamp with time zone",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "staff",
"detail1": "force_password_change",
"detail2": "boolean",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "staff",
"detail1": "is_active",
"detail2": "boolean",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "staff",
"detail1": "staff_type",
"detail2": "text",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "staff",
"detail1": "email",
"detail2": "text",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "staff",
"detail1": "name",
"detail2": "text",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "staff",
"detail1": "user_id",
"detail2": "uuid",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "staff",
"detail1": "library_ids",
"detail2": "ARRAY",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "staff",
"detail1": "id",
"detail2": "uuid",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "student_seat_shifts",
"detail1": "end_date",
"detail2": "date",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "student_seat_shifts",
"detail1": "shift_code",
"detail2": "text",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "student_seat_shifts",
"detail1": "seat_id",
"detail2": "uuid",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "student_seat_shifts",
"detail1": "student_id",
"detail2": "uuid",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "student_seat_shifts",
"detail1": "id",
"detail2": "uuid",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "students",
"detail1": "payment_status",
"detail2": "text",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "students",
"detail1": "monthly_rate",
"detail2": "numeric",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "students",
"detail1": "discount_amount",
"detail2": "numeric",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "students",
"detail1": "amount_paid",
"detail2": "numeric",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "students",
"detail1": "created_at",
"detail2": "timestamp with time zone",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "students",
"detail1": "total_fee",
"detail2": "numeric",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "students",
"detail1": "is_deleted",
"detail2": "boolean",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "students",
"detail1": "deleted_at",
"detail2": "timestamp with time zone",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "students",
"detail1": "shift_display",
"detail2": "text",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "students",
"detail1": "combination_key",
"detail2": "text",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "students",
"detail1": "seat_id",
"detail2": "uuid",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "students",
"detail1": "gender",
"detail2": "text",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "students",
"detail1": "phone",
"detail2": "text",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "students",
"detail1": "address",
"detail2": "text",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "students",
"detail1": "father_name",
"detail2": "text",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "students",
"detail1": "name",
"detail2": "text",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "students",
"detail1": "library_id",
"detail2": "uuid",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "students",
"detail1": "admission_date",
"detail2": "date",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "students",
"detail1": "id",
"detail2": "uuid",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "students",
"detail1": "locker_id",
"detail2": "uuid",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "students",
"detail1": "end_date",
"detail2": "date",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "students",
"detail1": "plan_months",
"detail2": "integer",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "students",
"detail1": "selected_shifts",
"detail2": "ARRAY",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "subscription_payments",
"detail1": "razorpay_payment_id",
"detail2": "text",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "subscription_payments",
"detail1": "library_id",
"detail2": "uuid",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "subscription_payments",
"detail1": "id",
"detail2": "uuid",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "subscription_payments",
"detail1": "created_at",
"detail2": "timestamp with time zone",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "subscription_payments",
"detail1": "type",
"detail2": "text",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "subscription_payments",
"detail1": "processed",
"detail2": "boolean",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "subscription_payments",
"detail1": "status",
"detail2": "text",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "subscription_payments",
"detail1": "plan",
"detail2": "text",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "subscription_payments",
"detail1": "amount",
"detail2": "numeric",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "subscription_payments",
"detail1": "razorpay_signature",
"detail2": "text",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "subscription_payments",
"detail1": "razorpay_order_id",
"detail2": "text",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "temp_registrations",
"detail1": "razorpay_order_id",
"detail2": "text",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "temp_registrations",
"detail1": "form_data",
"detail2": "jsonb",
"detail3": "NO",
"detail4": null
},
{
"type": "TABLE",
"name": "temp_registrations",
"detail1": "created_at",
"detail2": "timestamp with time zone",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "temp_registrations",
"detail1": "expires_at",
"detail2": "timestamp with time zone",
"detail3": "YES",
"detail4": null
},
{
"type": "TABLE",
"name": "temp_registrations",
"detail1": "id",
"detail2": "uuid",
"detail3": "NO",
"detail4": null
}
]