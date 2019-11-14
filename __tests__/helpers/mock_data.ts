const EVENTS = {
  TEST_NORMAL: 'normal-event',
  TEST_MULTIPLE_1: 'test-multiple-1',
  TEST_MULTIPLE_2: 'test-multiple-2',
};

const EVENT_DATA: any = {};
EVENT_DATA[EVENTS.TEST_NORMAL] = [
  { value: 'a' },
  { value: 'b' },
  { value: 'c' },
  { value: 'd' },
];
EVENT_DATA[EVENTS.TEST_MULTIPLE_1] = [{ value: 'a' }, { value: 'b' }];
EVENT_DATA[EVENTS.TEST_MULTIPLE_2] = [
  { value: 'a' },
  { value: 'b' },
  { value: 'c' },
];

export { EVENTS, EVENT_DATA };
