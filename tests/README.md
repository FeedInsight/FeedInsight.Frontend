# Tests

Mirror the `src/` structure here (or use co-located `*.test.jsx` files next
to components — pick one convention and apply it consistently across the
project to avoid confusion). Suggested priorities:

1. `src/utils/` — pure functions, easiest and highest-value to unit test.
2. `src/store/slices/` — reducer logic with mocked API responses.
3. `src/components/common/` — presentational components (render + snapshot
   or interaction tests).
4. Feature components (`customerPortal/`, `adminPortal/`) — integration
   tests mocking `src/api/*`.

No test files are included in this scaffold to avoid prescribing a test
runner config beyond what Create React App (`react-scripts test`, Jest +
React Testing Library) already provides out of the box.
