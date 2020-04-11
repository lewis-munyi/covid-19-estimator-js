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

  // Output object
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
  output.severeImpact.infectionsByRequestedTime = output.severeImpact.currentlyInfected * (2 ** factor);

  /*
  * Challenge 2
  * */

  // Estimated number of severe positive cases that will require hospitalization to recover.
  output.impact.severeCasesByRequestedTime = 0.15 * output.impact.infectionsByRequestedTime;
  output.severeImpact.severeCasesByRequestedTime = 0.15 * output.severeImpact.infectionsByRequestedTime;

  const severeCasesByRequestedTime = output.impact.infectionsByRequestedTime;
  const impactSevereCasesByRequestedTime = output.severeImpact.infectionsByRequestedTime;

  // 35% of hospital beds are available for COVID-19 patients
  const availableBeds = Math.floor(0.35 * data.totalHospitalBeds);

  // Calculate the total number of available beds for impact & severe impact
  output.impact.hospitalBedsByRequestedTime = availableBeds - severeCasesByRequestedTime;
  output.severeImpact.hospitalBedsByRequestedTime = availableBeds - impactSevereCasesByRequestedTime;

  /*
  * Challenge 3
  * */

  // Estimated number of severe positive cases that will require ICU care.
  output.impact.casesForICUByRequestedTime = 0.05 * output.impact.infectionsByRequestedTime;
  output.severeImpact.casesForICUByRequestedTime = 0.05 * output.severeImpact.infectionsByRequestedTime;

  // Estimated number of severe positive cases that will require ventilators.
  output.impact.casesForVentilatorsByRequestedTime = 0.02 * output.impact.infectionsByRequestedTime;
  output.severeImpact.casesForVentilatorsByRequestedTime = 0.02 * output.severeImpact.infectionsByRequestedTime;

  // Estimate how much money the economy is likely to lose daily, over the said period of time.
  output.impact.dollarsInFlight = Math.floor((output.impact.infectionsByRequestedTime * data.region.avgDailyIncomePopulation * data.region.avgDailyIncomeInUSD) / 30);
  output.severeImpact.dollarsInFlight = Math.floor((output.severeImpact.infectionsByRequestedTime * data.region.avgDailyIncomePopulation * data.region.avgDailyIncomeInUSD) / 30);

  // Return output object
  return output;
};


export default covid19ImpactEstimator;
