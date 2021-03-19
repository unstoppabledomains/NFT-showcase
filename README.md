# NFT showcase

For creating NFT showcase template for website

To move app into website template:

1. yarn build
2. remove build folder into /backend/lib/helpers/p2p-templates/templates/nft-collection/
3. rename folder to template-build
4. copy contents of template-build/index.html and move into nft-collection/nft-collection.ts
   - put into the string return statement
   - make sure there's no \n in the string or app won't render
   - replace every ryan.crypto with ${domain}
5. delete template-build/index.html
