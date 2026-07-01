import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ImagePlus,
  Plus,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  contentDataUrl,
  defaultPortfolioContent,
  type PortfolioContent,
} from "@/lib/portfolio-content";

type EditableValue =
  | string
  | number
  | boolean
  | null
  | EditableValue[]
  | { [key: string]: EditableValue };

type FieldPath = Array<string | number>;

const managerEndpoint = "/__portfolio-manager/content";
const assetEndpoint = "/__portfolio-manager/asset";

const sections = [
  { key: "navbar", label: "Navbar" },
  { key: "hero", label: "Hero" },
  { key: "about", label: "About" },
  { key: "skills", label: "Skills" },
  { key: "projects", label: "Projects" },
  { key: "gallery", label: "Gallery" },
  { key: "experience", label: "Experience" },
  { key: "contact", label: "Contact" },
  { key: "footer", label: "Footer" },
] as const;

function humanize(value: string) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function cloneContent(content: PortfolioContent) {
  return structuredClone(content);
}

function getAtPath(root: EditableValue, path: FieldPath): EditableValue {
  return path.reduce<EditableValue>((current, segment) => {
    if (current && typeof current === "object") {
      return (current as Record<string, EditableValue>)[String(segment)];
    }
    return "";
  }, root);
}

function setAtPath(
  root: EditableValue,
  path: FieldPath,
  value: EditableValue,
): EditableValue {
  if (!path.length) return value;

  const [segment, ...rest] = path;

  if (Array.isArray(root)) {
    const next = [...root];
    next[Number(segment)] = setAtPath(next[Number(segment)], rest, value);
    return next;
  }

  const objectRoot =
    root && typeof root === "object" && !Array.isArray(root) ? root : {};

  return {
    ...objectRoot,
    [segment]: setAtPath(
      (objectRoot as Record<string, EditableValue>)[String(segment)],
      rest,
      value,
    ),
  };
}

function createBlankLike(value: EditableValue): EditableValue {
  if (Array.isArray(value)) return [];
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, createBlankLike(child)]),
    );
  }
  if (typeof value === "boolean") return false;
  if (typeof value === "number") return 0;
  return "";
}

async function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function isImageField(label: string) {
  return ["image", "src", "favicon", "avatar"].includes(label.toLowerCase());
}

function isLongText(label: string, value: string) {
  return (
    value.length > 90 ||
    ["description", "paragraphs", "heading", "alt", "detail"].includes(
      label.toLowerCase(),
    )
  );
}

export default function PortfolioManager() {
  const [content, setContent] =
    useState<PortfolioContent>(defaultPortfolioContent);
  const [activeSection, setActiveSection] =
    useState<(typeof sections)[number]["key"]>("hero");
  const [status, setStatus] = useState("Loading portfolio content...");
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingUploadPathRef = useRef<FieldPath | null>(null);

  const activeLabel = useMemo(
    () => sections.find((section) => section.key === activeSection)?.label ?? "",
    [activeSection],
  );

  useEffect(() => {
    fetch(contentDataUrl(), { cache: "no-store" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load portfolio-content.json");
        }
        return response.json();
      })
      .then((data: PortfolioContent) => {
        setContent({ ...defaultPortfolioContent, ...data });
        setStatus("Portfolio content loaded.");
      })
      .catch(() => {
        setContent(defaultPortfolioContent);
        setStatus("Using default content because the JSON file could not be loaded.");
      });
  }, []);

  const updateValue = (path: FieldPath, value: EditableValue) => {
    setContent((current) =>
      setAtPath(cloneContent(current) as EditableValue, path, value) as PortfolioContent,
    );
  };

  const saveContent = async () => {
    setIsSaving(true);
    setStatus("Saving portfolio content...");

    try {
      const response = await fetch(managerEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setStatus("Saved to public/portfolio-content.json.");
    } catch (error) {
      setStatus(
        "Could not save. Run the portfolio with pnpm dev, then open this manager again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const uploadImage = async (file: File) => {
    const targetPath = pendingUploadPathRef.current;
    if (!targetPath) return;

    setStatus("Uploading image...");

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const response = await fetch(assetEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, dataUrl }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const result = (await response.json()) as { src: string };
      updateValue(targetPath, result.src);
      setStatus(`Uploaded ${file.name}. Save content to keep this image path.`);
    } catch (error) {
      setStatus("Upload failed. Use PNG, JPG, WebP, GIF, or SVG images.");
    } finally {
      pendingUploadPathRef.current = null;
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const startUpload = (path: FieldPath) => {
    pendingUploadPathRef.current = path;
    fileInputRef.current?.click();
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border/50 bg-card/60">
        <div className="container mx-auto px-6 py-8 md:px-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Button variant="ghost" className="mb-5 px-0 text-muted-foreground" asChild>
                <a href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to portfolio
                </a>
              </Button>
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                Portfolio Manager
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
                Edit every public section from one place. Save writes directly to the
                local content JSON used by the portfolio page.
              </p>
            </div>
            <Button onClick={saveContent} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving" : "Save Changes"}
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto grid gap-8 px-6 py-10 md:grid-cols-[220px_1fr] md:px-12">
        <aside className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.key}
              type="button"
              onClick={() => setActiveSection(section.key)}
              className={`w-full rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors ${
                activeSection === section.key
                  ? "border-primary/70 bg-primary/10 text-foreground"
                  : "border-border/50 bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {section.label}
            </button>
          ))}
        </aside>

        <div className="rounded-lg border border-border/50 bg-card p-5">
          <div className="mb-6 flex flex-col gap-2 border-b border-border/50 pb-5">
            <h2 className="text-2xl font-semibold">{activeLabel}</h2>
            <p className="text-sm text-muted-foreground">{status}</p>
          </div>

          <FieldEditor
            label={activeLabel}
            path={[activeSection]}
            value={content[activeSection] as EditableValue}
            onChange={updateValue}
            onUpload={startUpload}
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void uploadImage(file);
            }}
          />
        </div>
      </section>
    </main>
  );
}

function FieldEditor({
  label,
  path,
  value,
  onChange,
  onUpload,
}: {
  label: string;
  path: FieldPath;
  value: EditableValue;
  onChange: (path: FieldPath, value: EditableValue) => void;
  onUpload: (path: FieldPath) => void;
}) {
  if (Array.isArray(value)) {
    const addItem = () => {
      const blankItem =
        value.length > 0 ? createBlankLike(value[0]) : "New item";
      onChange(path, [...value, blankItem]);
    };

    const moveItem = (fromIndex: number, direction: -1 | 1) => {
      const toIndex = fromIndex + direction;
      if (toIndex < 0 || toIndex >= value.length) return;

      const nextValue = [...value];
      const [movedItem] = nextValue.splice(fromIndex, 1);
      nextValue.splice(toIndex, 0, movedItem);
      onChange(path, nextValue);
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            {label}
          </h3>
          <Button variant="outline" size="sm" onClick={addItem}>
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Button>
        </div>

        <div className="space-y-4">
          {value.map((item, index) => (
            <div
              key={`${label}-${index}`}
              className="rounded-lg border border-border/50 bg-background p-4"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-muted-foreground">
                  {humanize(label)} {index + 1}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => moveItem(index, -1)}
                    disabled={index === 0}
                    title="Move up"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => moveItem(index, 1)}
                    disabled={index === value.length - 1}
                    title="Move down"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      onChange(
                        path,
                        value.filter((_, itemIndex) => itemIndex !== index),
                      )
                    }
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <FieldEditor
                label={Array.isArray(item) ? "Items" : label}
                path={[...path, index]}
                value={item}
                onChange={onChange}
                onUpload={onUpload}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (value && typeof value === "object") {
    return (
      <div className="grid gap-5">
        {Object.entries(value).map(([key, child]) => (
          <FieldEditor
            key={key}
            label={key}
            path={[...path, key]}
            value={child}
            onChange={onChange}
            onUpload={onUpload}
          />
        ))}
      </div>
    );
  }

  const stringValue = String(value ?? "");
  const imageField = isImageField(label);

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-muted-foreground">
        {humanize(label)}
      </span>
      <div className="grid gap-3">
        {imageField && stringValue ? (
          <div className="flex max-w-md overflow-hidden rounded-lg border border-border/50 bg-background">
            <div className="aspect-video w-full">
              <img
                src={stringValue}
                alt=""
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            </div>
          </div>
        ) : null}

        {isLongText(label, stringValue) ? (
          <Textarea
            value={stringValue}
            rows={stringValue.length > 160 ? 5 : 3}
            onChange={(event) => onChange(path, event.target.value)}
          />
        ) : (
          <div className="flex gap-3">
            <Input
              value={stringValue}
              type={label.toLowerCase() === "color" ? "text" : "text"}
              onChange={(event) => onChange(path, event.target.value)}
            />
            {label.toLowerCase() === "color" ? (
              <Input
                aria-label={`${humanize(label)} picker`}
                className="w-16 p-1"
                type="color"
                value={/^#[0-9a-f]{6}$/i.test(stringValue) ? stringValue : "#8b5cf6"}
                onChange={(event) => onChange(path, event.target.value)}
              />
            ) : null}
          </div>
        )}

        {imageField ? (
          <Button
            type="button"
            variant="outline"
            className="w-fit"
            onClick={() => onUpload(path)}
          >
            {stringValue ? (
              <Upload className="mr-2 h-4 w-4" />
            ) : (
              <ImagePlus className="mr-2 h-4 w-4" />
            )}
            Upload Image
          </Button>
        ) : null}
      </div>
    </label>
  );
}
