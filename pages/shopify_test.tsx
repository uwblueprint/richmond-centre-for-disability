import Shopify, { ApiVersion, AuthQuery } from '@shopify/shopify-api';
import Client, { Cart, Product } from 'shopify-buy';
import { Text, Image, Button} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

const client = Client.buildClient({
    domain: "poppy-hazel.myshopify.com",
    storefrontAccessToken: "64b319dde0d72cf6491db234e9a6b3e4"
});

export default function Shopify_Test(){
    const [products, setProducts] = useState<Product[]>([]);
    const [checkout, setCheckout] = useState<Cart>();
    
    useEffect(() => {
        async function getCheckout() {
            const checkout = await client.checkout.create();
            const products = await client.product.fetchAll()
            setProducts(products);
            setCheckout(checkout);
            const lineItemsToAdd = [{variantId: products[0].variants[0].id, quantity: 1}]
            client.checkout.addLineItems(checkout.id, lineItemsToAdd)
        }
        getCheckout();
        console.log(checkout);
        
    }, [])

    return (
        <>
            {products.map(p => (
                <>
                    <Text> {p.title} </Text>
                    <Image src={`${p.images[0]?.src}`} boxSize="300"></Image>
                    <Button 
                        variant="solid"
                        onClick={()=>{window.open(checkout?.webUrl)}}
                    >Buy now!</Button>
                    <Text>{checkout?.orderStatusUrl}</Text>
                </>
                )
            )}
        </>
    )
}