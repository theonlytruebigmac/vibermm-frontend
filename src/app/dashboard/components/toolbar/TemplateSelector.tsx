"use client";

import { useState, useEffect, useRef } from 'react';
import { dashboardTemplates, DashboardTemplate } from '@/constants/dashboardTemplates';
import { useDashboard } from '@/contexts/dashboard';
import { IoGrid, IoClose } from 'react-icons/io5';
import { Button } from '@/components/ui';

export function TemplateSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DashboardTemplate | null>(null);
  const { widgets, addWidget, removeWidget } = useDashboard();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const openTemplateModal = (template: DashboardTemplate) => {
    setSelectedTemplate(template);
    setTemplateModalOpen(true);
    setIsOpen(false);
  };

  const applyTemplate = () => {
    if (!selectedTemplate) return;

    // Clear existing widgets if needed
    if (widgets.length > 0) {
      const confirmed = window.confirm(
        "Applying a template will replace your current dashboard widgets. Do you want to continue?"
      );
      
      if (!confirmed) return;
      
      // Remove all existing widgets
      [...widgets].forEach(widget => removeWidget(widget.id));
    }

    // Add template widgets
    selectedTemplate.widgets.forEach(widget => {
      addWidget(widget);
    });

    setTemplateModalOpen(false);
  };

  return (
    <>
      <div className="relative" ref={menuRef}>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <IoGrid className="w-5 h-5" />
          Templates
        </Button>

        {isOpen && (
          <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-30">
            {dashboardTemplates.map((template) => (
              <Button
                key={template.id}
                onClick={() => openTemplateModal(template)}
                variant="ghost"
                className="w-full justify-start"
              >
                {template.name}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Template Preview Modal */}
      {templateModalOpen && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {selectedTemplate.name} Template
              </h3>
              <Button 
                onClick={() => setTemplateModalOpen(false)}
                variant="ghost"
                size="icon"
                className="rounded-full"
              >
                <IoClose className="w-6 h-6 text-gray-500" />
              </Button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-10rem)]">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {selectedTemplate.description}
              </p>
              
              <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="aspect-video relative bg-gray-100 dark:bg-gray-900">
                  {/* You would replace this with actual template preview images */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <span>Template Preview Image</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-2 text-gray-800 dark:text-gray-200">Included Widgets:</h4>
                <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
                  {selectedTemplate.widgets.map((widget, index) => (
                    <li key={index}>{widget.title}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <Button
                onClick={() => setTemplateModalOpen(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={applyTemplate}
              >
                Apply Template
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}