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
  const input = data;

  /*
  * Challenge 1
  * */

  // Output
  const output = {
    data: input, // the input data you got
    impact: {}, // your best case estimation
    severeImpact: {} // your severe case estimation
  };


  // Derive currently infected people
  output.impact.currentlyInfected = Math.floor(input.reportedCases * 10);

  // Derive currently infected people for the severely infected
  output.severeImpact.currentlyInfected = Math.floor(input.reportedCases * 50);

  // Calculate Number of days
  const numberOfDays = calculateDays(input.periodType, input.timeToElapse);

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
  let value = 0.15 * output.severeImpact.infectionsByRequestedTime;
  output.impact.severeCasesByRequestedTime = 0.15 * output.impact.infectionsByRequestedTime;
  output.severeImpact.severeCasesByRequestedTime = value;

  const severeCasesByRequestedTime = output.impact.infectionsByRequestedTime;
  const impactSevereCasesByRequestedTime = output.severeImpact.infectionsByRequestedTime;

  // 35% of hospital beds are available for COVID-19 patients
  const availableBeds = Math.floor(0.35 * input.totalHospitalBeds);

  // Calculate the total number of available beds for impact & severe impact
  value = availableBeds - impactSevereCasesByRequestedTime;
  output.impact.hospitalBedsByRequestedTime = availableBeds - severeCasesByRequestedTime;
  output.severeImpact.hospitalBedsByRequestedTime = value;

  /*
  * Challenge 3
  * */

  // Estimated number of severe positive cases that will require ICU care.
  value = 0.05 * output.severeImpact.infectionsByRequestedTime;
  output.impact.casesForICUByRequestedTime = 0.05 * output.impact.infectionsByRequestedTime;
  output.severeImpact.casesForICUByRequestedTime = value;

  // Estimated number of severe positive cases that will require ventilators.
  output.impact.casesForVentilatorsByRequestedTime = 0.02 * output.impact.infectionsByRequestedTime;
  value = 0.02 * output.severeImpact.infectionsByRequestedTime;
  output.severeImpact.casesForVentilatorsByRequestedTime = value;

  // Estimate how much money the economy is likely to lose daily, over the said period of time.
  const infectionsByTime = output.impact.infectionsByRequestedTime;
  const severeInfectionsByTime = output.severeImpact.infectionsByRequestedTime;
  const dailyPop = input.region.avgDailyIncomePopulation;
  const dailyIncome = input.region.avgDailyIncomeInUSD;

  let dollarsInFlight = Math.floor((infectionsByTime * dailyPop * dailyIncome) / 30);
  output.impact.dollarsInFlight = dollarsInFlight;

  dollarsInFlight = Math.floor((severeInfectionsByTime * dailyPop * dailyIncome) / 30);
  output.severeImpact.dollarsInFlight = dollarsInFlight;

  data = output;
  // Return output object
  return data;
};

export default covid19ImpactEstimator;
