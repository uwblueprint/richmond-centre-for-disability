import { ComponentMultiStyleConfig } from '@chakra-ui/theme'; // Multi component style type

// Tabs styles
const Tabs: ComponentMultiStyleConfig = {
  parts: ['root', 'tablist', 'tab', 'tabpanels', 'tabpanel', 'indicator'],
  variants: {
    line: () => {
      return {
        tab: {
          _selected: {
            color: 'primary',
            borderColor: 'primary',
            textStyle: 'button-semibold',
          },
        },
      };
    },
  },
};

export default Tabs;
