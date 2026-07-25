/**
 * src/pages/admin/SettingsPage.jsx
 * ----------------------------------------------------------------------------
 * Route: /admin/settings. Tenant configuration — primarily the Jira
 * connection (JiraBaseUrl, JiraEncryptedToken, JiraWebhookSecret from the
 * Tenants table) that powers Flow 1 (Continuous Backlog Ingestion).
 *
 * Responsibilities:
 *   - On mount, useFetch(() => tenantApi.fetchTenantSettings(), []) to load
 *     current connection status (never the raw secret — see tenantApi.js note).
 *   - react-hook-form: jiraBaseUrl, jiraApiToken (write-only field, always
 *     rendered blank; submitting updates/rotates the stored encrypted token).
 *   - On submit, call tenantApi.updateTenantSettings(values) directly (a
 *     single settings object, not worth a Redux slice — no other page reads
 *     tenant settings).
 *   - Show connection status badge (Connected / Not Connected) based on
 *     `jiraConnected` from the fetch result.
 * ----------------------------------------------------------------------------
 */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as tenantApi from "../../api/tenantApi";
import { useToast } from "../../context/ToastContext";
import useFetch from "../../hooks/useFetch";
import Card from "../../components/common/Card/Card";
import Badge from "../../components/common/Badge/Badge";
import Input from "../../components/common/Input/Input";
import Button from "../../components/common/Button/Button";
import Loader from "../../components/common/Loader/Loader";

export default function SettingsPage() {
  const { data: settings, isLoading, refetch } = useFetch(
    () => tenantApi.fetchTenantSettings(),
    []
  );
  const { register, handleSubmit } = useForm();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      await tenantApi.updateTenantSettings(values);
      showToast({ type: "success", message: "Jira connection updated." });
      refetch();
    } catch (err) {
      showToast({ type: "error", message: err.message || "Could not update settings." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div>
      <h1>Settings</h1>
      <Card
        title="Jira Connection"
        actions={
          <Badge tone={settings?.jiraConnected ? "success" : "danger"}>
            {settings?.jiraConnected ? "Connected" : "Not Connected"}
          </Badge>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Jira Base URL"
            placeholder="https://your-company.atlassian.net"
            defaultValue={settings?.jiraBaseUrl}
            {...register("jiraBaseUrl")}
          />
          <Input
            label="Jira API Token"
            type="password"
            placeholder="Leave blank to keep the current token"
            {...register("jiraApiToken")}
          />
          <Button type="submit" isLoading={isSubmitting}>
            Save connection
          </Button>
        </form>
      </Card>
      {/* TODO: add an AdminUsers management panel + a Company profile panel
          here as separate <Card> sections, each with its own small form,
          if/when those become in-scope for this page. */}
    </div>
  );
}
