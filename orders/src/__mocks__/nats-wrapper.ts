// To mock the natsWrapper. Refer lecture 349***
export const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation(
        (subjects: string, data: string, callback: () => void) => {
          callback();
        }
      )
  }
};