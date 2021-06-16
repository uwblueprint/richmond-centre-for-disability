import { extendTheme } from '@chakra-ui/react'; // Extend default Chakra UI theme
import colors from '@tools/theme/colors'; // Theme colors
import typography from '@tools/theme/typography'; // Theme typography
import space from '@tools/theme/spacing'; // Theme spacing
import textStyles from '@tools/theme/text-styles'; // Text styles

// Component styles
import Button from '@tools/theme/components/button'; // Button styles
import Form from '@tools/theme/components/form'; // Form control styles
import FormLabel from '@tools/theme/components/form-label'; // Form label styles
import Checkbox from '@tools/theme/components/checkbox'; // Checkbox styles
import Alert from '@tools/theme/components/alert'; // Alert styles (shared by Toast)

const theme = extendTheme({
  colors,
  ...typography,
  space,
  components: { Button, Form, FormLabel, Checkbox, Alert },
  textStyles,
});

export default theme;
