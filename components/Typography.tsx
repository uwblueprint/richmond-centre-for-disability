import { ReactNode } from 'react'; // Type of React children
import { Text } from '@chakra-ui/react';

type Variant = 'xsmall' | 'caption' | 'regular' | 'bold';

type Props = {
  variant?: Variant;
  children: ReactNode;
};

const textConfig: Record<
  Variant,
  {
    as: string;
    size: string;
  }
> = {
  xsmall: {
    as: 'p',
    size: 'xs',
  },
};

export default function Text(props: Props) {
  const variant = props.variant || 'regular';
  const textProps = textConfig[variant];
  const children = props.children;

  return <Text {...textProps}>{children}</Text>;
}
