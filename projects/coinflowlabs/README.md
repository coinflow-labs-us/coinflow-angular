# Coinflowlabs

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.0.

# Changelog

## 1.8.0

- New `CoinflowCardForm` component — simple card input with a single `tokenize()` call and full theme support
- Added theme options for `fontSize`and placeholder text
- Improved security for iframe communication

## 1.7.2

- Fixed typing for sessionKey being not present when passing the wallet object

## 1.7.1

- Added support for overriding the default account type (from merchant settings) used for chargeback protection via `chargebackProtectionAccountType` in the URL parameters.

## 1.6.1

- Added support for custom pay-in fees via `customPayInFees` in the JWT token or URL parameters. This allows merchants to add custom fee line items (fixed or percentage-based) that are displayed during checkout.

## 1.6.0

- New Blockchain Support: The SDK now supports Stellar, a fast and low-cost blockchain for payments. Pass blockchain='stellar' to enable Stellar payment processing.

## 1.5.0

- Added zeroAuthorizationConfig prop to CoinflowPurchase for controlling zero authorization behavior (show/hide saved payment methods, verify a specific card by token). Deprecates isZeroAuthorization boolean prop.

## 1.4.0

- New Blockchain Support: The SDK now supports Monad, a high-performance EVM-compatible blockchain. Pass blockchain='monad' to enable Monad payment processing.

## 1.3.2

- Internal change to a query parameter name for zero authorization

## 1.3.1

- Added `redemptionCheck` to purchase (Solana only)

## 1.3.0

- Added `allowedWithdrawSpeeds` query parameter to allow merchants to specify what withdraw speeds are allowed. The default is all.

## 1.2.1

- Added more `chargebackProtectionData` product types

## 1.2.0

- Added `partialUsdcChecked` property to pre-check partial USDC payment checkbox

## 1.1.5

- Added `onLoad` property

## 1.1.0

- Added Multi-Currency Presentment via the `presentment` property

## 1.0.7

- Improving Withdraw With Session Keys

## 1.0.6

- Add credentialless to iframe

## 1.0.5

- Fixing `onAuthDeclined` callback

## 1.0.4

- Added `seller` prop to `chargebackProtectionData`

## 1.0.2

- Added `allowedPaymentMethods` to `CoinflowPurchase`
- Options are:
  - 'card' = Credit and debit cards
  - 'ach' = ACH bank account transfers
  - 'fasterPayments' = UK Faster Payments (GBP Bank Transfers)
  - 'sepa' = SEPA bank account transfers (EUR Bank Transfers)
  - 'pix' = Pix bank account transfers (BRL Bank Transfers)
  - 'usdc' = USDC
  - 'googlePay' = Google Pay
  - 'applePay' = Apple Pay
  - 'credits' = Credits

## 1.0.1

- Allow copy to clipboard for Coinflow Iframe

## 1.0.0

- Deprecating `amount` and `token` in favor of subtotal which can be accessed via the following ways:
- Added multi-currency support for presentment
- SEPA and UK Faster Payments support

```js
{
  cents: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'BRL';
}
```

or

```js
{
  address: string;
  amount: number;
}
```

## 0.3.6

- Added 3DS Challenge Handling to the standalone Google Pay button

## 0.3.5

- Added cleanup code to handle arg changes in `CoinflowCvvOnlyInputComponent`

## 0.3.4

- Added `reinitialize` method to `CoinflowCvvOnlyInputComponent`, `CoinflowCardNumberInput`, and `CoinflowCardNumberOnlyInput`

## 0.3.3

- reinitialize iframe when ngOnInit is called after destroy

## 0.3.2

- Added `reinitialize` method to `CoinflowCvvOnlyInputComponent`, `CoinflowCardNumberInput`, and `CoinflowCardNumberOnlyInput`

## 0.3.1

- Added sessionKey authentication mechanism to `CoinflowWithdraw`

## 0.3.0

- Added sessionKey authentication mechanism to `CoinflowPurchase`

## 0.2.3

- Added Apple & Google Pay buttons

## 0.2.1

- Fixed Card Form Components export

## 0.2.0

- Added Card Form Components

## 0.1.4

- Added `getWalletFromEmail` function to `CoinflowUtils`

## 0.1.3

- Allow custom taker on reservoir transactions
