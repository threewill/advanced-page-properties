## ThreeWillFooter (canonical)

This is the canonical ThreeWill footer pattern for SPFx dashboard-style web parts.

### Where it should land in product repos

Pick one standard location per repo type. For SPFx React web parts, recommended:

- `src/components/threewill/ThreeWillFooter.tsx`
- `src/components/threewill/ThreeWillFooter.module.scss`
- `src/components/threewill/ThreeWill-headerLogo-onWhite.png`

### Usage

Import and render at the bottom of your main app shell / dashboard view:

```tsx
import { ThreeWillFooter } from '../../components/threewill/ThreeWillFooter';

// ...
<ThreeWillFooter />
```

### Notes

- Logo is the official **`ThreeWill-headerLogo-onWhite.png`** (same file name as DDS Referrals), co-located with the component and loaded via a static **`import`** so webpack bundles it into the web part. Always commit the PNG beside the TSX; missing files are the most common cause of a broken logo.
- If marketing ships a new logo, replace the PNG in **`patterns/ThreeWillFooter/`** in this repo, run `sync-spfx-patterns.ps1` on each product, and commit.
- UTM parameters default to DDS values and can be overridden via props.
