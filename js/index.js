window.addEventListener("DOMContentLoaded", function (event) {
  console.log("DOM fully loaded and parsed");
  websdkready();
});

function websdkready() {
  var testTool = window.testTool;

  console.log(testTool);
  console.log(window.location.pathname);

  if (!window.location.search) {
    // window.top.location.href = "https://oceanacademy.co.in/";
  }
  console.log("======================");
  if (testTool.isMobileDevice()) {
    vConsole = new VConsole();
  }
  console.log("checkSystemRequirements");
  console.log(JSON.stringify(ZoomMtg.checkSystemRequirements()));

  // it's option if you want to change the WebSDK dependency link resources. setZoomJSLib must be run at first
  // if (!china) ZoomMtg.setZoomJSLib('https://source.zoom.us/2.4.0/lib', '/av'); // CDN version default
  // else ZoomMtg.setZoomJSLib('https://jssdk.zoomus.cn/2.4.0/lib', '/av'); // china cdn option
  // ZoomMtg.setZoomJSLib('http://localhost:9999/node_modules/@zoomus/websdk/dist/lib', '/av'); // Local version default, Angular Project change to use cdn version
  ZoomMtg.preLoadWasm(); // pre download wasm file to save time.

  var SDK_KEY = "4E7xuD27kEOjrpIKoQwRQ2CNaApjaL9g2nFI";
  /**
   * NEVER PUT YOUR ACTUAL SDK SECRET IN CLIENT SIDE CODE, THIS IS JUST FOR QUICK PROTOTYPING
   * The below generateSignature should be done server side as not to expose your SDK SECRET in public
   * You can find an eaxmple in here: https://marketplace.zoom.us/docs/sdk/native-sdks/web/essential/signature
   */
  const SDK_SECRET = "oWpts4SQJVnrOYK5NKZyB9xZB6DjM0iM3gUS";

  function getUrlQuery() {
    let valuesReg = /([\w]*)=([\w\.\%\+]*)/gi;
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

  const urlQuery = getUrlQuery();

  // let navbar = document.getElementById("nav-tool");
  // navbar.style.display = "none";
  function getDate() {
    const date = new Date(
      urlQuery.year,
      urlQuery.month - 1,
      urlQuery.date,
      urlQuery.hours,
      urlQuery.minutes
    );
    let currentDate = new Date(Date.now());
    return {
      meetingTime: date.getTime(),
      timeDeffirent: (date - currentDate) / 1000,
    };
  }
  console.log(
    urlQuery,
    "=========",
    window.location.search,
    "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
  );
  if (getDate().timeDeffirent >= 600 || getDate().timeDeffirent <= -3600) {
    console.log(window.location.host);
    window.open(
      `oa_page.html?/mt=${getDate().meetingTime}?dt=${getDate().timeDeffirent}`,
      "_self"
    );
    return;
  }

  // some help code, remember mn, pwd, lang to cookie, and autofill.
  // document.getElementById("display_name").value =
  //   "CDN" +
  //   ZoomMtg.getJSSDKVersion()[0] +
  //   testTool.detectOS() +
  //   "#" +
  //   testTool.getBrowserInfo();

  document.getElementById("display_name").value = urlQuery.name;

  // document.getElementById("meeting_number").value = testTool.getCookie(
  //   "meeting_number"
  // );
  document.getElementById("meeting_number").value = urlQuery.mn;

  // document.getElementById("meeting_pwd").value = testTool.getCookie(
  //   "meeting_pwd"
  // );
  document.getElementById("meeting_pwd").value = urlQuery.pwd;

  document.getElementById("meeting_role").value = parseInt(urlQuery.role);

  if (testTool.getCookie("meeting_lang"))
    document.getElementById("meeting_lang").value =
      testTool.getCookie("meeting_lang");

  document
    .getElementById("meeting_lang")
    .addEventListener("change", function (e) {
      testTool.setCookie(
        "meeting_lang",
        document.getElementById("meeting_lang").value
      );
      testTool.setCookie(
        "_zm_lang",
        document.getElementById("meeting_lang").value
      );
    });
  // copy zoom invite link to mn, autofill mn and pwd.
  document
    .getElementById("meeting_number")
    .addEventListener("input", function (e) {
      var tmpMn = e.target.value.replace(/([^0-9])+/i, "");
      if (tmpMn.match(/([0-9]{9,11})/)) {
        tmpMn = tmpMn.match(/([0-9]{9,11})/)[1];
      }
      var tmpPwd = e.target.value.match(/pwd=([\d,\w]+)/);
      if (tmpPwd) {
        document.getElementById("meeting_pwd").value = tmpPwd[1];
        testTool.setCookie("meeting_pwd", tmpPwd[1]);
      }
      document.getElementById("meeting_number").value = tmpMn;
      testTool.setCookie(
        "meeting_number",
        document.getElementById("meeting_number").value
      );
    });

  document.getElementById("clear_all").addEventListener("click", function (e) {
    testTool.deleteAllCookies();
    document.getElementById("display_name").value = "";
    document.getElementById("meeting_number").value = "";
    document.getElementById("meeting_pwd").value = "";
    document.getElementById("meeting_lang").value = "en-US";
    document.getElementById("meeting_role").value = 0;
    window.location.href = "/index.html";
  });

  // click join meeting button
  document
    .getElementById("join_meeting")
    .addEventListener("click", function (e) {
      e.preventDefault();
      var meetingConfig = testTool.getMeetingConfig();
      if (!meetingConfig.mn || !meetingConfig.name) {
        alert("Meeting number or username is empty");
        return false;
      }

      testTool.setCookie("meeting_number", meetingConfig.mn);
      testTool.setCookie("meeting_pwd", meetingConfig.pwd);

      var signature = ZoomMtg.generateSDKSignature({
        meetingNumber: meetingConfig.mn,
        sdkKey: SDK_KEY,
        sdkSecret: SDK_SECRET,
        role: meetingConfig.role,
        success: function (res) {
          console.log(res.result);
          meetingConfig.signature = res.result;
          meetingConfig.sdkKey = SDK_KEY;
          var joinUrl = "/meeting.html?" + testTool.serialize(meetingConfig);
          console.log(joinUrl);
          // window.open(joinUrl, "_blank");
          window.open(joinUrl, "_self");
        },
      });
    });

  function copyToClipboard(elementId) {
    var aux = document.createElement("input");
    aux.setAttribute(
      "value",
      document.getElementById(elementId).getAttribute("link")
    );
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
  }

  // click copy jon link button
  window.copyJoinLink = function (element) {
    var meetingConfig = testTool.getMeetingConfig();
    if (!meetingConfig.mn || !meetingConfig.name) {
      alert("Meeting number or username is empty");
      return false;
    }
    var signature = ZoomMtg.generateSDKSignature({
      meetingNumber: meetingConfig.mn,
      sdkKey: SDK_KEY,
      sdkSecret: SDK_SECRET,
      role: meetingConfig.role,
      success: function (res) {
        console.log(res.result);
        meetingConfig.signature = res.result;
        meetingConfig.sdkKey = SDK_KEY;
        var joinUrl =
          testTool.getCurrentDomain() +
          "/meeting.html?" +
          testTool.serialize(meetingConfig);
        document
          .getElementById("copy_link_value")
          .setAttribute("link", joinUrl);
        copyToClipboard("copy_link_value");
      },
    });
  };

  function autoNavigateZoom() {
    const meetingConfig = testTool.getMeetingConfig();
    if (!meetingConfig.mn || !meetingConfig.name) {
      alert("Meeting number or username is empty");
      return false;
    }
    testTool.setCookie("meeting_number", meetingConfig.mn);
    testTool.setCookie("meeting_pwd", meetingConfig.pwd);

    const signature = ZoomMtg.generateSDKSignature({
      meetingNumber: meetingConfig.mn,
      sdkKey: SDK_KEY,
      sdkSecret: SDK_SECRET,
      role: meetingConfig.role,
      success: function (res) {
        console.log(res.result);
        meetingConfig.signature = res.result;
        meetingConfig.sdkKey = SDK_KEY;
        const joinUrl = "/meeting.html?" + testTool.serialize(meetingConfig);
        console.log(joinUrl);
        // window.open(joinUrl, "_blank");
        window.open(joinUrl, "_self");
      },
    });
  }

  autoNavigateZoom();
}
