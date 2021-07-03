import Link from 'next/link'; // Link component
import { useRouter } from 'next/router'; // Routing
import { Tab as ChakraTab, Text } from '@chakra-ui/react'; // Chakra UI
import { InternalPagePath } from '@tools/components/internal/layout'; // Internal page paths

type Props = {
  path: InternalPagePath;
  children: string;
};

/**
 * Custom Tab component that handles client-side linking and conditional
 * button text rendering based on current route
 * @param props - Props
 * @returns custom tab
 */
export default function Tab(props: Props) {
  const router = useRouter();
  const { pathname } = router;
  const { path, children } = props;

  // Tab is selected if its path is the current route
  const isSelected = path === pathname;

  return (
    <Link href={path}>
      <ChakraTab isSelected={isSelected} marginRight="8px">
        {isSelected ? (
          <Text as="p" textStyle="button-semibold">
            {children}
          </Text>
        ) : (
          children
        )}
      </ChakraTab>
    </Link>
  );
}
