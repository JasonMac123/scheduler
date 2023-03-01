import { reducer } from "reducers/application";

describe("Application Reducer", () => {
  it("thows an error with an unsupported type", () => {
    expect(() => reducer({"hi":"hello"}, { type: null })).toThrowError(
      /tried to reduce with unsupported action type/i
    );
  });
});