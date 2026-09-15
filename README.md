# Identity implementation
I have implemented everything you gave me with few changes, Below is the list of things ib implmented with details

1. Ran migration for user_profile table 
2. Synced supabase types
3. added lib/auth/types.ts but i have used supabase user_profile type instead of defining it ourselves to make it easier to work with envolving profile schema. i added the file details below.
4. lib/auth/currentUser.ts - implemented and modified it to use UserProfile types exported from lib/auth/types.ts
5. lib/auth/index.ts - implemented
6. lib/auth/profile.ts - implemented and modified it to use UserProfile types exported from lib/auth/types.ts
7. lib/auth/register.ts - implemented
8. proxy.ts - implemented uses utils/supabase/proxy.ts
9. utils/supabase/proxy.ts - i have placed this inside utils folder alongwith other supabase clients


```ts
// lib/auth/types.ts
import type { User } from '@supabase/supabase-js';
import type { Json, Database } from '@/types/supabase';


export type UserProfile = Database['public']['Tables']['user_profile']['Row'];


export interface CurrentUser {
  auth: User;
  profile: UserProfile | null;
}
```

I can share any file if u want to reference them. If this is fine then we can move to Auth UI (register and login) and commerce