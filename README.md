# Onboarding Flow Test

- Discovery: works (picked start with urge option)
- Register: 
    - component (Works) -> The password show/Hide is not aligned properly inside the input
    - Confirmation email received (Works)
    - confirmation link opens profile completion (Works)
- Profile completion
    - unable to update avatar: error (Unable to upload your profile photo.) Server log below
    - username check works but i think it would be better to show availability in green rather than brand colour
    - Currency does not get preselected after i select country
    - Mobile number should have country code and number separate. It will become messy if we had to use mobile for messaging if the number were not in standard format. Maybe we can use it from country codes
    - form submits and take me to http://localhost:3000/profile/complete/success?intent=join page
- Success Page: I dont think we need another success page we can display the message right after the form is submitted in the ProfileCompletion Form with button to complete payment. This page while made sense for testing is an unnecessary step.
    - continue button works, takes me to checkout
- Checkout
    - page loads, it preselects mothly but ideally we would want it to be quarterly ( thats how much time we expect users to spend on journey)
    - selected Quarterly
    - Applied discount ALPHATEST, works 
    - continue button takes me to app/program/welcome/page.tsx
- Welcome page : is ok
    - the linke to first mission was wrong instead of program/mission/<mission-number> it is program/mission/<mission-key> so correct link is /program/mission/mission-1
    - When welcome page loads i get an profile hydration error. I have added it below
- Mission page opens


## Avatar Upload Error
```bash 
-> Avatar upload failed: Error [StorageApiError]: new row violates row-level security policy
    at ignore-listed frames {
  __isStorageError: true,
  namespace: 'storage',
  status: 400,
  statusCode: '403',
  code: 'AccessDenied'
}
```

## Welcom page server logs
```bash
 GET /program/mission/mission-1 200 in 630ms (next.js: 575ms, proxy.ts: 16ms, application-code: 40ms)
[browser] Detected `scroll-behavior: smooth` on the `<html>` element. To disable smooth scrolling during route transitions, add `data-scroll-behavior="smooth"` to your <html> element. Learn more: https://nextjs.org/docs/messages/missing-data-scroll-behavior
[PROGRAM HYDRATION] Error: Failed to load user profile: invalid input syntax for type uuid: "undefined"
    at getUserProfile (lib/program/data/userProfile.ts:99:15)
    at async (lib/program/hydration/server.ts:101:13)
    at async getProgramHydration (lib/program/hydration/server.ts:87:5)
    at async hydrateProgramDomains (actions/programHydration.ts:38:7)
   97 |
   98 |     if (error) {
>  99 |         throw new Error(
      |               ^
  100 |             `Failed to load user profile: ${error.messa...
  101 |         );
  102 |     }
 POST /program/mission/mission-1 200 in 1558ms (next.js: 32ms, proxy.ts: 13ms, application-code: 1513ms)
  └─ ƒ hydrateProgramDomains({"domains":["profile","opportunities","contacts","... 1 item not stringified"],"missionKey":"mission-1"}) in 1481ms actions/programHydration.ts

```

## Database rows
### user_profile
```json
[{"idx":0,"id":"9c9a0d5c-43ef-4d53-b20e-eae7e75d189f","user_id":"5c6d8d8c-c0be-4d49-b3e3-1247386f9a5d","motivations":"[]","fears":"[]","perceived_barriers":"[]","desired_future":"{}","quit_conditions":"[]","capabilities":"[]","experience":"[]","resources":"[]","network_context":"{}","constraints":"[]","metadata":"{}","created_at":"2026-09-18 02:48:55.273422+00","updated_at":"2026-09-18 02:57:20.41898+00","username":"amit","age_group":"35-44","gender":"male","city":"Bengaluru","country":"IN","username_key":"amit","mobile_number":"8861437763","currency":"INR","avatar_url":null}]
```

### orders
```json
[{"idx":0,"id":"c2efbd2f-0583-4a08-a3fd-0b51477725cc","user_id":"5c6d8d8c-c0be-4d49-b3e3-1247386f9a5d","status":"paid","currency":"INR","subtotal":"5000.00","discount":"5000.00","tax":"0.00","total":"0.00","metadata":"{\"discount_id\": \"652818c6-cb24-42fa-b8d7-b7dceb917df3\", \"offering_id\": \"e802646a-590e-442b-bf00-ba3755b946b8\", \"offering_slug\": \"urge-membership\", \"offering_price_id\": \"db22a073-a669-49fa-9c25-8bbae8537fbc\"}","created_at":"2026-09-18 03:02:29.578338+00","updated_at":"2026-09-18 03:02:29.578338+00"}]

```

### order_items

```json
[{"idx":0,"id":"5fcd9f82-9689-45e0-91d9-461c3aa015c4","order_id":"c2efbd2f-0583-4a08-a3fd-0b51477725cc","offering_id":"e802646a-590e-442b-bf00-ba3755b946b8","offering_price_id":"db22a073-a669-49fa-9c25-8bbae8537fbc","name":"Quarterly","quantity":1,"unit_price":"5000.00","discount":"5000.00","total_price":"0.00","metadata":"{\"offering_name\": \"Urge Membership\"}","created_at":"2026-09-18 03:02:29.578338+00"}]

```

### transactions

```json
[{"idx":0,"id":"c8ca0556-67e1-426d-bd4c-e6e1dad32d00","order_id":"c2efbd2f-0583-4a08-a3fd-0b51477725cc","user_id":"5c6d8d8c-c0be-4d49-b3e3-1247386f9a5d","type":"payment","provider":"dummy","provider_transaction_id":"dummy_c2efbd2f-0583-4a08-a3fd-0b51477725cc","amount":"0.00","currency":"INR","status":"paid","metadata":"{\"test\": true, \"discount_id\": \"652818c6-cb24-42fa-b8d7-b7dceb917df3\"}","created_at":"2026-09-18 03:02:29.578338+00","updated_at":"2026-09-18 03:02:29.578338+00"}]
```
### subscriptions

```json
[{"idx":0,"id":"26037f54-fbbf-454a-bdd2-a188cd93f4e5","user_id":"5c6d8d8c-c0be-4d49-b3e3-1247386f9a5d","offering_price_id":"db22a073-a669-49fa-9c25-8bbae8537fbc","provider":"dummy","provider_subscription_id":"dummy_sub_c2efbd2f-0583-4a08-a3fd-0b51477725cc","status":"active","current_period_start":"2026-09-18 03:02:29.578338+00","current_period_end":"2026-12-18 03:02:29.578338+00","cancel_at_period_end":false,"metadata":"{\"test\": true, \"order_id\": \"c2efbd2f-0583-4a08-a3fd-0b51477725cc\", \"transaction_id\": \"c8ca0556-67e1-426d-bd4c-e6e1dad32d00\"}","created_at":"2026-09-18 03:02:29.578338+00","updated_at":"2026-09-18 03:02:29.578338+00"}]

```

### entitlements

```json
[{"idx":0,"id":"bea81e2b-c648-4690-a32b-f2d501bf8c75","user_id":"5c6d8d8c-c0be-4d49-b3e3-1247386f9a5d","type":"membership","scope":"urge-membership","status":"active","source_type":"subscription","source_id":"26037f54-fbbf-454a-bdd2-a188cd93f4e5","starts_at":"2026-09-18 03:02:29.578338+00","expires_at":"2026-12-18 03:02:29.578338+00","metadata":"{\"order_id\": \"c2efbd2f-0583-4a08-a3fd-0b51477725cc\", \"offering_id\": \"e802646a-590e-442b-bf00-ba3755b946b8\", \"offering_price_id\": \"db22a073-a669-49fa-9c25-8bbae8537fbc\"}","created_at":"2026-09-18 03:02:29.578338+00","updated_at":"2026-09-18 03:02:29.578338+00"}]

```

note: why is metadata in table formatted weird?
