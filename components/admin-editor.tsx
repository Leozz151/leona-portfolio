"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import {
  defaultContent,
  mergeContent,
  PortfolioContent,
  ProjectItem,
  sectionLabels,
  TextItem,
  TimelineItem,
} from "@/lib/portfolio-content";

type SheetId =
  | "sheet-basic"
  | "sheet-navhero"
  | "sheet-about"
  | "sheet-journey"
  | "sheet-projects"
  | "sheet-skills"
  | "sheet-contact";

const sheets: { id: SheetId; label: string }[] = [
  { id: "sheet-basic", label: "基本資料" },
  { id: "sheet-navhero", label: "導覽與首頁" },
  { id: "sheet-about", label: "專業特質" },
  { id: "sheet-journey", label: "成長曲線" },
  { id: "sheet-projects", label: "深度專案" },
  { id: "sheet-skills", label: "技能與生活" },
  { id: "sheet-contact", label: "聯絡資訊" },
];

function toLines(items: string[]) {
  return items.join("\n");
}

function fromLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function Panel({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="rounded-[1.6rem] border border-slate-200/70 bg-white/90 p-6 shadow-panel">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-ink">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function InputField({
  label,
  value,
  onChange,
  textarea,
  rows = 4,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
  rows?: number;
  type?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm text-ink">{label}</span>
      {textarea ? (
        <textarea
          rows={rows}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-[#fffdfa] px-4 py-3 text-ink outline-none transition focus:border-blue-deep/30"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-[#fffdfa] px-4 py-3 text-ink outline-none transition focus:border-blue-deep/30"
        />
      )}
    </label>
  );
}

export function AdminEditor({ initialContent }: { initialContent: PortfolioContent }) {
  const [content, setContent] = useState<PortfolioContent>(initialContent);
  const [savedContent, setSavedContent] = useState<PortfolioContent>(initialContent);
  const [activeSheet, setActiveSheet] = useState<SheetId>("sheet-basic");
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    setContent(initialContent);
    setSavedContent(initialContent);
    setIsDirty(false);
    setSaveMessage(null);
  }, [initialContent]);

  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) {
        return;
      }
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [isDirty]);

  const saveStateLabel = saveMessage ?? (isDirty ? "有尚未儲存的變更" : "目前內容與 data.json 同步");

  const updateContent = (recipe: (draft: PortfolioContent) => PortfolioContent) => {
    setContent((current) => recipe(structuredClone(current)));
    setIsDirty(true);
    setSaveMessage(null);
  };

  const saveAll = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const response = await fetch("/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(content),
      });

      const result = (await response.json()) as { ok: boolean; data?: PortfolioContent; message?: string };
      if (!response.ok || !result.ok || !result.data) {
        throw new Error(result.message ?? "儲存失敗");
      }

      const nextSaved = mergeContent(defaultContent, result.data);
      setContent(nextSaved);
      setSavedContent(nextSaved);
      setIsDirty(false);
      setSaveMessage("已寫入 data/data.json");
    } catch (error) {
      setSaveMessage(error instanceof Error ? error.message : "儲存失敗");
    } finally {
      setIsSaving(false);
    }
  };

  const resetAll = () => {
    setContent(savedContent);
    setIsDirty(false);
    setSaveMessage("已還原為 data.json 目前內容");
  };

  const orderedSectionEntries = useMemo(
    () => content.sectionOrder.map((id) => ({ id, label: sectionLabels[id] ?? id })),
    [content.sectionOrder]
  );

  const moveSection = (index: number, direction: -1 | 1) => {
    updateContent((draft) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= draft.sectionOrder.length) {
        return draft;
      }
      const copy = [...draft.sectionOrder];
      [copy[index], copy[nextIndex]] = [copy[nextIndex], copy[index]];
      draft.sectionOrder = copy;
      return draft;
    });
  };

  const renderTextItemEditor = (items: TextItem[], key: "about", addLabel: string, addItem: TextItem) => (
    <div className="grid gap-4">
      {items.map((item, index) => (
        <article key={`${item.title}-${index}`} className="rounded-[1.2rem] border border-slate-200 bg-[#fffdf9] p-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-coral">項目 {index + 1}</span>
            <button
              type="button"
              onClick={() =>
                updateContent((draft) => {
                  draft[key].items.splice(index, 1);
                  return draft;
                })
              }
              className="rounded-full bg-rose-50 px-3 py-2 text-sm text-rose-700"
            >
              刪除
            </button>
          </div>
          <div className="grid gap-4">
            <InputField
              label="標題"
              value={item.title}
              onChange={(value) =>
                updateContent((draft) => {
                  draft[key].items[index].title = value;
                  return draft;
                })
              }
            />
            <InputField
              label="內容"
              value={item.text}
              textarea
              rows={4}
              onChange={(value) =>
                updateContent((draft) => {
                  draft[key].items[index].text = value;
                  return draft;
                })
              }
            />
          </div>
        </article>
      ))}
      <button
        type="button"
        onClick={() =>
          updateContent((draft) => {
            draft[key].items.push(addItem);
            return draft;
          })
        }
        className="rounded-full bg-coral/10 px-4 py-3 text-sm font-medium text-coral"
      >
        {addLabel}
      </button>
    </div>
  );

  return (
    <div className="mx-auto grid w-[min(1400px,calc(100%-24px))] gap-5 py-3 xl:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="grid gap-6 self-start rounded-[1.7rem] border border-slate-200/70 bg-white/90 p-6 shadow-panel xl:sticky xl:top-3">
        <a href="/" className="text-sm uppercase tracking-[0.2em] text-ink">
          PM / Portfolio
        </a>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-coral">Portfolio CMS</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-ink">工作表後台</h1>
          <p className="mt-3 leading-8 text-muted">像整理多張工作表一樣切換編輯區，讀起來更清楚，改起來也更快。</p>
        </div>
        <div className="grid gap-3">
          <button
            onClick={saveAll}
            disabled={isSaving}
            type="button"
            className="rounded-full bg-gradient-to-r from-blue-deep to-blue-glow px-5 py-3 text-sm font-medium text-white disabled:opacity-70"
          >
            {isSaving ? "儲存中..." : "儲存變更"}
          </button>
          <button onClick={resetAll} type="button" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-ink">
            重新載入檔案
          </button>
          <a href="/" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-center text-sm font-medium text-ink">
            預覽前台
          </a>
        </div>

        <Panel title="工作表">
          <div className="grid gap-2">
            {sheets.map((sheet) => (
              <button
                key={sheet.id}
                type="button"
                onClick={() => setActiveSheet(sheet.id)}
                className={clsx(
                  "rounded-2xl border px-4 py-3 text-left text-sm transition",
                  activeSheet === sheet.id
                    ? "border-blue-deep/20 bg-[linear-gradient(135deg,rgba(31,120,255,0.1),rgba(255,123,104,0.1))] text-ink"
                    : "border-slate-200 bg-[#fffdfa] text-ink hover:-translate-y-0.5 hover:border-blue-deep/20"
                )}
              >
                {sheet.label}
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="首頁區塊排序">
          <div className="grid gap-3">
            {orderedSectionEntries.map((entry, index) => (
              <div key={entry.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-[#fffdfa] px-4 py-3">
                <strong className="text-sm text-ink">{entry.label}</strong>
                <div className="flex gap-2">
                  <button type="button" onClick={() => moveSection(index, -1)} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-ink">
                    上移
                  </button>
                  <button type="button" onClick={() => moveSection(index, 1)} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-ink">
                    下移
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <p className={clsx("text-sm", isDirty ? "text-coral" : "text-muted")}>{saveStateLabel}</p>
      </aside>

      <main className="space-y-5">
        {activeSheet === "sheet-basic" ? (
          <Panel title="網站基本資訊">
            <div className="grid gap-4 md:grid-cols-2">
              <InputField label="網站標題" value={content.siteTitle} onChange={(value) => updateContent((draft) => ((draft.siteTitle = value), draft))} />
              <InputField label="Meta 描述" value={content.metaDescription} onChange={(value) => updateContent((draft) => ((draft.metaDescription = value), draft))} />
            </div>
          </Panel>
        ) : null}

        {activeSheet === "sheet-navhero" ? (
          <div className="space-y-5">
            <Panel title="導覽列文字">
              <div className="grid gap-4 md:grid-cols-2">
                <InputField label="專案" value={content.nav.projects} onChange={(value) => updateContent((draft) => ((draft.nav.projects = value), draft))} />
                <InputField label="特質" value={content.nav.strengths} onChange={(value) => updateContent((draft) => ((draft.nav.strengths = value), draft))} />
                <InputField label="歷程" value={content.nav.journey} onChange={(value) => updateContent((draft) => ((draft.nav.journey = value), draft))} />
                <InputField label="技能" value={content.nav.skills} onChange={(value) => updateContent((draft) => ((draft.nav.skills = value), draft))} />
                <InputField label="聯絡" value={content.nav.contact} onChange={(value) => updateContent((draft) => ((draft.nav.contact = value), draft))} />
                <InputField label="後台按鈕" value={content.nav.admin} onChange={(value) => updateContent((draft) => ((draft.nav.admin = value), draft))} />
              </div>
            </Panel>
            <Panel title="首頁 Hero">
              <div className="grid gap-4 md:grid-cols-2">
                <InputField label="上方標籤" value={content.hero.eyebrow} onChange={(value) => updateContent((draft) => ((draft.hero.eyebrow = value), draft))} />
                <InputField label="英文名" value={content.hero.englishName} onChange={(value) => updateContent((draft) => ((draft.hero.englishName = value), draft))} />
                <div className="md:col-span-2">
                  <InputField label="主標語" value={content.hero.title} textarea rows={3} onChange={(value) => updateContent((draft) => ((draft.hero.title = value), draft))} />
                </div>
                <div className="md:col-span-2">
                  <InputField label="補充介紹" value={content.hero.intro} textarea rows={4} onChange={(value) => updateContent((draft) => ((draft.hero.intro = value), draft))} />
                </div>
                <InputField label="主按鈕文字" value={content.hero.primaryLabel} onChange={(value) => updateContent((draft) => ((draft.hero.primaryLabel = value), draft))} />
                <InputField label="主按鈕連結" value={content.hero.primaryHref} onChange={(value) => updateContent((draft) => ((draft.hero.primaryHref = value), draft))} />
                <InputField label="次按鈕文字" value={content.hero.secondaryLabel} onChange={(value) => updateContent((draft) => ((draft.hero.secondaryLabel = value), draft))} />
                <InputField label="次按鈕連結" value={content.hero.secondaryHref} onChange={(value) => updateContent((draft) => ((draft.hero.secondaryHref = value), draft))} />
                <InputField label="半身照網址" type="url" value={content.hero.portraitUrl} onChange={(value) => updateContent((draft) => ((draft.hero.portraitUrl = value), draft))} />
                <InputField label="照片替代文字" value={content.hero.portraitAlt} onChange={(value) => updateContent((draft) => ((draft.hero.portraitAlt = value), draft))} />
                <div className="md:col-span-2">
                  <InputField label="首頁重點條列" value={toLines(content.hero.quickFacts)} textarea rows={4} onChange={(value) => updateContent((draft) => ((draft.hero.quickFacts = fromLines(value)), draft))} />
                </div>
              </div>
            </Panel>
          </div>
        ) : null}

        {activeSheet === "sheet-about" ? (
          <div className="space-y-5">
            <Panel title="關於我：專業特質">
              <div className="grid gap-4">
                <InputField label="區塊標題" value={content.about.title} onChange={(value) => updateContent((draft) => ((draft.about.title = value), draft))} />
                <InputField label="區塊說明" value={content.about.intro} textarea rows={3} onChange={(value) => updateContent((draft) => ((draft.about.intro = value), draft))} />
              </div>
            </Panel>
            <Panel
              title="特質卡片"
              action={
                <button type="button" onClick={() => updateContent((draft) => ((draft.about.items.push({ title: "新的專業特質", text: "在這裡描述你希望被看見的一項產品經理特質。" })), draft))} className="rounded-full bg-coral/10 px-4 py-2 text-sm font-medium text-coral">
                  新增特質
                </button>
              }
            >
              {renderTextItemEditor(content.about.items, "about", "新增特質", {
                title: "新的專業特質",
                text: "在這裡描述你希望被看見的一項產品經理特質。",
              })}
            </Panel>
          </div>
        ) : null}

        {activeSheet === "sheet-journey" ? (
          <div className="space-y-5">
            <Panel title="成長曲線">
              <div className="grid gap-4">
                <InputField label="區塊標題" value={content.journey.title} onChange={(value) => updateContent((draft) => ((draft.journey.title = value), draft))} />
                <InputField label="區塊說明" value={content.journey.intro} textarea rows={3} onChange={(value) => updateContent((draft) => ((draft.journey.intro = value), draft))} />
              </div>
            </Panel>
            <Panel
              title="時間軸節點"
              action={
                <button type="button" onClick={() => updateContent((draft) => ((draft.journey.items.push({ date: "2026 / 00", title: "新的里程碑", badge: "Milestone", text: "在這裡補上你的學習或成長節點。" })), draft))} className="rounded-full bg-coral/10 px-4 py-2 text-sm font-medium text-coral">
                  新增節點
                </button>
              }
            >
              <div className="grid gap-4">
                {content.journey.items.map((item: TimelineItem, index) => (
                  <article key={`${item.date}-${index}`} className="rounded-[1.2rem] border border-slate-200 bg-[#fffdf9] p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm text-coral">節點 {index + 1}</span>
                      <button
                        type="button"
                        onClick={() =>
                          updateContent((draft) => {
                            draft.journey.items.splice(index, 1);
                            return draft;
                          })
                        }
                        className="rounded-full bg-rose-50 px-3 py-2 text-sm text-rose-700"
                      >
                        刪除
                      </button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <InputField label="日期" value={item.date} onChange={(value) => updateContent((draft) => ((draft.journey.items[index].date = value), draft))} />
                      <InputField label="標題" value={item.title} onChange={(value) => updateContent((draft) => ((draft.journey.items[index].title = value), draft))} />
                      <div className="md:col-span-2">
                        <InputField label="徽章 / 標註" value={item.badge} onChange={(value) => updateContent((draft) => ((draft.journey.items[index].badge = value), draft))} />
                      </div>
                      <div className="md:col-span-2">
                        <InputField label="內容" value={item.text} textarea rows={4} onChange={(value) => updateContent((draft) => ((draft.journey.items[index].text = value), draft))} />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </Panel>
          </div>
        ) : null}

        {activeSheet === "sheet-projects" ? (
          <div className="space-y-5">
            <Panel title="深度專案">
              <div className="grid gap-4">
                <InputField label="區塊標題" value={content.projects.title} onChange={(value) => updateContent((draft) => ((draft.projects.title = value), draft))} />
                <InputField label="區塊說明" value={content.projects.intro} textarea rows={3} onChange={(value) => updateContent((draft) => ((draft.projects.intro = value), draft))} />
              </div>
            </Panel>
            <Panel
              title="專案卡片"
              action={
                <button type="button" onClick={() => updateContent((draft) => ((draft.projects.items.push({ metaLeft: "Featured Project", metaRight: "Category", title: "新的專案標題", text: "在這裡描述專案背景、你的角色與成果。", bullets: [], imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80", featured: false })), draft))} className="rounded-full bg-coral/10 px-4 py-2 text-sm font-medium text-coral">
                  新增專案
                </button>
              }
            >
              <div className="grid gap-4">
                {content.projects.items.map((item: ProjectItem, index) => (
                  <article key={`${item.title}-${index}`} className="rounded-[1.2rem] border border-slate-200 bg-[#fffdf9] p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm text-coral">專案 {index + 1}</span>
                      <button
                        type="button"
                        onClick={() =>
                          updateContent((draft) => {
                            draft.projects.items.splice(index, 1);
                            return draft;
                          })
                        }
                        className="rounded-full bg-rose-50 px-3 py-2 text-sm text-rose-700"
                      >
                        刪除
                      </button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <InputField label="左側標籤" value={item.metaLeft} onChange={(value) => updateContent((draft) => ((draft.projects.items[index].metaLeft = value), draft))} />
                      <InputField label="右側標籤" value={item.metaRight} onChange={(value) => updateContent((draft) => ((draft.projects.items[index].metaRight = value), draft))} />
                      <div className="md:col-span-2">
                        <InputField label="專案標題" value={item.title} onChange={(value) => updateContent((draft) => ((draft.projects.items[index].title = value), draft))} />
                      </div>
                      <div className="md:col-span-2">
                        <InputField label="專案說明" value={item.text} textarea rows={4} onChange={(value) => updateContent((draft) => ((draft.projects.items[index].text = value), draft))} />
                      </div>
                      <div className="md:col-span-2">
                        <InputField label="條列重點" value={toLines(item.bullets)} textarea rows={4} onChange={(value) => updateContent((draft) => ((draft.projects.items[index].bullets = fromLines(value)), draft))} />
                      </div>
                      <InputField label="專案圖片網址" type="url" value={item.imageUrl} onChange={(value) => updateContent((draft) => ((draft.projects.items[index].imageUrl = value), draft))} />
                      <label className="flex items-center gap-3 text-sm text-ink">
                        <input
                          type="checkbox"
                          checked={item.featured}
                          onChange={(event) =>
                            updateContent((draft) => {
                              draft.projects.items[index].featured = event.target.checked;
                              return draft;
                            })
                          }
                        />
                        設為主打專案
                      </label>
                    </div>
                  </article>
                ))}
              </div>
            </Panel>
          </div>
        ) : null}

        {activeSheet === "sheet-skills" ? (
          <div className="space-y-5">
            <Panel title="核心技能：工具箱">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <InputField label="區塊標題" value={content.skills.title} onChange={(value) => updateContent((draft) => ((draft.skills.title = value), draft))} />
                </div>
                <InputField label="硬實力標題" value={content.skills.hardTitle} onChange={(value) => updateContent((draft) => ((draft.skills.hardTitle = value), draft))} />
                <InputField label="軟實力標題" value={content.skills.softTitle} onChange={(value) => updateContent((draft) => ((draft.skills.softTitle = value), draft))} />
                <InputField label="硬實力標籤" value={toLines(content.skills.hardItems)} textarea rows={5} onChange={(value) => updateContent((draft) => ((draft.skills.hardItems = fromLines(value)), draft))} />
                <InputField label="軟實力標籤" value={toLines(content.skills.softItems)} textarea rows={5} onChange={(value) => updateContent((draft) => ((draft.skills.softItems = fromLines(value)), draft))} />
              </div>
            </Panel>
            <Panel title="生活側寫">
              <div className="grid gap-4">
                <InputField label="區塊標題" value={content.beyond.title} onChange={(value) => updateContent((draft) => ((draft.beyond.title = value), draft))} />
                <InputField label="內容" value={content.beyond.text} textarea rows={4} onChange={(value) => updateContent((draft) => ((draft.beyond.text = value), draft))} />
                <InputField label="強調句" value={content.beyond.highlight} textarea rows={3} onChange={(value) => updateContent((draft) => ((draft.beyond.highlight = value), draft))} />
              </div>
            </Panel>
          </div>
        ) : null}

        {activeSheet === "sheet-contact" ? (
          <Panel title="聯絡資訊">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <InputField label="CTA 標題" value={content.contact.title} textarea rows={3} onChange={(value) => updateContent((draft) => ((draft.contact.title = value), draft))} />
              </div>
              <InputField label="Email" value={content.contact.email} type="email" onChange={(value) => updateContent((draft) => ((draft.contact.email = value), draft))} />
              <InputField label="LinkedIn 連結" value={content.contact.linkedin} type="url" onChange={(value) => updateContent((draft) => ((draft.contact.linkedin = value), draft))} />
              <InputField label="LinkedIn 標籤" value={content.contact.linkedinLabel} onChange={(value) => updateContent((draft) => ((draft.contact.linkedinLabel = value), draft))} />
              <InputField label="履歷連結" value={content.contact.resume} type="url" onChange={(value) => updateContent((draft) => ((draft.contact.resume = value), draft))} />
              <InputField label="履歷按鈕文字" value={content.contact.resumeLabel} onChange={(value) => updateContent((draft) => ((draft.contact.resumeLabel = value), draft))} />
            </div>
          </Panel>
        ) : null}
      </main>
    </div>
  );
}
