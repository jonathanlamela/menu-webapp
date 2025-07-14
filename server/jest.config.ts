import { Config } from 'jest';
import { createDefaultPreset } from 'ts-jest'

const tsJestTransformCfg = createDefaultPreset().transform;


const config: Config = {
  testEnvironment: "node",
  preset: "ts-jest",
  verbose: true,
  transform: {
    ...tsJestTransformCfg,
  },
}

export default config;
