import {SchemaType} from '@eva-design/dss';
import {Mixin} from './src/helpers';
export const mapping: SchemaType = {
  version: 1,
  strict: {
    'text-font-family': 'Inter',
  },
  components: {
    Text: {
      meta: {
        scope: 'all',
        parameters: {},
        states: {},
        appearances: {},
        variantGroups: {},
      },
      appearances: {
        default: {
          mapping: {},
          variantGroups: {
            category: {
              h1: {
                fontWeight: '300',
              },
              h2: {
                fontWeight: '300',
              },
              h3: {
                fontWeight: '400',
              },
              h4: {
                fontWeight: '400',
              },
              h5: {
                fontWeight: '400',
                fontSize: Mixin.moderateSize(24),
              },
              h6: {
                fontWeight: '500',
                fontSize: Mixin.moderateSize(20),
              },
              s1: {
                fontWeight: '400',
                fontSize: Mixin.moderateSize(16),
              },
              s2: {
                fontWeight: '500',
                fontSize: Mixin.moderateSize(14),
              },
              p1: {
                fontWeight: '400',
                fontSize: Mixin.moderateSize(16),
              },
              p2: {
                fontWeight: '400',
                fontSize: Mixin.moderateSize(14),
              },
              c1: {
                fontWeight: '400',
                fontSize: Mixin.moderateSize(12),
              },
              c2: {
                fontWeight: '400',
                fontSize: Mixin.moderateSize(10),
                textTransform: 'uppercase',
              },
            },
          },
        },
      },
    },
    Button: {
      meta: {
        scope: 'all',
        parameters: {},
        states: {},
        appearances: {},
        variantGroups: {},
      },
      appearances: {
        filled: {
          mapping: {},
          variantGroups: {
            status: {
              secondary: {
                backgroundColor: '#FFB800',
              },
            },
          },
        },
      },
    },
  },
};
