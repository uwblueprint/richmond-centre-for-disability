import { ComponentSingleStyleConfig } from '@chakra-ui/react'; // Single component style config

// Button style config
const Button: ComponentSingleStyleConfig = {
  // Base style
  baseStyle: {
    borderRadius: '0.375rem',
  },

  // Variants (solid, outline, ghost, link)
  variants: {
    solid: ({ colorScheme }) => {
      const bgColor = colorScheme === 'primary' ? 'primary' : `secondary.${colorScheme}`;
      return {
        bg: bgColor,
        color: colorScheme === 'gray' ? 'black' : 'white',
        _hover: {
          bg: `overlay.${bgColor}.20`,
          _disabled: {
            bg: bgColor, // Disable color change when disabled button is hovered over
          },
        },
      };
    },
    outline: ({ colorScheme }) => ({
      bg: 'transparent',
      color: colorScheme === 'primary' ? 'primary' : `texticon.${colorScheme}`,
      borderColor: colorScheme === 'primary' ? 'primary' : `border.${colorScheme}`,
      _hover: {
        bg: `background.${colorScheme === 'primary' ? 'interactive' : colorScheme}`,
      },
    }),
    ghost: ({ colorScheme }) => ({
      bg: 'transparent',
      color: colorScheme === 'primary' ? 'primary' : `texticon.${colorScheme}`,
      _hover: {
        bg: `background.${colorScheme === 'primary' ? 'interactive' : colorScheme}`,
      },
    }),
    link: ({ colorScheme }) => ({
      bg: 'transparent',
      color: colorScheme === 'primary' ? 'primary' : `texticon.${colorScheme}`,
      fontWeight: 'semibold',
      _hover: {
        fontWeight: 'bold',
      },
    }),
  },

  // Button sizes (lg, md, sm, xs)
  sizes: {
    lg: {
      fontSize: '1.125rem',
      height: '2.5rem',
      paddingX: '1rem',
    },
    md: {
      fontSize: '1rem',
      height: '2.5rem',
      paddingX: '1rem',
    },
    sm: {
      fontSize: '0.875rem',
      height: '2rem',
      paddingX: '0.75rem',
    },
    xs: {
      fontSize: '0.75rem',
      height: '1.5rem',
      paddingX: '0.5rem',
    },
  },

  // Default styles
  defaultProps: {
    variant: 'solid',
    size: 'md',
    colorScheme: 'primary',
  },
};

export default Button;
