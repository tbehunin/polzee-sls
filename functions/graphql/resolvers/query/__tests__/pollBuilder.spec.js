import pollBuilder from '../pollBuilder';

describe('pollBuilder', () => {
  let poll;
  let currentUserId;
  let vote;
  let actual;
  describe('when poll is falsy', () => {
    test.todo('it should return null');
  });
  describe('when poll has invalid data', () => {
    describe('when userId is falsy', () => {
      //
    });
    describe('when pollId is falsy', () => {
      //
    });
  });
  describe('when poll has valid data', () => {
    beforeEach(() => {
      poll = {
        userId: 'user1',
        pollId: 'poll1',
        choices: [
          { order: 1, acceptable: false },
          { order: 2, acceptable: true },
          { order: 3, acceptable: false },
        ],
      };
    });
    describe('when currentUserId is falsy', () => {
      beforeEach(() => {
        currentUserId = undefined;
      });
      test.todo('acceptable should be undefined for each choice');
      test.todo('selected should be undefined for each choice');
    });
    describe('when current user is the author of the poll', () => {
      beforeEach(() => {
        currentUserId = 'user1';
      });
      describe('and voted on it', () => {
        beforeEach(() => {
          vote = {
            userId: 'user1',
            pollId: 'poll1',
            selection: [1, 3],
          };
          actual = pollBuilder(poll, currentUserId).withUserVote(vote).build();
        });
        test('acceptable should be either true or false (not be undefined) for each choice', () => {
          expect(actual.choices.map((c) => c.acceptable)).toEqual([false, true, false]);
        });
        test('selected should be either true or false (not be undefined) matching the vote for each choice', () => {
          expect(actual.choices.map((c) => c.selected)).toEqual([true, false, true]);
        });
      });
      describe('and vote is falsy', () => {
        beforeEach(() => {
          vote = undefined;
          actual = pollBuilder(poll, currentUserId).withUserVote(vote).build();
        });
        test('acceptable should be either true or false (not be undefined) for each choice', () => {
          expect(actual.choices.map((c) => c.acceptable)).toEqual([false, true, false]);
        });
        test('selected should be undefined for each choice', () => {
          expect(actual.choices.map((c) => c.selected)).toEqual([undefined, undefined, undefined]);
        });
      });
      describe('and vote is not tied to poll', () => {
        beforeEach(() => {
          vote = {
            userId: 'user1',
            pollId: 'someOtherPoll',
            selection: [1, 3],
          };
          actual = pollBuilder(poll, currentUserId).withUserVote(vote).build();
        });
        test('acceptable should be either true or false (not be undefined) for each choice', () => {
          expect(actual.choices.map((c) => c.acceptable)).toEqual([false, true, false]);
        });
        test('selected should be undefined for each choice', () => {
          expect(actual.choices.map((c) => c.selected)).toEqual([undefined, undefined, undefined]);
        });
      });
    });
    describe('when current user is NOT the author of the poll', () => {
      beforeEach(() => {
        currentUserId = 'someOtherUser';
      });
      describe('and voted on it', () => {
        beforeEach(() => {
          vote = {
            userId: 'someOtherUser',
            pollId: 'poll1',
            selection: [1, 3],
          };
          actual = pollBuilder(poll, currentUserId).withUserVote(vote).build();
        });
        test('acceptable should be either true or false (not be undefined) for each choice', () => {
          expect(actual.choices.map((c) => c.acceptable)).toEqual([false, true, false]);
        });
        test('selected should be either true or false (not be undefined) matching the vote for each choice', () => {
          expect(actual.choices.map((c) => c.selected)).toEqual([true, false, true]);
        });
      });
      describe('and vote is falsy', () => {
        beforeEach(() => {
          vote = undefined;
        });
        describe('when the poll has expired', () => {
          beforeEach(() => {
            poll = { ...poll, expireTimestamp: 0 };
            actual = pollBuilder(poll, currentUserId).withUserVote(vote).build();
          });
          test('acceptable should be either true or false (not be undefined) for each choice', () => {
            expect(actual.choices.map((c) => c.acceptable)).toEqual([false, true, false]);
          });
          test('selected should be undefined for each choice', () => {
            expect(actual.choices.map((c) => c.selected)).toEqual([undefined, undefined, undefined]);
          });
        });
        describe('when the poll has NOT expired', () => {
          beforeEach(() => {
            poll = { ...poll, expireTimestamp: Number.MAX_VALUE };
            actual = pollBuilder(poll, currentUserId).withUserVote(vote).build();
          });
          test('acceptable should be undefined for each choice', () => {
            expect(actual.choices.map((c) => c.acceptable)).toEqual([undefined, undefined, undefined]);
          });
          test('selected should be undefined for each choice', () => {
            expect(actual.choices.map((c) => c.selected)).toEqual([undefined, undefined, undefined]);
          });
        });
      });
      describe('and vote is not tied to poll', () => {
        beforeEach(() => {
          vote = {
            userId: 'someOtherUser',
            pollId: 'someOtherPoll',
            selection: [1, 3],
          };
        });
        describe('when the poll has expired', () => {
          beforeEach(() => {
            poll = { ...poll, expireTimestamp: 0 };
            actual = pollBuilder(poll, currentUserId).withUserVote(vote).build();
          });
          test('acceptable should be either true or false (not be undefined) for each choice', () => {
            expect(actual.choices.map((c) => c.acceptable)).toEqual([false, true, false]);
          });
          test('selected should be undefined for each choice', () => {
            expect(actual.choices.map((c) => c.selected)).toEqual([undefined, undefined, undefined]);
          });
        });
        describe('when the poll has NOT expired', () => {
          beforeEach(() => {
            poll = { ...poll, expireTimestamp: Number.MAX_VALUE };
            actual = pollBuilder(poll, currentUserId).withUserVote(vote).build();
          });
          test('acceptable should be undefined for each choice', () => {
            expect(actual.choices.map((c) => c.acceptable)).toEqual([undefined, undefined, undefined]);
          });
          test('selected should be undefined for each choice', () => {
            expect(actual.choices.map((c) => c.selected)).toEqual([undefined, undefined, undefined]);
          });
        });
      });
    });
  });
});
