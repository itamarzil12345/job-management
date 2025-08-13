import React from "react";
import {
  Box,
  Flex,
  Text,
  IconButton,
  useColorModeValue,
  HStack,
  Spacer,
  Icon,
} from "@chakra-ui/react";
import { FaSun, FaMoon, FaServer } from "react-icons/fa";
import {
  getBackgroundColor,
  getTextColor,
  getBorderColor,
  getAdditionalColor,
  getGrayColor,
  getBlueColor,
} from "../theme";
import { useTheme } from "../hooks/useTheme";

const TopBar: React.FC = () => {
  const { toggleColorMode, isDark } = useTheme();

  const bgColor = useColorModeValue(
    "rgba(255, 255, 255, 0.95)",
    `rgba(15, 15, 35, 0.95)`
  );
  const borderColor = useColorModeValue(
    getGrayColor("200", false),
    getBorderColor(true)
  );
  const textColor = useColorModeValue(
    getGrayColor("800", false),
    getTextColor(true)
  );
  const logoColor = useColorModeValue(
    getBlueColor("600", false),
    getTextColor(true)
  );

  return (
    <Box
      bg={bgColor}
      borderBottom="1px solid"
      borderColor={borderColor}
      px={4}
      py={2}
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      boxShadow="sm"
      w="100vw"
      backdropFilter="blur(10px)"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: useColorModeValue(
          `linear-gradient(135deg, ${getAdditionalColor(
            "blueGradientStart",
            false
          )} 0%, ${getAdditionalColor("purpleGradientEnd", false)} 100%)`,
          `linear-gradient(135deg, ${getBackgroundColor(
            true
          )} 0%, ${getAdditionalColor(
            "brightPurple",
            true
          )} 25%, ${getAdditionalColor(
            "brightMagenta",
            true
          )} 50%, ${getAdditionalColor(
            "deepSkyBlue",
            true
          )} 75%, ${getBackgroundColor(true)} 100%)`
        ),
        opacity: useColorModeValue(0.1, 0.3),
        zIndex: -1,
      }}
    >
      <Flex align="center" maxW="100vw">
        {/* Logo and Title */}
        <HStack spacing={3}>
          <Box
            bg={logoColor}
            color={getAdditionalColor("white", isDark)}
            p={1.5}
            borderRadius="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={FaServer as any} boxSize={4} />
          </Box>
          <Box>
            <Text
              fontSize="md"
              fontWeight="bold"
              color={textColor}
              letterSpacing="wide"
            >
              Job Dashboard
            </Text>
          </Box>
        </HStack>

        <Spacer />

        {/* Theme Toggle */}
        <IconButton
          aria-label="Toggle theme"
          icon={
            isDark ? (
              <Icon as={FaSun as any} boxSize={3.5} />
            ) : (
              <Icon as={FaMoon as any} boxSize={3.5} />
            )
          }
          onClick={toggleColorMode}
          variant="ghost"
          colorScheme="blue"
          size="sm"
          _hover={{
            bg: useColorModeValue(
              getBlueColor("50", false),
              getBlueColor("900", false)
            ),
          }}
        />
      </Flex>
    </Box>
  );
};

export default TopBar;
