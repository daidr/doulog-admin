import { defineConfig } from 'unocss'
import { transformerDirectives, transformerVariantGroup, presetIcons, presetUno } from 'unocss'

export default defineConfig({
    presets: [
        presetUno(),
        presetIcons(),
    ],
    transformers: [
        transformerDirectives(),
        transformerVariantGroup(),
  ],
  safelist: [
    'i-mingcute-chart-line-line',
    'i-mingcute-paper-line',
    'i-mingcute-tag-2-line',
    'i-mingcute-photo-album-line',
    'i-mingcute-comment-line',
    'i-mingcute-report-line',
    'i-mingcute-contacts-3-line',
    'i-mingcute-box-2-line',
    'i-mingcute-tag-2-line',
    'i-mingcute-user-3-line',
    'i-mingcute-settings-3-line',
  ]
})
