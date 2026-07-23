"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

const formEndpoint =
  process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT ||
  "https://formspree.io/f/mbdnkbde";

const inputClass =
  "mt-2.5 w-full rounded-lg border border-white/10 bg-white/[0.035] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-650 focus:border-brand/60 focus:bg-brand/[0.025] focus:ring-2 focus:ring-brand/10";

type SubmissionState = "idle" | "submitting" | "success" | "error";

export default function ProjectInquiryForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [projectType, setProjectType] = useState("");
  const [submissionState, setSubmissionState] =
    useState<SubmissionState>("idle");

  useEffect(() => {
    const requestedProject = new URLSearchParams(window.location.search).get(
      "project",
    );
    const supportedProjects = [
      "smart-qr",
      "3d-printing",
      "design",
      "supplied-file",
      "production",
      "other",
    ];

    if (requestedProject && supportedProjects.includes(requestedProject)) {
      setProjectType(requestedProject);
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmissionState("submitting");

    try {
      const response = await fetch(formEndpoint, {
        method: "POST",
        body: new FormData(event.currentTarget),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      formRef.current?.reset();
      setProjectType("");
      setSubmissionState("success");
    } catch {
      setSubmissionState("error");
    }
  }

  return (
    <form
      ref={formRef}
      className="grid gap-6"
      action={formEndpoint}
      method="post"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="_subject" value="New Voxel Vandal project inquiry" />
      <label className="hidden" aria-hidden="true">
        Leave this field empty
        <input name="_gotcha" tabIndex={-1} autoComplete="off" />
      </label>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="text-xs font-medium text-zinc-300">
          Name <span className="text-brand">*</span>
          <input
            className={inputClass}
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Your name"
            required
          />
        </label>
        <label className="text-xs font-medium text-zinc-300">
          Company
          <input
            className={inputClass}
            type="text"
            name="company"
            autoComplete="organization"
            placeholder="Business or team name"
          />
        </label>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="text-xs font-medium text-zinc-300">
          Email <span className="text-brand">*</span>
          <input
            className={inputClass}
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@company.com"
            required
          />
        </label>
        <label className="text-xs font-medium text-zinc-300">
          Phone
          <input
            className={inputClass}
            type="tel"
            name="phone"
            autoComplete="tel"
            placeholder="Optional"
          />
        </label>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="text-xs font-medium text-zinc-300">
          Project type <span className="text-brand">*</span>
          <select
            className={inputClass}
            name="projectType"
            required
            value={projectType}
            onChange={(event) => setProjectType(event.target.value)}
          >
            <option value="" disabled>
              Select a project type
            </option>
            <option value="smart-qr">Smart QR display</option>
            <option value="3d-printing">Custom 3D printing</option>
            <option value="design">Custom part design</option>
            <option value="supplied-file">Print a supplied file</option>
            <option value="production">Short-run production</option>
            <option value="other">Something else</option>
          </select>
        </label>
        <label className="text-xs font-medium text-zinc-300">
          Estimated quantity
          <input
            className={inputClass}
            type="text"
            name="quantity"
            inputMode="numeric"
            placeholder="1, 10, 100…"
          />
        </label>
      </div>

      <label className="text-xs font-medium text-zinc-300">
        What are you looking to make? <span className="text-brand">*</span>
        <textarea
          className={`${inputClass} min-h-40 resize-y`}
          name="details"
          placeholder="Describe the idea, intended use, approximate size, timeline, and anything else that matters."
          required
        />
      </label>

      <div className="rounded-lg border border-white/8 bg-black/20 p-4">
        <p className="text-xs leading-6 text-zinc-500">
          Have files or reference images? Mention them above. A secure upload or reply request can be provided during project review.
        </p>
      </div>

      <p className="text-xs leading-6 text-zinc-500">
        By submitting this form, you agree that Voxel Vandal may use the
        information provided to review and respond to your inquiry. See our{" "}
        <Link
          href="/privacy"
          className="text-brand transition hover:text-brand-bright"
        >
          Privacy Policy
        </Link>
        .
      </p>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          className="button-primary min-w-44 justify-center disabled:cursor-wait disabled:opacity-55 disabled:hover:translate-y-0"
          type="submit"
          disabled={submissionState === "submitting"}
        >
          {submissionState === "submitting" ? "Sending…" : "Send project details"}
          {submissionState !== "submitting" && <span aria-hidden="true">↗</span>}
        </button>
        <p className="max-w-xs text-xs leading-5 text-zinc-500">
          Submitting this form does not create an account or commit you to an order.
        </p>
      </div>

      <div aria-live="polite">
        {submissionState === "success" && (
          <p className="rounded-lg border border-brand/25 bg-brand/8 px-4 py-3 text-sm leading-6 text-brand">
            Project details sent. Thanks—we’ll review them and get back to you.
          </p>
        )}
        {submissionState === "error" && (
          <p className="rounded-lg border border-red-400/20 bg-red-400/7 px-4 py-3 text-sm leading-6 text-red-200">
            Something went wrong while sending your details. Please try again.
          </p>
        )}
      </div>
    </form>
  );
}
