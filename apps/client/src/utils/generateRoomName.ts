export function generateRoomName(): string {
  const adjectives = [
    'js',
    'ts',
    'react',
    'node',
    'algo',
    'css',
    'html',
    'git',
  ];

  const nouns = [
    'masters',
    'ninjas',
    'pros',
    'devs',
    'coders',
    'wizards',
    'gurus',
    'hackers',
  ];

  const number_ = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, '0');

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj}-${noun}-${number_}`;
}
