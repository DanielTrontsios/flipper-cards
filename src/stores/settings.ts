import { defineStore } from 'pinia'
import { supabase } from '../plugins/supabaseClient'
import { db } from '../plugins/db';

// You can name the return value of `defineStore()` anything you want,
// but it's best to use the name of the store and surround it with `use`
// and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const useSettingsStore = defineStore('settings', {
  state: () => ({
    session: null
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
        db.questions.bulkPut(final);
      } catch (error) {
        console.error('Error downloading questions', error.message);
      }
    },
  },
})