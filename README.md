# Program Implementation Structure

## 1. Program Model
```
mission1.ts
      ↓
ProgramMission
      ↓
ProgramNode

```

## 2. Component System
```
componentRegistry
      ↓
node.component
      ↓
React component
```

## 3. Context System
```
node.context[]
      ↓
Context Manager
      ↓
Component receives exactly
the context it requested
```

## 4. Progress system
```
node.key
      ↓
user_progress
      ↓
started / active / completed
      ↓
payload + ai_data
```

## 5. Domain data
```
component
    ↓
user_profile
user_opportunities
user_contacts
user_observations
user_tasks
```


## 6. Navigation
```
Mission page
    ↓
Quest page
    ↓
Node experience
```

**That gives us a clean dependency direction:**
```

                 ┌──────────────┐
                 │ mission1.ts  │
                 └──────┬───────┘
                        ↓
                 ┌──────────────┐
                 │ ProgramNode  │
                 └──────┬───────┘
                        ↓
              ┌───────────────────┐
              │ Component Registry│
              └─────────┬─────────┘
                        ↓
                 ┌──────────────┐
                 │   Component  │
                 └──────┬───────┘
                        ↓
          ┌─────────────┼─────────────┐
          ↓             ↓             ↓
      Context       Progress       Domain
      Manager        Service         Data

```
