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
  let value1 = Math.floor(0.15 * output.impact.infectionsByRequestedTime);
  let value2 = Math.floor(0.15 * output.severeImpact.infectionsByRequestedTime);
  output.impact.severeCasesByRequestedTime = value1;
  output.severeImpact.severeCasesByRequestedTime = value2;

  // 35% of hospital beds are available for COVID-19 patients
  const availableBeds = 0.35 * data.totalHospitalBeds;

  if (availableBeds - value1 < 0) {
    output.impact.hospitalBedsByRequestedTime = Math.floor(availableBeds - value1) + 1;
  } else if (availableBeds - value2 < 0) {
    output.severeImpact.hospitalBedsByRequestedTime = Math.floor(availableBeds - value2) + 1;
  } else {
    output.impact.hospitalBedsByRequestedTime = Math.floor(availableBeds - value1);
    output.severeImpact.hospitalBedsByRequestedTime = Math.floor(availableBeds - value2);
  }


  // const infectionsByRequestedTime1 = output.impact.infectionsByRequestedTime;
  // const infectionsByRequestedTime2 = output.severeImpact.infectionsByRequestedTime;
  //
  //
  //
  // // Calculate the total number of available beds for impact & severe impact
  // value1 = availableBeds - infectionsByRequestedTime1;
  // value2 = availableBeds - infectionsByRequestedTime2;
  // output.impact.hospitalBedsByRequestedTime = Math.floor(value1);
  // output.severeImpact.hospitalBedsByRequestedTime = Math.floor(value2);

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
