import React, {useState} from 'react';
import DatePicker, {registerLocale} from 'react-datepicker';
import * as weeknumber from 'weeknumber';
import ordinal from 'ordinal';
import enGB from 'date-fns/locale/en-GB';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('en-GB', enGB);

const splitAt = (index: number, x: string): string[] => [x.slice(0, index), x.slice(index)];

const App = () => {
  const [date, setDate] = useState(new Date());
  const {year, week, day} = weeknumber.weekNumberYear(date);
  const dayName = date.toLocaleString('en-US', {weekday: 'long'});
  const plus = day > 4 ? 2 : 1;
  const [yearBig, yearLittle] = splitAt(2, year.toString());
  const fixVersion = `${yearLittle}.${week + plus}`;

  return (
      <div className="App">
        <header>
          <h1>What The Fix Version?</h1>
        </header>
        <main>
          <span><strong style={{fontSize: '800%'}}>{fixVersion}</strong></span>
          <details>
            <summary>Explain...</summary>
            <p>
              The year is {yearBig}
              <mark>{yearLittle}</mark>
              and it is <mark>{ordinal(week)} week</mark>
              of the year (according to <a href="https://en.wikipedia.org/wiki/ISO_8601">ISO 8601</a>).
              It is <mark>{dayName}</mark> so we need to add <mark>{plus}</mark> to the week number.
              Hence we have <mark>{fixVersion}</mark>.
            </p>
          </details>
          or
          <details>
            <summary>Chage date...</summary>
            <DatePicker dateFormat="yyyy-MM-dd"
                        todayButton="Today!"
                        locale="en-GB"
                        inline
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        selected={date}
                        onChange={value => {
                          if (value) setDate(value)
                        }}/>
          </details>
        </main>
        <footer>
          <ul>
            <li>TBH I don't know if fix version uses ISO 8601 week numbering, it might be pure coincidence that it works for 2020w.</li>
            <li>It might not work correctly around turn of the year.</li>
            <li>There is no reason for this to be React app... but it is.</li>
            <li>It uses <a href="https://kognise.github.io/water.css/">Water.css</a> (bundled cause official CDN was
              serving some old version).
            </li>
          </ul>

        </footer>
      </div>
  );
};

export default App;
