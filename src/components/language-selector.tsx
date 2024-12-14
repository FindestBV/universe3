import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setLanguage } from '@/services/utilities/languageSlice';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const selectedLanguage = useSelector((state: RootState) => state.language.selectedLanguage);

  const languages = [
    { code: 'al', name: 'Shqip' },
    { code: 'nl', name: 'Nederlands' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'ie', name: 'Gaeilge' },
    { code: 'es', name: 'Español' },
    { code: 'pt', name: 'Português' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'gr', name: 'Ελληνικά' },
  ];

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    dispatch(setLanguage(languageCode)); // Update Redux state
  };

  return (
    <Select value={selectedLanguage} onValueChange={changeLanguage}>
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
