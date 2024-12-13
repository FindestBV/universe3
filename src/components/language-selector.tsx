import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Language = {
  code: string;
  name: string;
};

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const languages: Language[] = [
    { code: 'nl', name: 'Nederlands' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'tr', name: 'Türkçe' }
  ];

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <Select 
      value={i18n.language} 
      onValueChange={changeLanguage}
    >
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
