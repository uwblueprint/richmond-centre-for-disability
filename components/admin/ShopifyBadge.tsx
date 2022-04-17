import { Badge, Box, Wrap } from '@chakra-ui/react'; // Chakra UI
import Image from 'next/image'; // Optimized images

export default function ShopifyBadge() {
  return (
    <Wrap>
      <Badge variant={'ACTIVE'}>
        <Box pt="5px">
          <Image src="/assets/shopify-icon.svg" alt="Shopify Icon" height={70} width={70} />
        </Box>
      </Badge>
    </Wrap>
  );
}
