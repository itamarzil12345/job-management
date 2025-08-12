import React from "react";
import { Button, HStack, Text } from "@chakra-ui/react";
import { useLanguage } from "../contexts/LanguageContext";

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <HStack spacing={2}>
      <Text fontSize="sm" color="gray.600">
        {language === "he" ? "שפה:" : "Language:"}
      </Text>
      <Button
        size="sm"
        variant={language === "en" ? "solid" : "outline"}
        colorScheme="blue"
        onClick={() => setLanguage("en")}
      >
        EN
      </Button>
      <Button
        size="sm"
        variant={language === "he" ? "solid" : "outline"}
        colorScheme="blue"
        onClick={() => setLanguage("he")}
      >
        עברית
      </Button>
    </HStack>
  );
};
