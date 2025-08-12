import React from "react";
import {
  Box,
  Flex,
  Text,
  IconButton,
  useColorMode,
  useColorModeValue,
  HStack,
  Spacer,
  Icon,
} from "@chakra-ui/react";
import { FaSun, FaMoon, FaServer } from "react-icons/fa";
import { IconType } from "react-icons";

const TopBar: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const bgColor = useColorModeValue(
    "rgba(255, 255, 255, 0.95)",
    "rgba(15, 15, 35, 0.95)"
  );
  const borderColor = useColorModeValue("gray.200", "#8a2be2");
  const textColor = useColorModeValue("gray.800", "#8a2be2");
  const logoColor = useColorModeValue("blue.600", "#8a2be2");

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
          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          "linear-gradient(135deg, #0f0f23 0%, #8a2be2 25%, #ff0080 50%, #00bfff 75%, #0f0f23 100%)"
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
            color="white"
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
            bg: useColorModeValue("blue.50", "blue.900"),
          }}
        />
      </Flex>
    </Box>
  );
};

export default TopBar;
