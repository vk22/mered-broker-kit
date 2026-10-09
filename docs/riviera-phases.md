# Riviera phases

Routes:
- `/projects/riviera`: phase selection.
- `/projects/riviera/phase1`: existing Riviera materials (database slug `riviera`).
- `/projects/riviera/phase2`: independent materials (database slug `riviera-phase2`).

Before deploying this version against an existing database, run:

```sh
npm run db:migrate:riviera-phases
```

Run after the existing schema and project seed on a new database. The migration
adds the selection background field and copies the current Riviera materials
into Phase 2 once, leaving its material links empty. Re-running it preserves
all existing edits and does not duplicate materials. Phase 1 is unchanged.

In Admin → Projects:
- Select `Riviera — Phase 1 & phase selection` and upload `Phase selection background`,
  then click `Save project`. This background is independent of the homepage hero;
  until uploaded, the selector uses the existing Riviera hero.
- Select `RIVIERA RESIDENCES Phase 2` to upload each material image and set its
  `File/link URL`, then click `Save` on each material.
- Device mockups are part of the uploaded material image, as in Phase 1.

Images are initially copied from Phase 1 as placeholders. Both phase catalogues
use `components/ProjectCatalog.vue`; only ICONIC and Riviera appear on the homepage.
