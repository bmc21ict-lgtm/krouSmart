import { LessonPlan } from '../types/lesson';
import { DEFAULT_LESSONS } from '../data/defaultLessons';

const STORAGE_KEY = 'krusmart_free_store_lessons_v1';

export const storageService = {
  loadLessons(): LessonPlan[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_LESSONS));
        return DEFAULT_LESSONS;
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return DEFAULT_LESSONS;
    } catch (e) {
      console.error('Error reading from free store:', e);
      return DEFAULT_LESSONS;
    }
  },

  saveLessons(lessons: LessonPlan[]): boolean {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lessons));
      return true;
    } catch (e) {
      console.error('Error writing to free store:', e);
      return false;
    }
  },

  saveLesson(lesson: LessonPlan): LessonPlan[] {
    const lessons = this.loadLessons();
    const index = lessons.findIndex((l) => l.id === lesson.id);
    const updated = { ...lesson, updatedAt: Date.now() };

    let newLessons: LessonPlan[];
    if (index >= 0) {
      newLessons = [...lessons];
      newLessons[index] = updated;
    } else {
      newLessons = [updated, ...lessons];
    }
    this.saveLessons(newLessons);
    return newLessons;
  },

  deleteLesson(id: string): LessonPlan[] {
    const lessons = this.loadLessons();
    const filtered = lessons.filter((l) => l.id !== id);
    this.saveLessons(filtered);
    return filtered;
  },

  duplicateLesson(id: string): LessonPlan | null {
    const lessons = this.loadLessons();
    const source = lessons.find((l) => l.id === id);
    if (!source) return null;

    const clone: LessonPlan = {
      ...JSON.parse(JSON.stringify(source)),
      id: `lesson_${Date.now()}`,
      title: `${source.title} (ចម្លង)`,
      updatedAt: Date.now(),
    };
    const updatedLessons = [clone, ...lessons];
    this.saveLessons(updatedLessons);
    return clone;
  },

  resetToDefaults(): LessonPlan[] {
    this.saveLessons(DEFAULT_LESSONS);
    return DEFAULT_LESSONS;
  },

  exportToJsonFile(lessons?: LessonPlan[]): void {
    const data = lessons || this.loadLessons();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `krusmart_store_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  importFromJsonFile(jsonString: string): { success: boolean; lessons?: LessonPlan[]; error?: string } {
    try {
      const data = JSON.parse(jsonString);
      if (!Array.isArray(data)) {
        return { success: false, error: 'ទម្រង់ឯកសារមិនត្រឹមត្រូវ (ត្រូវតែជា Array នៃកិច្ចតែងការ)' };
      }
      this.saveLessons(data);
      return { success: true, lessons: data };
    } catch (e: any) {
      return { success: false, error: e.message || 'មិនអាចអានឯកសារ JSON បានទេ' };
    }
  },

  getStorageStats(): { count: number; bytes: number; formattedSize: string } {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || '';
      const bytes = new Blob([raw]).size;
      const formattedSize = bytes > 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${bytes} B`;
      const lessons = this.loadLessons();
      return { count: lessons.length, bytes, formattedSize };
    } catch {
      return { count: 0, bytes: 0, formattedSize: '0 B' };
    }
  },
};
