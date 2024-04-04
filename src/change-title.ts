const path = window.location.pathname.replace(/^\/(s|ct)\//, "");

type MaybeFunction<T> = T | (() => T);
type MaybeArray<T> = T | T[];

type TitleSegment = string | false | undefined | null;
type Title = MaybeFunction<MaybeArray<TitleSegment>>;

type Rule = RegExp | string;

const titleRules: [Rule, Title][] = [
  ["home", "マイページ"],
  ["home_course", "コース"],
  ["home_announcement", "お知らせ"],
  ["home_announcement_list", "個人宛のお知らせ"],
  [
    "home_announcement_publist",
    () => [
      document.querySelector<HTMLElement>(".infolist-tab .current")?.innerText,
      "その他大学からのお知らせ",
    ],
  ],
  ["home_coursetable", "ポートフォリオ"],
  [
    /^course_\d+$/,
    () => [
      document.querySelector<HTMLElement>("#coursename")?.innerText,
      "コース",
    ],
  ],
  [
    /^course_\d+_.+$/,
    () => [
      document.querySelector<HTMLElement>("#coursename")?.innerText,
      "コース",
    ],
  ],
  //雑に付け足し
  [
    /^course_\d+_.+$_query/,
    () => [
      "小テスト",
      document.querySelector<HTMLElement>("#coursename")?.innerText,
      "コース",
    ],
  ],
  //↓今のところないから構造が分からない
  [
    /^course_\d+_.+$_query_.+$/,
    () => [
      "小テスト",
      document.querySelector<HTMLElement>("#coursename")?.innerText,
      "コース",
    ],
  ],
  [
    /^course_\d+_.+$_survey/,
    () => [
      "アンケート",
      document.querySelector<HTMLElement>("#coursename")?.innerText,
      "コース",
    ],
  ],
  [
    /^course_\d+_.+$_survey_.+$/,
    () => [
      //Xpathでごり押し
      (document.evaluate("/html/body/div[3]/div[2]/div/div[3]/div/table/tbody/tr[1]/th", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue as HTMLElement)?.innerText,
      "アンケート",
      document.querySelector<HTMLElement>("#coursename")?.innerText,
      "コース",
    ],
  ],
  [
    /^course_\d+_.+$_survey_.+$_.*/,
    () => [
      //Xpathでごり押し
      (document.evaluate("/html/body/div[3]/div[2]/div/div[3]/form/div/div/div[3]/table/tbody/tr[1]/th", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue as HTMLElement)?.innerText,
      "アンケート",
      document.querySelector<HTMLElement>("#coursename")?.innerText,
      "コース",
    ],
  ],
  [
    /^course_\d+_.+$_report/,
    () => [
      "レポート",
      document.querySelector<HTMLElement>("#coursename")?.innerText,
      "コース",
    ],
  ],
  //↓今のところないから構造が分からない
  [
    /^course_\d+_.+$_report_.+$/,
    () => [
      "レポート",
      document.querySelector<HTMLElement>("#coursename")?.innerText,
      "コース",
    ],
  ],
  [
    /^course_\d+_.+$_project/,
    () => [
      "プロジェクト",
      document.querySelector<HTMLElement>("#coursename")?.innerText,
      "コース",
    ],
  ],
  //↓今のところないから構造が分からない
  [
    /^course_\d+_.+$_project_.+$/,
    () => [
      "プロジェクト",
      document.querySelector<HTMLElement>("#coursename")?.innerText,
      "コース",
    ],
  ],
  [
    /^course_\d+_.+$_grade/,
    () => [
      "成績",
      document.querySelector<HTMLElement>("#coursename")?.innerText,
      "コース",
    ],
  ],
  //↓今のところないから構造が分からない
  [
    /^course_\d+_.+$_grade_.+$/,
    () => [
      "成績",
      document.querySelector<HTMLElement>("#coursename")?.innerText,
      "コース",
    ],
  ],
  [
    /^course_\d+_.+$_topics/,
    () => [
      "掲示板",
      document.querySelector<HTMLElement>("#coursename")?.innerText,
      "コース",
    ],
  ],
  //↓今のところないから構造が分からない
  [
    /^course_\d+_.+$_topics_.+$/,
    () => [
      "掲示板",
      document.querySelector<HTMLElement>("#coursename")?.innerText,
      "コース",
    ],
  ],
  [
    /^course_\d+_.+$_page/,
    () => [
      "教材",
      document.querySelector<HTMLElement>("#coursename")?.innerText,
      "コース",
    ],
  ],
  //↓今のところないから構造が分からない
  [
    /page_.+$/,
    () => [
      (document.evaluate("/html/body/div[3]/div[2]/div[3]/div/div/div[1]/div/h1/a", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue as HTMLElement)?.innerText,
      "教材",
      document.querySelector<HTMLElement>("#coursename")?.innerText,
      "コース",
    ],
  ],
  //秘伝のタレここまで
  [
    "syllabus__search",
    () => {
      const query = document.querySelector<HTMLInputElement>(
        "input#target_word_search"
      )?.value;
      return [query && `"${query}"`, "シラバス検索"];
    },
  ],
  [
    /^syllabus_\d+$/,
    () => [
      document.querySelector<HTMLElement>(
        "#container > div.pagebody > div > div > div > table > tbody > tr:nth-child(2) > td:nth-child(1)"
      )?.innerText,
      "シラバス",
    ],
  ],
];

const unwrapFunction = <T>(maybeFunction: MaybeFunction<T>): T => {
  if (maybeFunction instanceof Function) {
    return maybeFunction();
  }

  return maybeFunction;
};

const wrapToArray = <T>(maybeArray: MaybeArray<T>): T[] => {
  if (Array.isArray(maybeArray)) {
    return maybeArray;
  }

  return [maybeArray];
};

const title = titleRules.find(([rule]) => {
  if (typeof rule === "string") {
    return path === rule;
  }

  return rule.test(path);
})?.[1];

if (title !== undefined) {
  document.title = [
    ...wrapToArray(unwrapFunction(title)).filter((v) => v),
    "manaba",
  ].join(" - ");
}
