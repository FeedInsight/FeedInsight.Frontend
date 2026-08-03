import { ROLES } from '@app/config/constants.js'

export const REQUIRE_SUPER_ADMIN = [ROLES.SUPER_ADMIN]
export const REQUIRE_PRODUCT_OWNER = [ROLES.PRODUCT_OWNER, ROLES.VIEWER]
