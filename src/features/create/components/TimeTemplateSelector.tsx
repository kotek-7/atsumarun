"use client";

import { useState, useEffect } from "react";

interface TimeTemplatePanelProps {
  selectedDateIndexes: number[];
  updateSelectedTime: (time: string) => void;
}

export const TimeTemplateSelector = ({
  selectedDateIndexes,
  updateSelectedTime: onTimeChange,
}: TimeTemplatePanelProps) => {
  const [customTemplates, setCustomTemplates] = useState<string[]>([
    "9:00",
    "12:00",
    "15:00",
  ]);
  const [newTemplate, setNewTemplate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Load custom templates from localStorage on component mount
  useEffect(() => {
    const savedTemplates = localStorage.getItem("atsumarun-custom-templates");
    if (savedTemplates) {
      try {
        const parsedTemplates = JSON.parse(savedTemplates);
        if (Array.isArray(parsedTemplates)) {
          setCustomTemplates(parsedTemplates);
        }
      } catch (error) {
        console.error("Failed to parse saved custom templates:", error);
      }
    }
  }, []);

  // Save custom templates to localStorage whenever customTemplates changes
  useEffect(() => {
    localStorage.setItem(
      "atsumarun-custom-templates",
      JSON.stringify(customTemplates)
    );
  }, [customTemplates]);

  const addCustomTemplate = () => {
    const trimmedTemplate = newTemplate.trim();
    if (trimmedTemplate && !customTemplates.includes(trimmedTemplate)) {
      setCustomTemplates((prev) => [...prev, trimmedTemplate]);
      setNewTemplate("");
    }
  };

  const removeCustomTemplate = (templateToRemove: string) => {
    setCustomTemplates((prev) =>
      prev.filter((template) => template !== templateToRemove)
    );
  };

  const handleTimeTemplateClick = (template: string) => {
    if (selectedDateIndexes.length === 0) {
      setErrorMessage("候補日時を選択してから時刻を設定してください。");
      return;
    }
    setErrorMessage(""); // エラーメッセージをクリア
    onTimeChange(template);
  };

  return (
    <div className="time-template-panel rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        テンプレートから時刻を選択
        {selectedDateIndexes.length > 0 && (
          <span className="ml-2 text-sm font-normal text-gray-600">
            ({selectedDateIndexes.length}件選択中)
          </span>
        )}
      </h3>

      {errorMessage && (
        <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-500">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {customTemplates.length === 0 && (
        <p className="text-sm text-gray-500">
          まだ時刻テンプレートはありません。
        </p>
      )}
      {customTemplates.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 block text-sm font-medium text-gray-700">
            選択中の候補日時に一括で時刻を適用します。
          </p>
          <div className="max-h-48 space-y-1 overflow-y-auto">
            {customTemplates.map((template) => (
              <div key={template} className="flex items-center gap-2">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
                  onClick={() => handleTimeTemplateClick(template)}
                  className="flex-1 rounded border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-700 shadow hover:bg-gray-50"
                >
                  {template}
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
                  onClick={() => removeCustomTemplate(template)}
                  className="text-danger-600 hover:bg-danger-50 hover:text-danger-800 rounded p-2"
                  title="削除"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={`${customTemplates.length > 0 ? "border-t" : ""} pt-4`}>
        <label
          htmlFor="add-time-input"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          新しい時刻テンプレートを追加
        </label>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addCustomTemplate();
          }}
          className="flex gap-2"
        >
          <input
            id="add-time-input"
            type="text"
            value={newTemplate}
            onChange={(e) => setNewTemplate(e.target.value)}
            className="focus:ring-primary-500 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
            placeholder="例: 9:00, 午前中, ランチタイム"
          />
          <button
            type="submit"
            onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
            className="bg-secondary-600 hover:bg-secondary-700 rounded-md px-3 py-2 text-sm text-white"
          >
            追加
          </button>
        </form>
      </div>
    </div>
  );
};
