-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'PATIENT', 'NURSE', 'DOCTOR');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE', 'DORMANT');

-- CreateEnum
CREATE TYPE "JOBTYPE" AS ENUM ('FULL', 'PART');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('BOY', 'GIRL');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'SCHEDULED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CARD');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'UNPAID', 'PART');

-- CreateEnum
CREATE TYPE "DevelopmentStatus" AS ENUM ('NORMAL', 'DELAYED', 'ADVANCED', 'CONCERNING');

-- CreateEnum
CREATE TYPE "ImmunizationStatus" AS ENUM ('COMPLETED', 'PENDING', 'DELAYED', 'EXEMPTED');

-- CreateTable
CREATE TABLE "user" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "session" (
    "_id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "account" (
    "_id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "verification" (
    "_id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "verification_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "todo" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "todo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT 'BOY',
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nutritional_status" TEXT,
    "address" TEXT NOT NULL,
    "emergency_contact_name" TEXT NOT NULL,
    "emergency_contact_number" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "blood_group" TEXT,
    "allergies" TEXT,
    "medicalConditions" TEXT,
    "medical_history" TEXT,
    "role" "Role" DEFAULT 'PATIENT',
    "img" TEXT,
    "colorCode" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "license_number" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" "Role" DEFAULT 'DOCTOR',
    "address" TEXT NOT NULL,
    "department" TEXT,
    "img" TEXT,
    "colorCode" TEXT,
    "availabilityStatus" TEXT,
    "type" "JOBTYPE" NOT NULL DEFAULT 'FULL',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "working_days" (
    "id" SERIAL NOT NULL,
    "doctor_id" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "start_time" TEXT NOT NULL,
    "close_time" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "working_days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "department" TEXT,
    "img" TEXT,
    "licenseNumber" TEXT,
    "colorCode" TEXT,
    "role" "Role" NOT NULL DEFAULT 'NURSE',
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointment" (
    "id" SERIAL NOT NULL,
    "patient_id" TEXT NOT NULL,
    "doctor_id" TEXT NOT NULL,
    "appointment_date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "type" TEXT NOT NULL,
    "note" TEXT,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" SERIAL NOT NULL,
    "bill_id" INTEGER,
    "patient_id" TEXT NOT NULL,
    "appointment_id" INTEGER NOT NULL,
    "bill_date" TIMESTAMP(3) NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "amount_paid" DOUBLE PRECISION NOT NULL,
    "payment_method" "PaymentMethod" NOT NULL DEFAULT 'CASH',
    "status" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "receipt_number" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_bill" (
    "id" SERIAL NOT NULL,
    "bill_id" INTEGER NOT NULL,
    "service_id" INTEGER NOT NULL,
    "service_date" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_cost" DOUBLE PRECISION NOT NULL,
    "total_cost" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_bill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lab_test" (
    "id" SERIAL NOT NULL,
    "record_id" INTEGER NOT NULL,
    "test_date" TIMESTAMP(3) NOT NULL,
    "result" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "service_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lab_test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical_record" (
    "id" SERIAL NOT NULL,
    "patient_id" TEXT NOT NULL,
    "appointment_id" INTEGER NOT NULL,
    "doctor_id" TEXT NOT NULL,
    "treatment_plan" TEXT,
    "prescriptions" TEXT,
    "lab_request" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medical_record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vital_signs" (
    "id" SERIAL NOT NULL,
    "patient_id" TEXT NOT NULL,
    "medical_id" INTEGER NOT NULL,
    "body_temperature" DOUBLE PRECISION NOT NULL,
    "heart_rate" TEXT NOT NULL,
    "respiratory_rate" INTEGER,
    "oxygen_saturation" INTEGER,
    "weight" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "others" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vital_signs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diagnosis" (
    "id" SERIAL NOT NULL,
    "patient_id" TEXT NOT NULL,
    "medicalId" INTEGER NOT NULL,
    "doctorId" TEXT NOT NULL,
    "symptoms" TEXT NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "notes" TEXT,
    "prescribedMedications" TEXT,
    "follow_up_plan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "diagnosis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "record_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "model" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rating" (
    "id" SERIAL NOT NULL,
    "staff_id" TEXT,
    "patient_id" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service" (
    "id" SERIAL NOT NULL,
    "service_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "growth_record" (
    "id" SERIAL NOT NULL,
    "patient_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "ageDays" INTEGER NOT NULL,
    "age_months" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "headCircumference" DOUBLE PRECISION,
    "bmi" DOUBLE PRECISION,
    "weight_for_age_z" DOUBLE PRECISION,
    "height_for_age_z" DOUBLE PRECISION,
    "bmi_for_age_z" DOUBLE PRECISION,
    "hcForAgeZ" DOUBLE PRECISION,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "growth_record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WHOGrowthStandard" (
    "id" SERIAL NOT NULL,
    "gender" "Gender" NOT NULL,
    "ageDays" INTEGER NOT NULL,
    "measurementType" TEXT NOT NULL,
    "lValue" DOUBLE PRECISION NOT NULL,
    "mValue" DOUBLE PRECISION NOT NULL,
    "sValue" DOUBLE PRECISION NOT NULL,
    "sd4neg" DOUBLE PRECISION,
    "sd3neg" DOUBLE PRECISION NOT NULL,
    "sd2neg" DOUBLE PRECISION NOT NULL,
    "sd1neg" DOUBLE PRECISION NOT NULL,
    "sd0" DOUBLE PRECISION NOT NULL,
    "sd1pos" DOUBLE PRECISION NOT NULL,
    "sd2pos" DOUBLE PRECISION NOT NULL,
    "sd3pos" DOUBLE PRECISION NOT NULL,
    "sd4pos" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WHOGrowthStandard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "immunization" (
    "id" SERIAL NOT NULL,
    "pediatric_patient_id" TEXT NOT NULL,
    "vaccine_name" TEXT NOT NULL,
    "dose_number" INTEGER NOT NULL,
    "date_administered" TIMESTAMP(3) NOT NULL,
    "administered_by" TEXT,
    "batch_number" TEXT,
    "expiry_date" TIMESTAMP(3),
    "site" TEXT,
    "status" "ImmunizationStatus" NOT NULL DEFAULT 'COMPLETED',
    "next_due_date" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "immunization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "developmental_check" (
    "id" SERIAL NOT NULL,
    "patientId" TEXT NOT NULL,
    "checkDate" TIMESTAMP(3) NOT NULL,
    "ageMonths" INTEGER NOT NULL,
    "motorSkills" "DevelopmentStatus" NOT NULL,
    "languageSkills" "DevelopmentStatus" NOT NULL,
    "socialSkills" "DevelopmentStatus" NOT NULL,
    "cognitiveSkills" "DevelopmentStatus" NOT NULL,
    "milestonesMet" TEXT,
    "milestonesPending" TEXT,
    "concerns" TEXT,
    "recommendations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "developmental_check_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vaccine_schedule" (
    "id" SERIAL NOT NULL,
    "vaccine_name" TEXT NOT NULL,
    "recommendedAge" TEXT NOT NULL,
    "doses_required" INTEGER NOT NULL,
    "minimumInterval" INTEGER,
    "is_mandatory" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vaccine_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "patient_email_key" ON "patient"("email");

-- CreateIndex
CREATE INDEX "patient_email_idx" ON "patient"("email");

-- CreateIndex
CREATE INDEX "patient_phone_idx" ON "patient"("phone");

-- CreateIndex
CREATE INDEX "patient_date_of_birth_gender_idx" ON "patient"("date_of_birth", "gender");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_email_key" ON "doctor"("email");

-- CreateIndex
CREATE INDEX "doctor_specialization_idx" ON "doctor"("specialization");

-- CreateIndex
CREATE INDEX "doctor_email_idx" ON "doctor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "staff_email_key" ON "staff"("email");

-- CreateIndex
CREATE INDEX "appointment_appointment_date_status_idx" ON "appointment"("appointment_date", "status");

-- CreateIndex
CREATE INDEX "appointment_patient_id_doctor_id_idx" ON "appointment"("patient_id", "doctor_id");

-- CreateIndex
CREATE INDEX "appointment_doctor_id_appointment_date_idx" ON "appointment"("doctor_id", "appointment_date");

-- CreateIndex
CREATE UNIQUE INDEX "payment_appointment_id_key" ON "payment"("appointment_id");

-- CreateIndex
CREATE INDEX "payment_patient_id_status_idx" ON "payment"("patient_id", "status");

-- CreateIndex
CREATE INDEX "payment_payment_date_idx" ON "payment"("payment_date");

-- CreateIndex
CREATE UNIQUE INDEX "lab_test_service_id_key" ON "lab_test"("service_id");

-- CreateIndex
CREATE INDEX "medical_record_patient_id_created_at_idx" ON "medical_record"("patient_id", "created_at");

-- CreateIndex
CREATE INDEX "growth_record_patient_id_date_idx" ON "growth_record"("patient_id", "date");

-- CreateIndex
CREATE INDEX "growth_record_patient_id_ageDays_idx" ON "growth_record"("patient_id", "ageDays");

-- CreateIndex
CREATE INDEX "growth_record_ageDays_gender_idx" ON "growth_record"("ageDays", "gender");

-- CreateIndex
CREATE INDEX "WHOGrowthStandard_gender_ageDays_measurementType_idx" ON "WHOGrowthStandard"("gender", "ageDays", "measurementType");

-- CreateIndex
CREATE UNIQUE INDEX "WHOGrowthStandard_gender_ageDays_measurementType_key" ON "WHOGrowthStandard"("gender", "ageDays", "measurementType");

-- CreateIndex
CREATE INDEX "immunization_pediatric_patient_id_vaccine_name_idx" ON "immunization"("pediatric_patient_id", "vaccine_name");

-- CreateIndex
CREATE INDEX "immunization_next_due_date_status_idx" ON "immunization"("next_due_date", "status");

-- CreateIndex
CREATE INDEX "developmental_check_patientId_checkDate_idx" ON "developmental_check"("patientId", "checkDate");

-- CreateIndex
CREATE INDEX "developmental_check_ageMonths_idx" ON "developmental_check"("ageMonths");

-- CreateIndex
CREATE UNIQUE INDEX "vaccine_schedule_vaccine_name_recommendedAge_key" ON "vaccine_schedule"("vaccine_name", "recommendedAge");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_days" ADD CONSTRAINT "working_days_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_bill" ADD CONSTRAINT "patient_bill_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_bill" ADD CONSTRAINT "patient_bill_bill_id_fkey" FOREIGN KEY ("bill_id") REFERENCES "payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_test" ADD CONSTRAINT "lab_test_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_test" ADD CONSTRAINT "lab_test_record_id_fkey" FOREIGN KEY ("record_id") REFERENCES "medical_record"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_record" ADD CONSTRAINT "medical_record_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_record" ADD CONSTRAINT "medical_record_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vital_signs" ADD CONSTRAINT "vital_signs_medical_id_fkey" FOREIGN KEY ("medical_id") REFERENCES "medical_record"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnosis" ADD CONSTRAINT "diagnosis_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnosis" ADD CONSTRAINT "diagnosis_medicalId_fkey" FOREIGN KEY ("medicalId") REFERENCES "medical_record"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rating" ADD CONSTRAINT "rating_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rating" ADD CONSTRAINT "rating_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "growth_record" ADD CONSTRAINT "growth_record_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "immunization" ADD CONSTRAINT "immunization_pediatric_patient_id_fkey" FOREIGN KEY ("pediatric_patient_id") REFERENCES "patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "developmental_check" ADD CONSTRAINT "developmental_check_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
