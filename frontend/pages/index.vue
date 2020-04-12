<template>
  <div>
    <p class="title">Build for SDG Challenge 2020</p>
    <div class="cont">
      <div class="form sign-in">
        <h2>At home, Not Alone</h2>
        <label>
          <span>Population</span>
          <input v-model="form.population" data-population="" placeholder="Enter size of the population" type="text" />
        </label>
        <label>
          <span>Period type</span> <br>
          <select v-model="form.periodType" data-period-type="" type="text">
            <option value="days">Days</option>
            <option value="weeks">Weeks</option>
            <option value="months">Months</option>
          </select>
        </label>
        <label>
          <span>Time to Elapse</span>
          <input type="text" v-model="form.timeToElapse" data-time-to-elapse="" placeholder="Enter unit time" />
        </label>
        <label>
          <span>Reported Cases</span>
          <input type="text" v-model="form.reportedCases" data-reported-cases="" placeholder="Reported cases" />
        </label>
        <label>
          <span>Total Hospital beds</span>
          <input type="text" v-model="form.totalHospitalBeds" data-total-hospital-beds=""
            placeholder="Enter number of hospital beds" />
        </label>
        <br><br>
        <div class="img__btn btn-1" @click="covid19ImpactEstimator(form)">
            <button type="button" class="" hidden id="submit" data-go-estimate="">Submit</button>
            <span class="m--up" id="submit">Submit</span>
          </div>
      </div>
      <div class="sub-cont">
        <div class="img">
          <div class="img__text m--up">
            <h2></h2>
            <p></p>
          </div>
          <div class="img__text m--in">
          </div>
        </div>
        <div class="form sign-up">
          <h2>Results:</h2>
          <section v-if="values !== null">
            <h2>Impact</h2>
            <p>Currently infected: <i class="results">{{ values.impact.currentlyInfected }}</i></p>
            <p>Infections by requested time: <i class="results">{{ values.impact.infectionsByRequestedTime }}</i></p>
            <p>Severe Cases by the requested time: <i class="results">{{ values.impact.severeCasesByRequestedTime }}</i>
            </p>
            <p>Hospital bed by the requested time: <i
                class="results">{{ values.impact.hospitalBedsByRequestedTime }}</i></p>
            <p>ICU cases: <i class="results">{{ values.impact.casesForICUByRequestedTime }}</i></p>
            <p>Cases that need ventilators: <i
                class="results">{{ values.impact.casesForVentilatorsByRequestedTime }}</i></p>
            <p>Money lost: <i class="results">${{ values.impact.dollarsInFlight }}</i></p>
            <br><br>
            <h2>Severe impact</h2>
            <p>Currently infected: <i class="results">{{ values.severeImpact.currentlyInfected }}</i></p>
            <p>Infections by requested time: <i class="results">{{ values.severeImpact.infectionsByRequestedTime }}</i>
            </p>
            <p>Severe Cases by the requested time: <i
                class="results">{{ values.severeImpact.severeCasesByRequestedTime }}</i></p>
            <p>Hospital bed by the requested time: <i
                class="results">{{ values.severeImpact.hospitalBedsByRequestedTime }}</i></p>
            <p>ICU cases: <i class="results">{{ values.severeImpact.casesForICUByRequestedTime }}</i></p>
            <p>Cases that need ventilators: <i>{{ values.severeImpact.casesForVentilatorsByRequestedTime }}</i></p>
            <p>Money lost: <i class="results">${{ values.severeImpact.dollarsInFlight }}</i></p>
          </section>
          <section v-else>
            <i class="results">Please fill out all the form fields in the previous section and hit submit</i>
          </section>
          <div class="img__btn btn-2">
            <span class="m--in">Back</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        values: null,
        form: {
          region: {
            name: "Africa",
            avgAge: 19.7,
            avgDailyIncomeInUSD: 5,
            avgDailyIncomePopulation: 0.71
          },
          periodType: "days",
          timeToElapse: 58,
          reportedCases: 674,
          population: 66622705,
          totalHospitalBeds: 1380614
        }
      }
    },
    methods: {
      covid19ImpactEstimator(data) {
        /*
         * Challenge 1
         * */

        // Output
        let output = {
          data, // the input data you got
          impact: {}, // your best case estimation
          severeImpact: {} // your severe case estimation
        };

        // Derive currently infected people
        output.impact.currentlyInfected = Math.floor(data.reportedCases * 10);

        // Derive currently infected people for the severely infected
        output.severeImpact.currentlyInfected = Math.floor(data.reportedCases * 50);

        // Calculate Number of days
        // const numberOfDays = this.calculateDays(data.periodType, data.timeToElapse);
        let numberOfDays;
        if (data.periodType === 'days') {
          numberOfDays = data.timeToElapse;
        }
        if (data.periodType === 'weeks') {
          numberOfDays = data.timeToElapse * 7;
        }
        if (data.periodType === 'months') {
          numberOfDays = data.timeToElapse * 30;
        }

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
        const value1 = Math.trunc(0.15 * output.impact.infectionsByRequestedTime);
        const value2 = Math.trunc(0.15 * output.severeImpact.infectionsByRequestedTime);
        output.impact.severeCasesByRequestedTime = value1;
        output.severeImpact.severeCasesByRequestedTime = value2;

        // 35% of hospital beds are available for COVID-19 patients
        const availableBeds = Math.trunc(0.35 * data.totalHospitalBeds);

        output.impact.hospitalBedsByRequestedTime = Math.trunc(availableBeds - value1);
        output.severeImpact.hospitalBedsByRequestedTime = Math.trunc(availableBeds - value2);

        /*
         * Challenge 3
         * */

        // Estimated number of severe positive cases that will require ICU care.
        const x1 = 0.05 * output.impact.infectionsByRequestedTime;
        const x2 = 0.05 * output.severeImpact.infectionsByRequestedTime;
        output.impact.casesForICUByRequestedTime = x1;
        output.severeImpact.casesForICUByRequestedTime = x2;

        // Estimated number of severe positive cases that will require ventilators.
        const y1 = 0.02 * output.impact.infectionsByRequestedTime;
        const y2 = 0.02 * output.severeImpact.infectionsByRequestedTime;
        output.impact.casesForVentilatorsByRequestedTime = Math.trunc(y1);
        output.severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(y2);

        // Estimate how much money the economy is likely to lose daily, over the said period of time.
        const z1 = output.impact.infectionsByRequestedTime;
        const z2 = output.severeImpact.infectionsByRequestedTime;
        const dailyPop = data.region.avgDailyIncomePopulation;
        const dailyIncome = data.region.avgDailyIncomeInUSD;


        output.impact.dollarsInFlight = Math.trunc((z1 * dailyPop * dailyIncome) / numberOfDays);

        output.severeImpact.dollarsInFlight = Math.trunc((z2 * dailyPop * dailyIncome) / numberOfDays);

        // Return output object
        this.values = output;
        console.log(output);


      }
    },
    mounted() {
      var _this = this;
      document.querySelector('.btn-1').addEventListener('click', function () {
        document.querySelector('.cont').classList.toggle('s--signup');
      });
      document.querySelector('.btn-2').addEventListener('click', function () {
        document.querySelector('.cont').classList.toggle('s--signup');
      });
    },
  }

</script>

<style lang="scss">
  *,
  *:before,
  *:after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Lato', sans-serif;
    color: white;
    background-color: teal;
  }

  input[type=text] {
    width: 100%;
    padding: 10px;
    border: 1px solid #121212;
    font-size: 15px;
    background-color: whitesmoke;
    color: #2b2b2b;
  }

  button {
    border: none;
    outline: none;
    background: none;
    font-family: 'Open Sans', Helvetica, Arial, sans-serif;
  }

  $contW: 900px;
  $imgW: 260px;
  $formW: $contW - $imgW;
  $switchAT: 1.2s;

  $inputW: 400px;
  $btnH: 36px;

  $diffRatio: ($contW - $imgW) / $contW;

  @mixin signUpActive {
    .cont.s--signup & {
      @content;
    }
  }

  .title {
    font-size: 20px;
    margin: 40px auto 50px;
    text-align: center;
  }

  .cont {
    overflow: hidden;
    position: relative;
    width: $contW;
    height: 700px;
    margin: 0 auto 100px;
    background: #fff;
  }

  .form {
    position: relative;
    width: $formW;
    height: 100%;
    transition: transform $switchAT ease-in-out;
    padding: 50px 30px 0;
    background: #2B2B2B;
  }

  .sub-cont {
    overflow: hidden;
    position: absolute;
    left: $formW;
    top: 0;
    width: $contW;
    height: 100%;
    padding-left: $imgW;
    background: #fff;
    transition: transform $switchAT ease-in-out;

    @include signUpActive {
      transform: translate3d($formW * -1, 0, 0);
    }
  }

  button {
    display: block;
    margin: 0 auto;
    width: $inputW;
    height: $btnH;
    border-radius: 30px;
    color: #fff;
    font-size: 15px;
    cursor: pointer;
  }

  .img {
    overflow: hidden;
    z-index: 2;
    position: absolute;
    left: 0;
    top: 0;
    width: $imgW;
    height: 100%;
    padding-top: 360px;

    &:before {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      width: $contW;
      height: 100%;
      background-image: url("/covid2.webp");
      background-size: cover;
      transition: transform $switchAT ease-in-out;
    }

    &:after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
    }

    @include signUpActive {
      &:before {
        transform: translate3d($formW, 0, 0);
      }
    }

    &__text {
      z-index: 2;
      position: absolute;
      left: 0;
      top: 50px;
      width: 100%;
      padding: 0 20px;
      text-align: center;
      color: #fff;
      transition: transform $switchAT ease-in-out;

      h2 {
        margin-bottom: 10px;
        font-weight: normal;
      }

      p {
        font-size: 14px;
        line-height: 1.5;
      }

      &.m--up {

        @include signUpActive {
          transform: translateX($imgW*2);
        }
      }

      &.m--in {
        transform: translateX($imgW * -2);

        @include signUpActive {
          transform: translateX(0);
        }
      }
    }

    &__btn {
      overflow: hidden;
      z-index: 2;
      position: relative;
      width: 100px;
      height: $btnH;
      margin: 0 auto;
      background: transparent;
      color: #fff;
      text-transform: uppercase;
      font-size: 15px;
      cursor: pointer;

      &:after {
        content: '';
        z-index: 2;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border: 2px solid #fff;
        border-radius: 30px;
      }

      span {
        position: absolute;
        left: 0;
        top: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        transition: transform $switchAT;

        &.m--in {
          transform: translateY($btnH*-2);

          @include signUpActive {
            transform: translateY(0);
          }
        }

        &.m--up {
          @include signUpActive {
            transform: translateY($btnH*2);
          }
        }
      }
    }
  }

  h2 {
    width: 100%;
    font-size: 26px;
    text-align: center;
  }

  label {
    display: block;
    width: $inputW;
    margin: 25px auto 0;
    text-align: center;

    span {
      font-size: 12px;
      color: #cfcfcf;
      text-transform: uppercase;
    }
  }

  input {
    display: block;
    width: 100%;
    margin-top: 5px;
    padding-bottom: 5px;
    font-size: 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.4);
    text-align: center;
  }

  .forgot-pass {
    margin-top: 15px;
    text-align: center;
    font-size: 12px;
    color: #cfcfcf;
  }

  .submit {
    margin-top: 40px;
    margin-bottom: 20px;
    background: #d4af7a;
    text-transform: uppercase;
  }

  .fb-btn {
    border: 2px solid #d3dae9;
    color: darken(#d3dae9, 20%);

    span {
      font-weight: bold;
      color: darken(#768cb6, 20%);
    }
  }

  .sign-in {
    transition-timing-function: ease-out;

    @include signUpActive {
      transition-timing-function: ease-in-out;
      transition-duration: $switchAT;
      transform: translate3d($formW, 0, 0);
    }
  }

  .sign-up {
    transform: translate3d($contW * -1, 0, 0);

    @include signUpActive {
      transform: translate3d(0, 0, 0);
    }
  }

  .icon-link {
    position: absolute;
    left: 5px;
    bottom: 5px;
    width: 32px;

    img {
      width: 100%;
      vertical-align: top;
    }

    &--twitter {
      left: auto;
      right: 5px;
    }
  }

  section {
    padding: 2rem;
    box-sizing: border-box;

    p {
      font-family: 'Comfortaa', cursive;
      color: #ffffff;
      font-size: 20px;
      i {
        color: #ff5252;
      }
    }
  }

  span {
    cursor: pointer;
  }

</style>
