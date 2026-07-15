import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

export const useAedStore = defineStore('aed', {
  state: () => ({
    devices: [],
    reportsByDevice: {},
    loading: false,
    error: null,
  }),

  actions: {
    async fetchDevices() {
      this.loading = true
      this.error = null
      const { data, error } = await supabase.from('aed_devices').select('*')
      if (error) {
        this.error = error.message
      } else {
        this.devices = data
      }
      this.loading = false
    },

    async fetchReports(aedId) {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('aed_id', aedId)
        .order('created_at', { ascending: false })
      if (!error) {
        this.reportsByDevice[aedId] = data
      }
      return data || []
    },

    async submitReport(aedId, status, comment) {
      const { error } = await supabase
        .from('reports')
        .insert({ aed_id: aedId, status, comment })
      if (!error) {
        await this.fetchReports(aedId)
      }
      return error
    },
  },
})
