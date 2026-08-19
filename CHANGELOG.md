# Changelog

## 1.14.0

- The Apple Pay and Google Pay buttons now react to `purchaseProps.subtotal` changes at runtime. Previously the amount was only read when the component initialized and later changes were silently ignored; updates are now sent to the running iframe via `postMessage` without reloading it.
- Add an optional `useNativeSubtotal` purchase prop for the Apple Pay button. When true, the Apple Pay button skips the totals (fee quote) fetch and charges exactly the `subtotal` passed to the component.

## 1.12.0

- Add a skeleton loader to the V2 card form (`CoinflowCardForm`). The skeleton occupies the same space as the rendered form to prevent layout shift and disappears once the form is ready for input, removing the blank state during load.
