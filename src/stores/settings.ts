import { defineStore } from 'pinia'
import { supabase } from '../plugins/supabaseClient'
import { db } from '../plugins/db';
import type { Session } from '@supabase/supabase-js';

// You can name the return value of `defineStore()` anything you want,
// but it's best to use the name of the store and surround it with `use`
// and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const useSettingsStore = defineStore('settings', {
  state: () => ({
    session: null as Session | null,
    isFileUploading: false
  }),
  actions: {
    // since we rely on `this`, we cannot use an arrow function
    async downloadQuestions() {
      try {
        const { data, error } = await supabase.from('questions').select().eq('owner', this.session?.user?.id)
        if (error) {
          throw error;
        }
        const mappedData = data.map((question) => ({ ...question, synced: 1 }))
        const questions = await db.questions.toArray();
        const mergedMap = [...mappedData, ...questions].reduce((accumulator, curr) => {
          if (!accumulator.has(curr.id)) {
            accumulator.set(curr.id, {
              id: curr.id,
              question: curr.question,
              answer: curr.answer,
              deck: curr.deck,
              synced: curr.synced
            });
          }

          return accumulator;
        }, new Map());
        const final = Array.from(mergedMap.values());
        // @ts-ignore
        db.questions.bulkPut(final);
      } catch (error) {
        error instanceof Error && console.error('Error downloading questions', error.message);
      }
    },
    async uploadQuestions() {
      const localQuestions = await db.questions.toArray();
      await supabase.from('questions').upsert(localQuestions.map(({ synced, ...rest }) => rest));
    }
  },
})