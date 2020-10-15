import { configure } from '@storybook/react';
import { setConfig } from 'react-hot-loader';

function loadStories() {
  require('../src/stories');
}

setConfig({ pureSFC: true });
configure(loadStories, module);
