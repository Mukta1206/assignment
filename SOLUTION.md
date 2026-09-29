# Solution

## Task A — Root cause analysis

### Failing test 1: `search filters the task list by title` (`tests/e2e/search.spec.ts`)

- **Root cause:** `TaskManagerPage.search()` typed into `data-testid="task-search-input"`. The search box in the app is `data-testid="search-input"`. Playwright never typed into the real field, so the list did not filter and "Buy groceries" stayed visible. This was a page-object locator bug, not a product bug.
- **Fix applied:** Pointed `search()` at `this.searchInput`.

### Failing test 2: `marking a task as Done updates its status badge` (`tests/e2e/task-status.spec.ts`)

- **Root cause:** After setting status to Done, the test expected the badge text `Completed`. The app stores and renders status as `Done`.
- **Fix applied:** Asserted `Done` so the check matches the real UI label.

## Task B — New test

- **Scenario covered:** Creating a task with an empty title shows "Title is required" and the form stays open (`does not create a task when the title is empty` in `tests/e2e/task-management.spec.ts`).
- **Why this scenario matters / why it was missing:** Create, edit, and delete were only covered with valid data. Title is required in the form and had no UI test.

## Task C — API validation

- **What the new API test verifies:** `POST /tasks` returns status 201, the body includes an `id`, and `title`, `description`, and `status` match what was submitted.

## Task D — Bug / usability / improvement report

- **What I observed:** Clicking Delete removes the task immediately. There is no confirmation dialog.
- **Steps to reproduce:**
  1. Open the Task Manager.
  2. Click Delete on any task (for example "Write report").
  3. The row disappears at once. There is no "Are you sure?" and no undo.
- **Why it matters:** Delete is destructive. A misclick cannot be undone.
- **Suggested fix:** Show a confirmation dialog before calling the API, or offer an undo toast.

I also noticed description is optional: a task with only a title still saves. If description should be required, validate it like title; if not, label the field as optional.

## Anything else you'd like us to know

- Task A fixes were in the tests. I did not change product status values to make an assertion pass.
- `npm test` passes locally (11 tests).

**Further improvement:** 
1] A task does not show who owns it or who marked it Done. For a real team tool I would add an assignee and a completed-by (and completed-at) field so status changes are auditable. I did not add that here because it is new product scope, not a broken path in the current app.

2] A later enhancement could add an approval step after Done. That is new behaviour, not a defect in the current three statuses.