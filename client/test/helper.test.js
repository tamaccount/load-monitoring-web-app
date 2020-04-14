import { isLoadHigh, isLoadRecovered } from '../src/utils/helper';

describe("Before the app starts, ", () => {
  const data = [];
  const _isLoadHigh = isLoadHigh(data);
  test("CPU load should not be high.", () => {
    expect(_isLoadHigh).toEqual(false);
  });
  test("CPU load should not be recovered.", () => {
    expect(isLoadRecovered(data, _isLoadHigh)).toEqual(false);
  });
});

describe("If CPU is over 1 for 2 minutes, ", () => {
  const data = [
    { "cpu": 0.9 }, { "cpu": 0.88 }, { "cpu": 0.99 },
    { "cpu": 1.1 }, { "cpu": 1.2 }, { "cpu": 1.14 },
    { "cpu": 1.12 }, { "cpu": 1.1 }, { "cpu": 1.2 },
    { "cpu": 1.15 }, { "cpu": 1.18 }, { "cpu": 1.1 },
    { "cpu": 1.12 }, { "cpu": 1.1 }, { "cpu": 1.2 }
  ];
  const _isLoadHigh = isLoadHigh(data);

  test("CPU load should be high.", () => {
    expect(_isLoadHigh).toEqual(true);
  });
  test("CPU load should NOT be recovered.", () => {
    expect(isLoadRecovered(data, _isLoadHigh)).toEqual(false);
  });
});

describe("If CPU is over 1 for 2 minutes,", () => {
  const data = [
    { "cpu": 0.9 }, { "cpu": 0.88 }, { "cpu": 0.99 },
    { "cpu": 1.1 }, { "cpu": 1.2 }, { "cpu": 1.14 },
    { "cpu": 1.12 }, { "cpu": 1.1 }, { "cpu": 1.2 },
    { "cpu": 1.15 }, { "cpu": 1.18 }, { "cpu": 1.1 },
    { "cpu": 1.12 }, { "cpu": 1.1 }, { "cpu": 1.2 }
  ];
  const _isLoadHigh = isLoadHigh(data);

  test("CPU load should be high.", () => {
    expect(_isLoadHigh).toEqual(true);
  });

  describe(" and then it drops under 1 for 1 minute", () => {
    const newData = [
      { "cpu": 0.29 }, { "cpu": 0.38 }, { "cpu": 0.23 },
      { "cpu": 0.1 }, { "cpu": 0.28 }, { "cpu": 0.09 },
    ];

    const updatedDataOneMinute = data.concat(newData);

    test("CPU load should NOT be recovered.", () => {
      expect(isLoadRecovered(updatedDataOneMinute, _isLoadHigh)).toEqual(false);
    });

    describe(" and then it drops under 1 for 1 more minute (2 minutes total)", () => {
      const newestData = [
        { "cpu": 0.1 }, { "cpu": 0.48 }, { "cpu": 0.099 },
        { "cpu": 0.29 }, { "cpu": 0.188 }, { "cpu": 0.199 },
      ];

      const updatedDataTwoMinutes = updatedDataOneMinute.concat(newestData);

      test("CPU load should be recovered.", () => {
        expect(isLoadRecovered(updatedDataTwoMinutes, _isLoadHigh)).toEqual(true);
      });
    });
  });
});

