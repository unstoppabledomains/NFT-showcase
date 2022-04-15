# Updating template

Navigate to nft-showcase repo

1. yarn build

2. npx gulp

3. Clean up index.html

- If updated CSS, copy paste <style> content in <head> tag into App.tsx useEffect() and go back to step 1

4. Remove <style> tag in <head>

5. Copy paste <script> tag into new script.js file

6. Clean up script.js file by removing all <script> and </script> tags

- there are multiple script tags, we're just combining them into one

7. remove <script> tags in index.html and replace with <script src="https://storage.googleapis.com/unstoppable-client-assets/nft-gallery/app.js"></script>

8. remove build/static folder and asset.manifest

9. to test, replace index.html script tag src with location to script.js

10. move script.js into backend/lib/routes/public/nft-collection.js

11. move rest of build into backend/lib/helpers/p2p-templates/templates/nft-collection/template-build

12. move index.html content into backend/lib/helpers/p2p-templates/templates/nft-collection/nft-collection.ts
