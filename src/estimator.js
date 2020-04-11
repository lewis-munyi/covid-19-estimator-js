// eslint-disable-next-line consistent-return
const calculateDays = (period, numberOfDays) => {
  /*
  * A function that receives the period type and integer count
  * and returns the total number of days
  * */

  if (period === 'days') {
    return numberOfDays;
  }
  if (period === 'weeks') {
    return numberOfDays * 7;
  }
  if (period === 'months') {
    return numberOfDays * 30;
  }
};

const covid19ImpactEstimator = (data) => {
  /*
  * Challenge 1
  * */

  // Output
  const output = {
    data, // the input data you got
    impact: {}, // your best case estimation
    severeImpact: {} // your severe case estimation
  };


  // Derive currently infected people
  output.impact.currentlyInfected = Math.floor(data.reportedCases * 10);

  // Derive currently infected people for the severely infected
  output.severeImpact.currentlyInfected = Math.floor(data.reportedCases * 50);

  // Calculate Number of days
  const numberOfDays = calculateDays(data.periodType, data.timeToElapse);

  // Calculate Multiplication Factor
  const factor = Math.floor(numberOfDays / 3);

  // Estimate the number of infected people x days from now
  output.impact.infectionsByRequestedTime = output.impact.currentlyInfected * (2 ** factor);

  // Estimate the number of severely infected people x days from now
  const infectionsByRequestedTime = output.severeImpact.currentlyInfected * (2 ** factor);
  output.severeImpact.infectionsByRequestedTime = infectionsByRequestedTime;

  /*
  * Challenge 2
  * */

  // Estimated number of severe positive cases that will require hospitalization to recover.
  let value1 = 0.15 * output.impact.infectionsByRequestedTime;
  let value2 = 0.15 * output.severeImpact.infectionsByRequestedTime;
  output.impact.severeCasesByRequestedTime = Math.floor(value1);
  output.severeImpact.severeCasesByRequestedTime = Math.floor(value2);

  const severeCasesByRequestedTime = output.impact.infectionsByRequestedTime;
  const impactSevereCasesByRequestedTime = output.severeImpact.infectionsByRequestedTime;

  // 35% of hospital beds are available for COVID-19 patients
  const availableBeds1 = Math.floor(0.35 * data.totalHospitalBeds);
  const availableBeds2 = Math.floor(0.35 * data.totalHospitalBeds);

  // Calculate the total number of available beds for impact & severe impact
  value1 = availableBeds1 - severeCasesByRequestedTime;
  value2 = availableBeds2 - impactSevereCasesByRequestedTime;
  output.impact.hospitalBedsByRequestedTime = value1;
  output.severeImpact.hospitalBedsByRequestedTime = value2;

  /*
  * Challenge 3
  * */

  // Estimated number of severe positive cases that will require ICU care.
  value2 = 0.05 * output.severeImpact.infectionsByRequestedTime;
  value1 = 0.05 * output.impact.infectionsByRequestedTime;
  output.impact.casesForICUByRequestedTime = value1;
  output.severeImpact.casesForICUByRequestedTime = value2;

  // Estimated number of severe positive cases that will require ventilators.
  value1 = 0.02 * output.impact.infectionsByRequestedTime;
  output.impact.casesForVentilatorsByRequestedTime = Math.floor(value1);
  value2 = 0.02 * output.severeImpact.infectionsByRequestedTime;
  output.severeImpact.casesForVentilatorsByRequestedTime = Math.floor(value2);

  // Estimate how much money the economy is likely to lose daily, over the said period of time.
  const infectionsByTime = output.impact.infectionsByRequestedTime;
  const severeInfectionsByTime = output.severeImpact.infectionsByRequestedTime;
  const dailyPop = data.region.avgDailyIncomePopulation;
  const dailyIncome = data.region.avgDailyIncomeInUSD;

  let dollarsInFlight = Math.floor((infectionsByTime * dailyPop * dailyIncome) / 30);
  output.impact.dollarsInFlight = dollarsInFlight;

  dollarsInFlight = Math.floor((severeInfectionsByTime * dailyPop * dailyIncome) / 30);
  output.severeImpact.dollarsInFlight = dollarsInFlight;

  // Return output object
  return output;
};

export default covid19ImpactEstimator;
