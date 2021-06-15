import { extendTheme } from '@chakra-ui/react'; // Extend default Chakra UI theme
import colors from '@tools/theme/colors'; // Theme colors
import typography from '@tools/theme/typography'; // Theme typography
import space from '@tools/theme/spacing'; // Theme spacing

const theme = extendTheme({
  colors,
  ...typography,
  space,
  components: {},
});

export default theme;
