import { calculateInvestmentResults, formatter } from '../util/investment';

function Results({ data }) {
  const results = calculateInvestmentResults(data);
  let totalInterest = 0;
  console.log(results);
  return (
    <table id="result">
      <thead>
        <tr>
          <th>Year</th>
          <th>Investment Value</th>
          <th>Interest (year)</th>
          <th>Total Interest</th>
          <th>Invested Capital</th>
        </tr>
      </thead>
      <tbody>
        {results.map((yearData) => {
          totalInterest += yearData.interest;
          const totalAmountInvested =
            data.initialInvestment + yearData.annualInvestment * yearData.year;
          return (
            <tr key={yearData.year}>
              <td>{formatter.format(yearData.year)}</td>
              <td>{formatter.format(yearData.valueEndOfYear)}</td>
              <td>{formatter.format(yearData.interest)}</td>
              <td>{formatter.format(totalInterest)}</td>
              <td>{formatter.format(totalAmountInvested)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Results;
