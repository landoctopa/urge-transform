It is still stuck.
## Browser console
```
forward-logs-shared.ts:120 [HMR] connected
ProgramQuestShell.tsx:178 [PROGRAM TRANSITION] {currentNode: 'm1-q1-complication', completed: Array(2), destination: {…}}completed: (2) ['m1-situation', 'm1-q1-complication']currentNode: "m1-q1-complication"destination: {type: 'quest', missionId: 'mission-1', questId: 'm1-q1', nodeKey: 'm1-q1-motivation'}[[Prototype]]: Object
ProgramQuestShell.tsx:178 [PROGRAM TRANSITION] {currentNode: 'm1-q1-complication', completed: Array(2), destination: {…}}completed: (2) ['m1-situation', 'm1-q1-complication']currentNode: "m1-q1-complication"destination: {type: 'quest', missionId: 'mission-1', questId: 'm1-q1', nodeKey: 'm1-q1-motivation'}[[Prototype]]: Object
ProgramQuestShell.tsx:178 [PROGRAM TRANSITION] {currentNode: 'm1-q1-complication', completed: Array(2), destination: {…}}completed: (2) ['m1-situation', 'm1-q1-complication']currentNode: "m1-q1-complication"destination: {type: 'quest', missionId: 'mission-1', questId: 'm1-q1', nodeKey: 'm1-q1-motivation'}[[Prototype]]: Object
ProgramQuestShell.tsx:178 [PROGRAM TRANSITION] {currentNode: 'm1-q1-complication', completed: Array(2), destination: {…}}completed: (2) ['m1-situation', 'm1-q1-complication']currentNode: "m1-q1-complication"destination: {type: 'quest', missionId: 'mission-1', questId: 'm1-q1', nodeKey: 'm1-q1-motivation'}[[Prototype]]: Object
ProgramQuestShell.tsx:178 [PROGRAM TRANSITION] {currentNode: 'm1-q1-complication', completed: Array(2), destination: {…}}
ProgramQuestShell.tsx:178 [PROGRAM TRANSITION] {currentNode: 'm1-q1-complication', completed: Array(2), destination: {…}}completed: (2) ['m1-situation', 'm1-q1-complication']currentNode: "m1-q1-complication"destination: {type: 'quest', missionId: 'mission-1', questId: 'm1-q1', nodeKey: 'm1-q1-motivation'}[[Prototype]]: Objectconstructor: ƒ Object()hasOwnProperty: ƒ hasOwnProperty()isPrototypeOf: ƒ isPrototypeOf()propertyIsEnumerable: ƒ propertyIsEnumerable()toLocaleString: ƒ toLocaleString()toString: ƒ toString()valueOf: ƒ valueOf()__defineGetter__: ƒ __defineGetter__()__defineSetter__: ƒ __defineSetter__()__lookupGetter__: ƒ __lookupGetter__()__lookupSetter__: ƒ __lookupSetter__()__proto__: (...)get __proto__: ƒ __proto__()set __proto__: ƒ __proto__()

```

## Server Console
 GET /program/mission/mission-1/quest/m1-q1?node=m1-q1-complication 200 in 74ms (next.js: 28ms, application-code: 46ms)
 GET /program/mission/mission-1/quest/m1-q1?node=m1-q1-motivation 200 in 48ms (next.js: 20ms, application-code: 27ms)
 GET /program/mission/mission-1/quest/m1-q1?node=m1-q1-motivation 200 in 44ms (next.js: 18ms, application-code: 25ms)
 GET /program/mission/mission-1/quest/m1-q1?node=m1-q1-motivation 200 in 46ms (next.js: 20ms, application-code: 27ms)
 GET /program/mission/mission-1/quest/m1-q1?node=m1-q1-motivation 200 in 52ms (next.js: 21ms, application-code: 31ms)
 GET /program/mission/mission-1/quest/m1-q1?node=m1-q1-motivation 200 in 49ms (next.js: 20ms, application-code: 29ms)
 GET /program/mission/mission-1/quest/m1-q1?node=m1-q1-motivation 200 in 50ms (next.js: 20ms, application-code: 30ms)


There should be a simpler solution to this.