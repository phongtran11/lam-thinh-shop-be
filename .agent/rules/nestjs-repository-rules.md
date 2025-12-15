---
trigger: always_on
---

- Don't use save method of repository.
- Priorytize use createQueryBuilder method instead of repository api.
- Each repository just work with that entity. Not use other entity in repository.
- With multiple insert or update in one api. Need to use transaction extends from transaction.provider.ts and implement like refresh-token.repository.ts
- Each repository method just have single responsibility.
- Repository methods just receive params is primative value or entity.