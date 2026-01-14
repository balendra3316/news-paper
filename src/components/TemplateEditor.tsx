import { useRef, useEffect } from "react";

export default function TemplateEditor({
    value,
    onChange,
}: {
    value: string;
    onChange: (html: string) => void;
}) {
    const editorRef = useRef<HTMLDivElement>(null);
    const lastValue = useRef(value);

    // Sync external value WITHOUT breaking cursor
    useEffect(() => {
        if (
            editorRef.current &&
            value !== lastValue.current &&
            editorRef.current.innerHTML !== value
        ) {
            editorRef.current.innerHTML = value;
        }
        lastValue.current = value;
    }, [value]);

    const exec = (command: string, val?: string) => {
        editorRef.current?.focus();
        document.execCommand(command, false, val);
        onChange(editorRef.current?.innerHTML || "");
    };

    const addLink = () => {
        const url = prompt("Enter URL");
        if (!url) return;

        editorRef.current?.focus();

        // If no text selected, insert link text
        const selection = window.getSelection();
        if (selection && selection.rangeCount === 0) {
            document.execCommand("insertHTML", false, `<a href="${url}" target="_blank">${url}</a>`);
        } else {
            document.execCommand("createLink", false, url);
        }

        // Highlight links
        document.execCommand("styleWithCSS", false, "true");
        document.execCommand("foreColor", false, "#2563eb");

        onChange(editorRef.current?.innerHTML || "");
    };

    return (
        <div className="border rounded bg-white">
            {/* Toolbar */}
            <div className="border-b p-2 flex gap-2 text-sm">
                <button onClick={() => exec("bold")} className="font-bold">B</button>
                <button onClick={() => exec("italic")} className="italic">I</button>
                <button onClick={() => exec("underline")} className="underline">U</button>
                <button onClick={() => exec("insertUnorderedList")}>• List</button>
                <button onClick={addLink} className="text-blue-600 underline">
                    Link
                </button>
            </div>

            {/* Editor */}
            <div
                ref={editorRef}
                contentEditable
                className="p-3 min-h-[120px] outline-none text-sm"
                onInput={() => {
                    lastValue.current = editorRef.current?.innerHTML || "";
                    onChange(lastValue.current);
                }}
            />
        </div>
    );
}
