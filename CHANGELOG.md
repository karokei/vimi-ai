# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2026-03-07

### Fixed
- Resolve Unit Test failures across `image-generation`, `episode-split`, and `character-profile` modules.
- Synchronize `AIOrchestrator` logic with test expectations (progress tracking, content length validation).
- Correct global mocks in `setup.ts` to support complex Supabase query chaining.
- Update `vitest.config.ts` to exclude E2E Playwright specs from Vitest runs.
