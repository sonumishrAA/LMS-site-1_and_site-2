"use client";

import { useState } from "react";
import Step1LibraryInfo from "./Step1LibraryInfo";
import Step2SeatsLockers from "./Step2SeatsLockers";
import Step3Shifts from "./Step3Shifts";
import Step4Pricing from "./Step4Pricing";
import Step5LockerPolicy from "./Step5LockerPolicy";
import Step6Accounts from "./Step6Accounts";
import Step7Payment from "./Step7Payment";
import SuccessScreen from "./SuccessScreen";
import StepProgress from "./StepProgress";

export type RegistrationData = {
  library: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  seats: {
    is_gender_neutral: boolean;
    male_seats: number;
    female_seats: number;
    neutral_seats: number;
  };
  lockers: {
    has_lockers: boolean;
    male_lockers: number;
    female_lockers: number;
    neutral_lockers: number;
  };
  shifts: {
    code: "M" | "A" | "E" | "N";
    name: string;
    start_time: string;
    end_time: string;
  }[];
  combos: {
    combination_key: string;
    months: number;
    fee: number;
  }[];
  locker_policy: {
    eligible_combos: string[];
    monthly_fee: number;
  };
  owner: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    isExisting?: boolean;
  };
  staff_list: {
    name: string;
    email: string;
    password?: string;
    staff_type: "specific" | "combined";
  }[];
  plan: "1m" | "3m" | "6m" | "12m";
  amount: number;
};

const initialData: RegistrationData = {
  library: {
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  },
  seats: {
    is_gender_neutral: false,
    male_seats: 0,
    female_seats: 0,
    neutral_seats: 0,
  },
  lockers: {
    has_lockers: false,
    male_lockers: 0,
    female_lockers: 0,
    neutral_lockers: 0,
  },
  shifts: [
    { code: "M", name: "Morning", start_time: "06:00", end_time: "12:00" },
    { code: "A", name: "Afternoon", start_time: "12:00", end_time: "17:00" },
    { code: "E", name: "Evening", start_time: "17:00", end_time: "22:00" },
    { code: "N", name: "Night", start_time: "22:00", end_time: "06:00" },
  ],
  combos: [],
  locker_policy: { eligible_combos: [], monthly_fee: 0 },
  owner: { name: "", email: "", phone: "" },
  staff_list: [],
  plan: "1m",
  amount: 0,
};

export default function RegistrationForm({ initialOwner }: { initialOwner?: any }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<RegistrationData>(() => ({
    ...initialData,
    owner: {
      ...initialData.owner,
      ...initialOwner
    }
  }));
  const [isSuccess, setIsSuccess] = useState(false);

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const updateData = (newData: Partial<RegistrationData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  if (isSuccess) return <SuccessScreen data={data} />;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <StepProgress currentStep={step} />

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {step === 1 && (
          <Step1LibraryInfo
            data={data.library}
            onNext={(library) => {
              updateData({ library });
              nextStep();
            }}
          />
        )}
        {step === 2 && (
          <Step2SeatsLockers
            data={{ seats: data.seats, lockers: data.lockers }}
            onNext={({ seats, lockers }) => {
              updateData({ seats, lockers });
              nextStep();
            }}
            onBack={prevStep}
          />
        )}
        {step === 3 && (
          <Step3Shifts
            data={data.shifts}
            onNext={(shifts) => {
              updateData({ shifts });
              nextStep();
            }}
            onBack={prevStep}
          />
        )}
        {step === 4 && (
          <Step4Pricing
            data={data}
            onNext={(combos) => {
              updateData({ combos });
              nextStep();
            }}
            onBack={prevStep}
          />
        )}
        {step === 5 && (
          <Step5LockerPolicy
            data={data}
            onNext={(locker_policy) => {
              updateData({ locker_policy });
              nextStep();
            }}
            onBack={prevStep}
          />
        )}
        {step === 6 && (
          <Step6Accounts
            data={data}
            onNext={(owner, staff_list) => {
              updateData({ owner, staff_list });
              nextStep();
            }}
            onBack={prevStep}
          />
        )}
        {step === 7 && (
          <Step7Payment
            data={data}
            onSuccess={() => setIsSuccess(true)}
            onBack={prevStep}
          />
        )}
      </div>
    </div>
  );
}
