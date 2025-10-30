import type { Config } from 'jest'
import nextJest from 'next/jest.js'
import { pathsToModuleNameMapper } from 'ts-jest'
import tsconfig from './tsconfig.json' with { type: 'json' }

const createJestConfig = nextJest({
  // Caminho do app Next para carregar next.config.js e variáveis .env
  dir: './',
})

const customJestConfig: Config = {
  testEnvironment: 'jest-environment-jsdom',
  coverageProvider: 'v8',

  // Extensões padrão
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Setup do RTL/Jest-DOM
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  modulePaths: ['<rootDir>'],

  // Mapeamento de aliases (ajuste conforme seu tsconfig.json)
  // Se usar paths no tsconfig, considere gerar via pathsToModuleNameMapper
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),

  // Ignorar diretórios gerados
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],

  // Se precisar transformar ESM de libs específicas do node_modules, liste-as aqui
  // Exemplo com react-markdown/next-intl; ajuste à sua necessidade
  transformIgnorePatterns: [
    '/node_modules/(?!(react-markdown|remark-gfm|rehype-raw|next-intl|use-intl)/)',
  ],
}

export default createJestConfig(customJestConfig)
