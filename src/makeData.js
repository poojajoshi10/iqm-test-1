import namor from "namor";

const range = len => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = (d) => {
  return {
    title:   d.title,
    author:  d.owner.display_name,
    date: d.creation_date,
  };
};

export default function makeData(list, ...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth];
    const items = []
    console.log(list);
    range(len).map((i) => {
        if(list[i]){
            items.push({
                ...newPerson(list[i]),
                subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined
        })
      };
      return 0;
    });
    return items;
  };

  return makeDataLevel();
}
