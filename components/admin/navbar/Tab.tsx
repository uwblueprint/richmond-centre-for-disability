import Link from 'next/link'; // Link component
import { useRouter } from 'next/router'; // Routing
import { Tab as ChakraTab } from '@chakra-ui/react'; // Chakra UI
import { InternalPagePath } from '@tools/admin/layout'; // Internal page path

type Props = {
  path: InternalPagePath;
  additionalMatches?: ReadonlyArray<InternalPagePath>;
  children: string;
};

/**
 * Custom Tab component that handles client-side linking and conditional
 * button text rendering based on current route
 * @param path - Path that the tab links to
 * @param additionalMatches - Paths in addition to `path` that trigger the selected state of the tab
 * @param children - Name of the tab
 * @returns custom tab
 */
export default function Tab(props: Props) {
  const router = useRouter();
  const { pathname } = router;
  const { path, additionalMatches, children } = props;

  // Tab is selected if its path is the current route
  const isSelected =
    path === pathname || additionalMatches?.some(match => pathname.includes(match));

  return (
    <Link href={path}>
      <ChakraTab isSelected={isSelected} marginRight="8px">
        {children}
      </ChakraTab>
    </Link>
  );
}
