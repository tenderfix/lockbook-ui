import de from './translations/de.json';
import en from './translations/en.json';

const flattenObjectKeys = (object: Record<string, unknown>): Array<string> => {
  const flat = [];
  const keys = Object.keys(object);

  for (const key of keys) {
    if (object[key] instanceof Object) {
      flat.push(key, ...flattenObjectKeys(object[key] as Record<string, unknown>));
    } else {
      flat.push(key);
    }
  }

  return flat;
};

it('Should recursively flatten object keys into a simple array.', () => {
  const input = {
    key_for_simple_value: 1337,
    key_for_nested_object: {
      nested_object_key: 'To be or not to be?',
      another_level_of_nesting: {
        are_you_out_of_your_mind: '?',
      },
    },
  };
  const output = [
    'key_for_simple_value',
    'key_for_nested_object',
    'nested_object_key',
    'another_level_of_nesting',
    'are_you_out_of_your_mind',
  ];

  expect(flattenObjectKeys(input)).toEqual(output);
});

const filterByWhitelist = (original: Array<string>, whitelist: Array<string>): Array<string> =>
  original.filter((key) => !whitelist.includes(key));

it('Should filter out values by a whitelist.', () => {
  const input = ['Steve Jobs', 'Bill Gates', 'Elon Musk'];
  const whitelist = ['Elon Musk'];
  const output = ['Steve Jobs', 'Bill Gates'];

  expect(filterByWhitelist(input, whitelist)).toEqual(output);
});

const de_keys = flattenObjectKeys(de);
const en_keys = flattenObjectKeys(en);

it('Should include same keys in translation file (EN)', () => {
  expect(de_keys).toStrictEqual(en_keys);
});
