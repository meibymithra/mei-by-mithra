"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type HeroContent = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
};

type PageContent = {
  eyebrow: string;
  title: string;
  description: string;
  highlights?: string[];
  narrative?: string;
  services?: { title: string; description: string }[];
  process?: string[];
  note?: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

export function ContentEditor({
  contentKey,
  title,
  initialTitle,
  initialContent
}: {
  contentKey: string;
  title: string;
  initialTitle: string;
  initialContent: string;
}) {
  const [recordTitle, setRecordTitle] = useState(initialTitle);
  const [message, setMessage] = useState<string | null>(null);

  const saveContent = async (content: string) => {
    const response = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: contentKey, title: recordTitle, content })
    });
    const data = await response.json();
    setMessage(response.ok ? "Saved" : data.error ?? "Failed");
  };

  if (contentKey === "homeHero") {
    const [hero, setHero] = useState<HeroContent>(() => JSON.parse(initialContent));

    return (
      <EditorFrame title={title} message={message}>
        <RecordTitle value={recordTitle} onChange={setRecordTitle} />
        <Field label="Eyebrow">
          <Input value={hero.eyebrow} onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })} />
        </Field>
        <Field label="Title">
          <Textarea value={hero.title} onChange={(e) => setHero({ ...hero, title: e.target.value })} className="min-h-28" />
        </Field>
        <Field label="Description">
          <Textarea value={hero.description} onChange={(e) => setHero({ ...hero, description: e.target.value })} />
        </Field>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Primary CTA label">
            <Input value={hero.primaryCtaLabel} onChange={(e) => setHero({ ...hero, primaryCtaLabel: e.target.value })} />
          </Field>
          <Field label="Primary CTA href">
            <Input value={hero.primaryCtaHref} onChange={(e) => setHero({ ...hero, primaryCtaHref: e.target.value })} />
          </Field>
          <Field label="Secondary CTA label">
            <Input value={hero.secondaryCtaLabel} onChange={(e) => setHero({ ...hero, secondaryCtaLabel: e.target.value })} />
          </Field>
          <Field label="Secondary CTA href">
            <Input value={hero.secondaryCtaHref} onChange={(e) => setHero({ ...hero, secondaryCtaHref: e.target.value })} />
          </Field>
        </div>
        <Button onClick={() => saveContent(JSON.stringify(hero, null, 2))}>Save content</Button>
      </EditorFrame>
    );
  }

  if (contentKey === "aboutPage" || contentKey === "practicePage" || contentKey === "store") {
    const [page, setPage] = useState<PageContent>(() => JSON.parse(initialContent));

    return (
      <EditorFrame title={title} message={message}>
        <RecordTitle value={recordTitle} onChange={setRecordTitle} />
        <Field label="Eyebrow">
          <Input value={page.eyebrow ?? ""} onChange={(e) => setPage({ ...page, eyebrow: e.target.value })} />
        </Field>
        <Field label="Title">
          <Input value={page.title ?? ""} onChange={(e) => setPage({ ...page, title: e.target.value })} />
        </Field>
        <Field label="Description">
          <Textarea value={page.description ?? ""} onChange={(e) => setPage({ ...page, description: e.target.value })} />
        </Field>
        {contentKey === "aboutPage" ? (
          <>
            <Field label="Highlights (one per line)">
              <Textarea
                value={(page.highlights ?? []).join("\n")}
                onChange={(e) =>
                  setPage({
                    ...page,
                    highlights: e.target.value.split("\n").map((item) => item.trim()).filter(Boolean)
                  })
                }
              />
            </Field>
            <Field label="Narrative">
              <Textarea value={page.narrative ?? ""} onChange={(e) => setPage({ ...page, narrative: e.target.value })} />
            </Field>
          </>
        ) : null}
        {contentKey === "practicePage" ? (
          <>
            <Field label="Services JSON">
              <Textarea
                className="min-h-40 font-mono text-xs"
                value={JSON.stringify(page.services ?? [], null, 2)}
                onChange={(e) => {
                  try {
                    setPage({ ...page, services: JSON.parse(e.target.value) });
                  } catch {}
                }}
              />
            </Field>
            <Field label="Process items (one per line)">
              <Textarea
                value={(page.process ?? []).join("\n")}
                onChange={(e) =>
                  setPage({
                    ...page,
                    process: e.target.value.split("\n").map((item) => item.trim()).filter(Boolean)
                  })
                }
              />
            </Field>
          </>
        ) : null}
        {contentKey === "store" ? (
          <Field label="Store note">
            <Textarea value={page.note ?? ""} onChange={(e) => setPage({ ...page, note: e.target.value })} />
          </Field>
        ) : null}
        <Button onClick={() => saveContent(JSON.stringify(page, null, 2))}>Save content</Button>
      </EditorFrame>
    );
  }

  if (contentKey === "faqs") {
    const [faqs, setFaqs] = useState<FaqItem[]>(() => JSON.parse(initialContent));

    return (
      <EditorFrame title={title} message={message}>
        <RecordTitle value={recordTitle} onChange={setRecordTitle} />
        {faqs.map((faq, index) => (
          <div key={index} className="space-y-2 rounded-2xl border border-border p-3">
            <Input
              placeholder="Question"
              value={faq.question}
              onChange={(e) => {
                const next = [...faqs];
                next[index].question = e.target.value;
                setFaqs(next);
              }}
            />
            <Textarea
              placeholder="Answer"
              value={faq.answer}
              onChange={(e) => {
                const next = [...faqs];
                next[index].answer = e.target.value;
                setFaqs(next);
              }}
            />
            <Button variant="destructive" onClick={() => setFaqs(faqs.filter((_, i) => i !== index))}>
              Remove
            </Button>
          </div>
        ))}
        <div className="flex gap-3">
          <Button onClick={() => setFaqs([...faqs, { question: "", answer: "" }])}>Add FAQ</Button>
          <Button onClick={() => saveContent(JSON.stringify(faqs, null, 2))}>Save content</Button>
        </div>
      </EditorFrame>
    );
  }

  const [content, setContent] = useState(initialContent);

  return (
    <EditorFrame title={title} message={message}>
      <RecordTitle value={recordTitle} onChange={setRecordTitle} />
      <Textarea value={content} onChange={(e) => setContent(e.target.value)} className="min-h-40" />
      <Button onClick={() => saveContent(content)}>Save content</Button>
    </EditorFrame>
  );
}

function EditorFrame({
  title,
  message,
  children
}: {
  title: string;
  message: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3 rounded-3xl border border-border bg-background p-4">
      <p className="font-medium">{title}</p>
      {children}
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}

function RecordTitle({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <Field label="Record title">
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
