import { defineConfig } from 'umi';
import theme from './src/theme';

export default defineConfig({
  qiankun: {
    slave: {},
  },
  fastRefresh: {},
  nodeModulesTransform: {
    type: 'none',
  },

  theme,
  helmet: false,
  dva: false,
  model: false,
  initialState: false,
  layout: false,
  locale: false,
  preact: false,
  request: false,
  sass: false,
  hash: true,
  runtimePublicPath: true,

  externals: {
    moment: 'moment',
  },
  scripts: ['https://lib.baomitu.com/moment.js/latest/moment.min.js'],
});
