import React from "react";
import { Button, HStack, Text } from "@chakra-ui/react";
import { useI18n } from "../hooks/useI18n";
import { getGrayColor } from "../theme";
import { useTheme } from "../hooks/useTheme";

export const LanguageSwitcher: React.FC = () => {
  const { t, language, setLanguage } = useI18n();
  const { isDark } = useTheme();

  return (
    <HStack spacing={2}>
      <Text fontSize="sm" color={getGrayColor("600", isDark)}>
        {t("language.label")}
      </Text>
      <Button
        size="sm"
        variant={language === "en" ? "solid" : "outline"}
        colorScheme="blue"
        onClick={() => setLanguage("en")}
      >
        {t("language.english")}
      </Button>
      <Button
        size="sm"
        variant={language === "he" ? "solid" : "outline"}
        colorScheme="blue"
        onClick={() => setLanguage("he")}
      >
        {t("language.hebrew")}
      </Button>
    </HStack>
  );
};
