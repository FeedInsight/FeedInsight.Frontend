/**
 * src/context/TenantContext.jsx
 * ----------------------------------------------------------------------------
 * Resolves and holds the ACTIVE tenant for the current browser session.
 * Used by BOTH portals, but resolved differently:
 *   - Admin Portal: tenantId comes from the logged-in user (AuthContext sets
 *     it via setTenantId on login) — this context just re-reads it.
 *   - Customer Portal: tenantId must be resolved BEFORE the feedback form is
 *     usable, from either:
 *       a) the subdomain (e.g. acme.feedinsight.app -> "acme"), or
 *       b) a ?key=... query param mapping to Tenant.PublicKey,
 *     via tenantApi.resolveTenantByKey(). See README: "Identifies target
 *     context via custom header routing (X-Tenant-Id) mapped from
 *     company-specific public keys or subdomains."
 *
 * Provides via useTenant():
 *   - tenant: { id, companyName } | null
 *   - isResolving: boolean
 *   - resolveError: string | null
 * ----------------------------------------------------------------------------
 */
import React, { createContext, useContext, useEffect, useState } from "react";
import * as tenantApi from "../api/tenantApi";
import { setTenantId, getTenantId } from "../utils/storage";
import config from "../config";

const TenantContext = createContext(undefined);

export function TenantProvider({ children }) {
  const [tenant, setTenant] = useState(null);
  const [isResolving, setIsResolving] = useState(true);
  const [resolveError, setResolveError] = useState(null);

  useEffect(() => {
    async function resolve() {
      try {
        // If an admin session already stored a tenantId, trust it and skip
        // public-key resolution (Admin Portal path).
        const existingTenantId = getTenantId();
        if (existingTenantId) {
          setTenant({ id: existingTenantId, companyName: null });
          setIsResolving(false);
          return;
        }

        // Otherwise this is the public Customer Portal path.
        // TODO: derive publicKey from subdomain or ?key= query param instead
        // of always falling back to config.defaultTenantPublicKey.
        const publicKey = config.defaultTenantPublicKey;
        if (publicKey) {
          const resolved = await tenantApi.resolveTenantByKey(publicKey);
          setTenantId(resolved.tenantId);
          setTenant({ id: resolved.tenantId, companyName: resolved.companyName });
        }
      } catch (err) {
        setResolveError(err.message || "Unable to resolve tenant");
      } finally {
        setIsResolving(false);
      }
    }
    resolve();
  }, []);

  return (
    <TenantContext.Provider value={{ tenant, isResolving, resolveError }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const ctx = useContext(TenantContext);
  if (ctx === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return ctx;
}
