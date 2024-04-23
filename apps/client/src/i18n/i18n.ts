import Lang from 'i18next';

import enClient from '../../locales/en/client.json';
import enCommands from '../../locales/en/commands.json';
import enGeneral from '../../locales/en/general.json';

import nlClient from '../../locales/nl/client.json';
import nlCommands from '../../locales/nl/commands.json';
import nlGeneral from '../../locales/nl/general.json';

import libEnglish from '../../locales/en/lib.json';
import libDutch from '../../locales/nl/lib.json';

export const defaultNS = 'client';

export const init = (debugEnabled = false) =>
  Lang.init({
    debug: debugEnabled,
    fallbackLng: 'en',
    defaultNS,
    resources: {
      en: {
        client: enClient,
        commands: enCommands,
        general: enGeneral,
        lib: libEnglish,
      },
      nl: {
        client: nlClient,
        commands: nlCommands,
        general: nlGeneral,
        lib: libDutch,
      },
    },
  });

export default Lang;
