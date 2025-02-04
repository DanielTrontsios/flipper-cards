import { defineStore } from 'pinia'

// You can name the return value of `defineStore()` anything you want,
// but it's best to use the name of the store and surround it with `use`
// and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const useSettingsStore = defineStore('settings', {
  state: () => ({
    session: null,
    menuItems: [
      {
        label: 'File',
        icon: 'pi pi-file',
        items: [
          {
            label: 'New',
            icon: 'pi pi-plus',
            command: () => {
              console.log('new');

            }
          },
          {
            label: 'Print',
            icon: 'pi pi-print',
            command: () => {
              console.log('print');

            }
          }
        ]
      },
      {
        separator: true
      },
      {
        label: 'Sync',
        icon: 'pi pi-cloud',
        items: [
          {
            label: 'Import',
            icon: 'pi pi-cloud-download',
            command: () => {
              console.log('in');

            }
          },
          {
            label: 'Export',
            icon: 'pi pi-cloud-upload',
            command: () => {
              console.log('export');
            }
          }
        ]
      }
    ]
  }),

})