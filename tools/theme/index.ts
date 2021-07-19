import { extendTheme } from '@chakra-ui/react'; // Extend default Chakra UI theme
import colors from '@tools/theme/colors'; // Theme colors
import typography from '@tools/theme/typography'; // Theme typography
import space from '@tools/theme/spacing'; // Theme spacing
import shadows from '@tools/theme/shadows'; // Theme shadows
import textStyles from '@tools/theme/text-styles'; // Text styles

// Component styles
import Button from '@tools/theme/components/button'; // Button styles
import Form from '@tools/theme/components/form'; // Form control styles
import FormLabel from '@tools/theme/components/form-label'; // Form label styles
import Checkbox from '@tools/theme/components/checkbox'; // Checkbox styles
import Alert from '@tools/theme/components/alert'; // Alert styles (shared by Toast)
import Tabs from '@tools/theme/components/tabs'; // Tabs styles
import Badge from '@tools/theme/components/badge'; // Badge styles
import { StepsStyleConfig as Steps } from 'chakra-ui-steps'; // Steps styles (imported from chakra-ui-steps)
import Table from '@tools/theme/components/table'; //Table styles

const theme = extendTheme({
  colors,
  ...typography,
  space,
  shadows,
  components: { Button, Form, FormLabel, Checkbox, Alert, Tabs, Badge, Steps, Table },
  textStyles,
});

export default theme;
