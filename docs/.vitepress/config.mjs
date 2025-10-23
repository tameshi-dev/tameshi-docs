import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
    title: 'Tameshi',
    description: 'Smart Contract Security Analysis Framework',
    base: '/',

    head: [
      ['meta', { name: 'theme-color', content: '#3c82f6' }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:title', content: 'Tameshi - Smart Contract Security Analysis' }],
      ['meta', { property: 'og:description', content: 'Unified vulnerability scanning framework for Solidity smart contracts' }],
    ],

    themeConfig: {
      logo: {
        light: '/logo-icon.png',
        dark: '/logo-icon-dark.png'
      },

      nav: [
        { text: 'Get Started', link: '/install' },
        { text: 'VSCode', link: '/vscode' },
        { text: 'CLI', link: '/cli' },
        { text: 'GitHub', link: 'https://github.com/tameshi-dev' }
      ],

      sidebar: [
        {
          text: 'Get Started',
          items: [
            { text: 'Installation', link: '/install' },
            { text: 'Quick Start', link: '/quick-start' },
          ]
        },
        {
          text: 'Usage',
          items: [
            { text: 'VSCode Extension', link: '/vscode' },
            { text: 'CLI Reference', link: '/cli' },
          ]
        },
        {
          text: 'Concepts',
          items: [
            { text: 'Scanners', link: '/scanners' },
            { text: 'Scan Modes', link: '/scan-modes' },
            { text: 'ThalIR', link: '/thalir' },
          ]
        },
        {
          text: 'Reference',
          items: [
            { text: 'Configuration', link: '/reference/configuration' },
            { text: 'SARIF Export', link: '/reference/sarif' },
          ]
        }
      ],

      socialLinks: [
        { icon: 'github', link: 'https://github.com/tameshi-dev' }
      ],

      footer: {
        message: 'Released under the MIT License.',
        copyright: 'Copyright © 2025 Tameshi Contributors'
      },

      search: {
        provider: 'local'
      }
    },

    markdown: {
      theme: {
        light: 'github-light',
        dark: 'github-dark'
      }
    }
  })
)
