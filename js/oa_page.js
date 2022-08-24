let backBtn = document.getElementById("back-btn");
let meetingStartDate = document.getElementById("start-date");
let coundown = document.getElementById("count-down");

function getUrlQuery() {
  let valuesReg = /([\w]*)=([\w\.\%\+\-]*)/gi;
  let dictStr = "";
  let keyValaueList = window.location.href.match(valuesReg);

  keyValaueList.forEach((item, index) => {
    let keyPair = item.split("=");
    value = keyPair[1].replace(/%2E/g, ".").replace(/%20/g, " ");

    dictStr += `"${keyPair[0]}":"${value}",`;
  });
  let valueAns = JSON.parse("{" + dictStr.replace(/,$/g, "") + "}");
  return valueAns;
}

window.addEventListener("load", () => {
  console.log(getUrlQuery());
  let mt = new Date(parseInt(getUrlQuery().mt));

  function mtGetHours() {
    if (mt.getHours() == 12) {
      return { h: mt.getHours(), amPM: "PM" };
    } else if (mt.getHours() > 12) {
      let h = mt.getHours() % 12;
      return {
        h: h < 10 ? "0" + h : h,
        amPM: "PM",
      };
    } else {
      return {
        h: mt.getHours() < 10 ? "0" + mt.getHours() : mt.getHours(),
        amPM: "AM",
      };
    }
  }

  meetingStartDate.innerText = `Meeting Starting at ${mt.getDate()}-${
    mt.getMonth() + 1
  }-${mt.getFullYear()} ${mtGetHours().h}:${mt.getMinutes()}${
    mtGetHours().amPM
  }`;
  coutdown();
  //   window.open("https://oceanacademy.co.in/", "_self");
});

let ct = new Date(Date.now());
let mt = new Date(parseInt(getUrlQuery().mt));

function coutdown() {
  let mTime = new Date(parseInt(getUrlQuery().mt));
  let countD = {};

  let intVell = setInterval(() => {
    let ct = new Date(Date.now());

    let totlaSec = (mTime - ct) / 1000;

    let sec = Math.floor(totlaSec % 60);
    let totalMinute = Math.floor(totlaSec / 60);
    let minute = totalMinute % 60;

    let totalHours = Math.floor(totalMinute / 60);
    let hours = totalHours % 24;

    let totalDay = Math.floor(totalHours / 24);
    let day = totalDay % 30;

    let totalMonth = Math.floor(totalDay / 30);
    let month = totalMonth % 12;

    let totalYear = Math.floor(totalMonth / 12);

    countD = {
      sec: sec,
      minute: minute,
      hours: hours,
      day: day,
      month: month,
      year: totalYear,
    };

    coundown.innerText = couterText(countD);

    // if (totlaSec < -1800) {
    //   clearInterval(intVell);
    //   alert("Invalid url");
    //   window.top.location.href = "https://oceanacademy.co.in/";
    // } else if (totlaSec < 300) {
    //   history.back();
    // }
  }, 1000);
}

function couterText(countD) {
  if (countD.year <= 0 && countD.month <= 0 && countD.day <= 0) {
    return `${countD.hours < 10 ? "0" + countD.hours : countD.hours}H : ${
      countD.minute < 10 ? "0" + countD.minute : countD.minute
    }M : ${countD.sec < 10 ? "0" + countD.sec : countD.sec}S`;
  } else if (countD.year <= 0 && countD.month <= 0) {
    return `${countD.day < 10 ? "0" + countD.day : countD.day}D : ${
      countD.hours < 10 ? "0" + countD.hours : countD.hours
    }H : ${countD.minute < 10 ? "0" + countD.minute : countD.minute}M`;
  } else if (countD.year <= 0) {
    return `${countD.month < 10 ? "0" + countD.month : countD.month}M : ${
      countD.day < 10 ? "0" + countD.day : countD.day
    }D : ${countD.hours < 10 ? "0" + countD.hours : countD.hours}H`;
  } else {
    `${countD.year < 10 ? "0" + countD.year : countD.year}Y : ${
      countD.month < 10 ? "0" + countD.month : countD.month
    }M : ${countD.day < 10 ? "0" + countD.day : countD.day}D`;
  }
}

backBtn.addEventListener("click", () => {
  window.top.location.href = "https://oceanacademy.co.in/";
});
