import { List } from "immutable";
import { range } from "ramda";

const store = {
  record: [],
  append(channel_id: string, data) {
    this.record.push(channel_id);
  },
};

it("should only append messages", () => {
  // expect(list.getSize()).toBe(5);
  const list = List<number>(range(0, 1000));
  const list2 = List([5, 4, 3, 2, 1]);

  const iterator = list2.concat(list).toArray();

  for (const b of iterator) {
    console.log({ b });
  }

  // for (const value of range(0, 1000)) {
  //   list.append(value);
  // }
});
