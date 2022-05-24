import enGB from "date-fns/locale/en-GB";
import ForkMeOnGithub from "fork-me-on-github";
import ordinal from "ordinal";
import { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as weeknumber from "weeknumber";
import { skipped } from "./skipped";

registerLocale("en-GB", enGB);

type FixVersionData = { fixVersion: string; plus: number; skipReason?: string };

const splitAt = (index: number, x: string): string[] => [
  x.slice(0, index),
  x.slice(index),
];

const getSkipReason = (version: string): string | undefined => {
  return skipped.find((it) => it.version === version)?.reason;
};

const getFixVersionData = (
  yearLittle: string,
  week: number,
  plus: number
): FixVersionData => {
  const fixVersion = `${yearLittle}.${week + plus}`;
  return {
    fixVersion,
    plus,
    skipReason: getSkipReason(fixVersion),
  };
};

const getFixVersionsData = (
  yearLittle: string,
  week: number,
  day: number
): FixVersionData[] => {
  const plusOne = getFixVersionData(yearLittle, week, 1);
  const plusTwo = getFixVersionData(yearLittle, week, 2);
  if (day === 4) {
    return [plusOne, plusTwo];
  } else {
    return [day > 4 ? plusTwo : plusOne];
  }
};

const isoLink = <a href="https://en.wikipedia.org/wiki/ISO_8601">ISO 8601</a>;

const FixVersion = (props: FixVersionData) => {
  return props.skipReason ? (
    <span
      style={{ textDecoration: "line-through" }}
      title={`Skipped: ${props.skipReason}`}
    >
      {props.fixVersion}
    </span>
  ) : (
    <>{props.fixVersion}</>
  );
};

const FixVersions = ({ fixVersions }: { fixVersions: FixVersionData[] }) => {
  return (
    <>
      {fixVersions.map((fixVersion, index, array) => {
        const last = index === array.length - 1;
        return last ? (
          <FixVersion {...fixVersion}></FixVersion>
        ) : (
          <>
            <FixVersion {...fixVersion}></FixVersion> or{" "}
          </>
        );
      })}
    </>
  );
};

const App = () => {
  const [date, setDate] = useState(new Date());
  const { year, week, day } = weeknumber.weekNumberYear(date);
  const dayName = date.toLocaleString("en-US", { weekday: "long" });
  const [yearBig, yearLittle] = splitAt(2, year.toString());
  const fixVersions = getFixVersionsData(yearLittle, week, day);
  const plus = fixVersions.map(({ plus }) => plus).join(" or ");
  const thursdayExplain =
    "(Thursdays are tricky, there is release to staging on Thursday, check if the release was done already)";
  return (
    <div className="App">
      <header>
        <h1>What The Fix Version?</h1>
      </header>
      <main>
        <span>
          <strong style={{ fontSize: "800%" }}>
            <FixVersions fixVersions={fixVersions}></FixVersions>
          </strong>
        </span>
        <details>
          <summary>Explain...</summary>
          <p>
            The year is {yearBig}
            <mark>{yearLittle}</mark> and it is{" "}
            <mark>{ordinal(week)} week</mark> of the year (according to{" "}
            {isoLink}). It is <mark>{dayName}</mark>{" "}
            {day === 4 ? thursdayExplain : ""} so we need to add{" "}
            <mark>{plus}</mark> to the week number. Hence we have{" "}
            <mark>
              <FixVersions fixVersions={fixVersions}></FixVersions>
            </mark>
            .
          </p>
        </details>
        or
        <details>
          <summary>Chage date...</summary>
          <DatePicker
            dateFormat="yyyy-MM-dd"
            todayButton="Today!"
            locale="en-GB"
            inline
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            selected={date}
            onChange={(value) => {
              if (value) setDate(value);
            }}
          />
        </details>
      </main>
      <footer>
        <ul>
          <li>
            TBH I don't know if fix version uses {isoLink} week numbering, it
            might be pure coincidence that it worked for 2020-22 so far.
          </li>
          <li>
            <del>It might not work correctly</del>
            It definitely works incorrectly around turn of the year.
          </li>
          <li>
            There is no reason for this to be React (Preact in fact) app... but
            it is.
          </li>
          <li>
            It uses <a href="https://kognise.github.io/water.css/">Water.css</a>
            .
          </li>
        </ul>
      </footer>

      <ForkMeOnGithub
        className="fork-me-on-github"
        repo="https://github.com/elohhim/wtfv"
      />
      <style>{`.fork-me-on-github > svg {
        fill: var(--background) !important;
        color: var(--text-main) !important;
        }`}</style>
    </div>
  );
};

export default App;
