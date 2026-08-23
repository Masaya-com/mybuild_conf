import './bootstrap'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

window.mountVue = function (component, elementId, props = {}) {
  const app = createApp(component, props)
  app.use(createPinia())
  app.mount(`#${elementId}`)
}
