import namor from "namor";

const range = len => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = (d) => {
  console.log("!!!!!!!!!!new person ddddddddddddd",d)
  return {
    title:   d.title,
    author:  d.author,
    date: d.date,
    body: {
        isAnswered  : d.is_answered,
        score: d.score,
        views: d.view_count,
        tags: d.tags
    },
    link: d.link
  };
};

export default function makeData(list, ...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth];
    const items = []
    range(len).map((i) => {
        if(list[i] !== undefined){
            const person = newPerson(list[i]);
                items.push({
                    ...person,
                    subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined
            })
      };
      return 0;
    });
    return items;
  };

  return makeDataLevel();
}
