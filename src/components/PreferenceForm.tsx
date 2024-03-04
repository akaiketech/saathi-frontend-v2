"use client";
import { Formik, Form } from "formik";

import React, { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import { useGlobalContext } from "../hooks/context";
import { generateSessionId } from "../utils/utils";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { checkUserTnCStatus } from "../services";

const LANGUAGES = ["Hindi", "English", "Kannada", "Tamil"];
const LOCATIONS = ["Karnataka", "Madhya Pradesh", "Tamil Nadu"];

type FormValues = {
  language: string;
  state: string;
};

type Props = {
  isModal?: boolean;
};

const PreferenceForm = ({ isModal }: Props) => {
  const router = useRouter();
  const [nextRoute, setNextRoute] = useState("/terms");
  const { language, setLanguage, setLocation, setSessionId } =
    useGlobalContext();
  const initVals: FormValues = {
    language: "",
    state: "",
  };

  useEffect(() => {
    (async () => {
      const res = await checkUserTnCStatus();
      if (res.data.terms_and_conditions_status) {
        setNextRoute("/chat");
      }
    })();
  }, []);

  const loc2lang: { [key: string]: string } = {
    Karnataka: "Kannada",
    "Madhya Pradesh": "Hindi",
    "Tamil Nadu": "Tamil",
  };

  const onLocationChange = (val: string) => {
    // save to local storage
    localStorage.setItem("location", val);
    localStorage.setItem("language", loc2lang[val]);
    setLocation(val);
    setLanguage(loc2lang[val]);
  };

  const onLanguageChange = (val: string) => {
    // save to local storage
    localStorage.setItem("language", val);
    setLanguage(val);
  };

  const validateInputs = (lang: string, location: string): boolean => {
    if (LANGUAGES.includes(lang) && LOCATIONS.includes(location)) {
      return true;
    }
    return false;
  };

  return (
    <Formik
      initialValues={initVals}
      onSubmit={(values, actions) => {
        actions.setSubmitting(false);
      }}
    >
      {({ values, setFieldValue }) => (
        <Form className="flex flex-col items-center justify-center gap-10 md:gap-0">
          <div className="flex flex-col items-center gap-10 md:gap-5 md:flex-row md:mb-20 md:mt-24">
            <Dropdown
              label="Select Location"
              options={LOCATIONS}
              value={values.state}
              onChange={(val) => {
                setFieldValue("state", val);
                setFieldValue("language", loc2lang[val]);
                onLocationChange(val);
              }}
              type="location"
            />
            <Dropdown
              label="Select Language"
              options={LANGUAGES}
              value={values.language}
              onChange={(val) => {
                setFieldValue("language", val);
                onLanguageChange(val);
              }}
            />
          </div>
          <Start
            language={language}
            onClick={() => {
              if (validateInputs(values.language, values.state)) {
                const newSessionId = generateSessionId();
                setSessionId(newSessionId);
                if (isModal) {
                  window.location.reload();
                } else {
                  router.push(nextRoute);
                }
              } else {
                toast.error("Please select a valid language and location");
              }
            }}
          />
        </Form>
      )}
    </Formik>
  );
};

const Start = ({
  language,
  onClick,
}: {
  language: string;
  onClick?: () => void;
}) => {
  const [startNowLang, setStartNowLang] = useState("START");

  useEffect(() => {
    switch (language.toLowerCase()) {
      case "hindi":
        setStartNowLang("शुरू करें");
        break;

      case "kannada":
        setStartNowLang("ಪ್ರಾರಂಭಿಸಿ");
        break;

      case "tamil":
        setStartNowLang("தொடங்கு");
        break;

      default:
        setStartNowLang("START");
    }
  }, [language]);

  return (
    <div>
      <button
        type="submit"
        onClick={onClick}
        className="flex justify-center items-center shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-[50px] md:rounded-[60px] bg-[#ff725e] text-white text-2xl md:text-[64px] font-medium px-6 py-3 md:py-8 md:px-8"
      >
        {startNowLang}
        <span className="w-8 md:w-16 ml-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 70 70"
            fill="none"
          >
            <path
              d="M28.4375 4.375C24.9578 4.37905 21.6217 5.76316 19.1612 8.2237C16.7007 10.6842 15.3166 14.0203 15.3125 17.5H19.6875C19.6875 15.1794 20.6094 12.9538 22.2503 11.3128C23.8913 9.67187 26.1169 8.75 28.4375 8.75C30.7581 8.75 32.9837 9.67187 34.6247 11.3128C36.2656 12.9538 37.1875 15.1794 37.1875 17.5H41.5625C41.5584 14.0203 40.1743 10.6842 37.7138 8.2237C35.2533 5.76316 31.9172 4.37905 28.4375 4.375Z"
              fill="white"
            />
            <path
              d="M45.9375 65.625H36.225C34.0303 65.6244 31.916 64.7992 30.3012 63.3128L10.1762 44.7934C9.70637 44.3639 9.33579 43.837 9.09034 43.2496C8.84489 42.6622 8.73047 42.0283 8.75504 41.3922C8.77961 40.756 8.94259 40.1328 9.23262 39.5661C9.52265 38.9993 9.93276 38.5027 10.4344 38.1106C11.2937 37.481 12.3473 37.1739 13.4103 37.2431C14.4734 37.3123 15.4782 37.7534 16.2487 38.4891L24.0625 45.6247V17.5C24.0625 16.3397 24.5234 15.2269 25.3439 14.4064C26.1644 13.5859 27.2772 13.125 28.4375 13.125C29.5978 13.125 30.7106 13.5859 31.5311 14.4064C32.3516 15.2269 32.8125 16.3397 32.8125 17.5V32.8125C32.8125 31.6522 33.2734 30.5394 34.0939 29.7189C34.9144 28.8984 36.0272 28.4375 37.1875 28.4375C38.3478 28.4375 39.4606 28.8984 40.2811 29.7189C41.1016 30.5394 41.5625 31.6522 41.5625 32.8125V35C41.5625 33.8397 42.0234 32.7269 42.8439 31.9064C43.6644 31.0859 44.7772 30.625 45.9375 30.625C47.0978 30.625 48.2106 31.0859 49.0311 31.9064C49.8516 32.7269 50.3125 33.8397 50.3125 35V37.1875C50.3125 36.0272 50.7734 34.9144 51.5939 34.0939C52.4144 33.2734 53.5272 32.8125 54.6875 32.8125C55.8478 32.8125 56.9606 33.2734 57.7811 34.0939C58.6016 34.9144 59.0625 36.0272 59.0625 37.1875V52.5C59.0625 55.981 57.6797 59.3194 55.2183 61.7808C52.7569 64.2422 49.4185 65.625 45.9375 65.625Z"
              fill="white"
            />
          </svg>
        </span>
      </button>
    </div>
  );
};

export default PreferenceForm;
