import React from "react";
import { Button, HStack, Text, useColorMode } from "@chakra-ui/react";
import { useLanguage } from "../contexts/LanguageContext";
import { getGrayColor } from "../theme";

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <HStack spacing={2}>
      <Text fontSize="sm" color={getGrayColor("600", isDark)}>
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
