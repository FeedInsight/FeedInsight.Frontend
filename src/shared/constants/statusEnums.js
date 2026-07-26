/**
 * Re-exports of the enums in app/config/constants.js scoped for UI display
 * purposes (labels + Tailwind color classes) so components don't have to
 * build their own switch/case every time they render a status pill.
 *
 * Keep the KEYS in exact sync with app/config/constants.js -- this file
 * only adds presentation metadata on top.
 */
import { STORY_STATUS } from '@app/config/constants.js'

export const STORY_STATUS_META = {
  [STORY_STATUS.DRAFT]: { label: 'Draft', badgeClass: 'bg-status-draft/10 text-status-draft' },
  [STORY_STATUS.APPROVED]: {
    label: 'Approved',
    badgeClass: 'bg-status-approved/10 text-status-approved',
  },
  [STORY_STATUS.REJECTED]: {
    label: 'Rejected',
    badgeClass: 'bg-status-rejected/10 text-status-rejected',
  },
  [STORY_STATUS.PUBLISHED]: {
    label: 'Published to Jira',
    badgeClass: 'bg-status-published/10 text-status-published',
  },
}
