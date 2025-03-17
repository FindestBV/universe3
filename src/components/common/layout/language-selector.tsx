import { setLanguage } from "@/api/utilities/languageSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "nl", name: "Nederlands" },
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
  { code: "tr", name: "Türkçe" },
  { code: "al", name: "Shqip" },
  { code: "ie", name: "Gaeilge" },
  { code: "es", name: "Español" },
  { code: "pt", name: "Português" },
  { code: "de", name: "Deutsch" },
  { code: "it", name: "Italiano" },
  { code: "gr", name: "Ελληνικά" },
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const selectedLanguage = useAppSelector((state) => state.language.selectedLanguage);

  useEffect(() => {
    i18n.changeLanguage(selectedLanguage); // Sync Redux state with i18n
  }, [selectedLanguage, i18n]);

  const changeLanguage = async (languageCode: string) => {
    try {
      await i18n.changeLanguage(languageCode);
      dispatch(setLanguage(languageCode)); // Update Redux state, could also be donw with Async local storage
    } catch (error) {
      console.error("Failed to change language:", error);
    }
  };

  return (
    <Select value={selectedLanguage} onValueChange={changeLanguage} aria-label="Language Selector">
      <SelectTrigger className="w-[70px] bg-white uppercase">
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent className="bg-white text-black">
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code} className="uppercase">
            {lang.code}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
