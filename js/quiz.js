//?todo: line(423) but i must not repeat any username in database

const firebaseConfig = {
  apiKey: "AIzaSyCYV-s2jLWfEsKAtrv3_BPtP5Ji3G6eCWo",
  authDomain: "qzapp-83196.firebaseapp.com",
  projectId: "qzapp-83196",
  storageBucket: "qzapp-83196.appspot.com",
  messagingSenderId: "563040277968",
  appId: "1:563040277968:web:78c3f6c9276cd2626495d5",
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";

import {
  arrayRemove,
  arrayUnion,
  deleteField,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-firestore.js";

firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//Elements
let container = document.querySelector(".container"),
  alerts = document.querySelector(".alerts"),
  reEmail = document.querySelector(".email"),
  valid = document.querySelector(".valid"),
  codeValidation = document.querySelector(".rx-code"),
  code_check = document.querySelector(".check-code"),
  submit_form = document.querySelector(".submit-form"),
  slide_bar = document.querySelector(".slide-bar"),
  slide_bar_ul = document.querySelector(".slide-bar ul"),
  check = document.querySelector(".check"),
  controlled_btn = document.querySelector(".controller-buttons"),
  showTable = document.querySelector(".showTable"),
  txt = document.querySelector(".check-us-name"),
  i = document.querySelector(".menu"),
  create_or_show = document.querySelector(".create-or-show"),
  create_qz = document.querySelector(".create-ques"),
  qzShow = document.querySelector(".ques-show"),
  create_or_show_lis = document.querySelectorAll(".create-or-show li"),
  register_substances = document.querySelector(".register-substances"),
  submit_substance = document.querySelector(".submit-substance"),
  qz_lec = document.querySelector(".quiz-name"),
  qz_contents_container = document.querySelector(".quiz-contents-container"),
  add_store_content = document.querySelector(".add-store-content"),
  qz_content = document.querySelector(".quiz-content"),
  qz_content_ques = document.querySelector(".quiz-content .ques"),
  qz_content_option = document.querySelectorAll(
    ".quiz-content .option-content"
  ),
  lecName = document.querySelector(".quiz-content h3"),
  addNew = document.querySelector(".create-ques .add-new"),
  store_qz = document.querySelector(".create-ques .store-qz"),
  ins_option = document.querySelector(".create-ques .insert-option"),
  table_container = document.querySelector(".table-container"),
  clonedUl = document.createElement("ul");
clonedUl.className = "select-sub";
create_qz.firstElementChild.after(clonedUl);

//Global Vars Is Very Important To use in many projects as => dependant vars
let defaultSUbtMessage = "No Subjects Added";
let currentIndex = 0;
let trueAnswer = 0;
let falseAnswer = 0;
let missedAnswer = 0;
let set_interval, startTime, endTime;
let duration = 10;
let txtArray = {};
let substancesRegister = [];
let sldHgh;
let teamCode = "2027";
let storedData;
let userState = "";
let userEmails = [];
let storedUsers;

let create_or_show_height = create_or_show.getBoundingClientRect().height;
create_qz.style.top = `${create_or_show_height + 30}px`;
slide_bar.style.top = `${create_or_show_height + 1}px`;

//show alerts fn
function showAlerts(message, status) {
  alerts.innerHTML = `
        <div class="alert alert-${status}" role="alert">
            ${message}
        </div>
        `;
  setTimeout(() => {
    alerts.innerHTML = ``;
  }, 5000);
}

function validateEmail(email) {
  const regex = /^[^\s@]+@(gmail|Gmail|yahho)\.com$/;
  return regex.test(email);
}

// let emailFound = false
// // for payed process

// // const docRefUsers = doc(db, "userRegister", "usersEmails");
// // register.addEventListener('click', async function() {

// //     register.innerHTML = loadingAction()
// //     if (validateEmail(reEmail.value)) {
// //         const docSnap = await getDoc(docRefUsers);
// //         if(docSnap.exists()) {
// //             //Normal updated
// //             getDoc(docRefUsers).then(async e=>{
// //                 storedUsers = await e.data().users
// //                 storedUsers.push({})

// //                 storedUsers.forEach(async function(storeObject) {
// //                     if(storeObject.userEmail === reEmail.value) {
// //                         emailFound = true

// //                         if(storeObject.subscribed) {
// //                             resultOfAuth()
// //                         }

// //                         return await updateDoc(docRefUsers, {
// //                             users: arrayUnion({...storeObject, subscribed: storeObject.subscribed})
// //                         })
// //                     }

// //                     if(!emailFound) {
// //                         return await updateDoc(docRefUsers, {
// //                             users: arrayUnion({userEmail: reEmail.value, subscribed: codeValidation.value === teamCode ? true : false, status: codeValidation.value === teamCode ? 'Rx-User' : "User"})
// //                         })
// //                     }
// //                     localStorage.setItem('subscribed-user-email', JSON.stringify(storedUsers))
// //                 })
// //             })
// //         }
// //     } else {
// //         showAlerts('Invalid Email', 'danger');
// //     }

// //     closeModal.click();
// //     register.innerHTML = 'Register'

// // })

// // function resultOfAuth() {

// //     log_register.remove();

// //     if(codeValidation.value == teamCode) {
// //         create_or_show.style.display = 'none'
// //         slide_bar.parentElement.style.display = 'flex'
// //         slide_bar.style.top = '1px';
// //         i.style.top = '1px'

// //
// //     } else {
// //         create_or_show.style.display = 'none'
// //         qzShow.style.display = 'block'

// //         i.parentElement.style.top =  `2%`
// //         slide_bar.style.top =  `1px`
// //     }
// // }

// // if(localStorage.getItem('subscribed-user-email')) {
// //     resultOfAuth()
// // }

reEmail.addEventListener("input", function (event) {
  if (event.data !== " ") {
    if (validateEmail(event.target.value)) {
      submit_form.classList.remove("ds");
    } else {
      submit_form.classList.add("ds");
    }
  }
});

code_check.addEventListener("change", function () {
  code_check.checked
    ? codeValidation.classList.remove("ds")
    : codeValidation.classList.add("ds");
});

function user_register(e) {
  e.preventDefault();

  if (!code_check.checked) {
    user();
  } else {
    if (codeValidation.value == teamCode) {
      rx_user();
    } else {
      showAlerts(
        "Enter Right Rx Code Or Cancel The Check Of CheckBox",
        "danger"
      );
    }
  }

  localStorage.setItem(
    "user-status",
    JSON.stringify({ email: reEmail.value, status: userState })
  );
}

submit_form.onclick = user_register;

function user() {
  create_or_show.style.display = "none";
  qzShow.style.cssText = "margin:0; display:block;";
  slide_bar.style.cssText = "top:1px; border-top: var(--put-color) 2px solid;";
  i.parentElement.style.cssText = "color: var(--body-color); top: 2%;";
  valid.remove();

  userState = "user";
}

function rx_user() {
  create_or_show.style.display = "flex";
  let create_or_show_height = create_or_show.getBoundingClientRect().height;
  create_qz.style.top = `${create_or_show_height + 30}px`;
  slide_bar.style.top = `${create_or_show_height + 1}px`;
  valid.remove();
  userState = "rx-user";
}

if (localStorage.getItem("user-status")) {
  const userInfo = JSON.parse(localStorage.getItem("user-status"));
  if (userInfo.status == "user") {
    user();
  } else if (userInfo.status == "rx-user") {
    rx_user();
  }
}

i.addEventListener("click", function () {
  let table = document.querySelector("table");
  if (table) {
    table.remove();
  }
  slide_bar.classList.toggle("inactive");
});

function disableFn() {
  if (qz_content) {
    qz_content.classList.add("ds");
    add_store_content.classList.add("ds");
    qz_content_ques.disabled = true;
    qz_content_option.forEach(function (option) {
      option.disabled = true;
    });
  }
}

function non_disableFn() {
  if (qz_content) {
    qz_content.classList.remove("ds");
    add_store_content.classList.remove("ds");
    qz_content_ques.disabled = false;
    qz_content_option.forEach(function (option) {
      option.disabled = false;
    });
  }
}

create_or_show_lis.forEach((li) => {
  li.addEventListener("click", () => {
    create_or_show_lis.forEach((li) => li.classList.remove("selected"));

    document
      .querySelectorAll("section")
      .forEach((section) => section.classList.remove("active"));
    document.querySelector(`${li.className}`).classList.add("active");
    li.parentElement.classList.remove("active");
    li.classList.add("selected");

    if (li.textContent === "Create Questions") {
      disableFn();
      if (localStorage.getItem("substances")) {
        qz_content.classList.remove("ds");
      }
      container.innerHTML = "";
      container.classList.remove("start-qz");
      container.previousElementSibling.innerHTML = "";
    } else {
      sldHgh = slide_bar.getBoundingClientRect().height;
      slide_bar_ul.style.height = `${sldHgh}px`;
    }
  });
});

const docRef = doc(db, "substances", "subjects");
submit_substance.addEventListener("click", async () => {
  if (register_substances.value !== "") {
    substancesRegister.push({
      subName: register_substances.value,
    });

    let except = substancesRegister.filter((_, n, arr) => {
      return n < arr.length - 1;
    });

    except.forEach((e) => {
      if (register_substances.value === e["subName"]) {
        substancesRegister.pop();
      }
    });

    // add substances to list
    if (substancesRegister.length > except.length) {
      showList();
      // selectRtLec()
      let subLi_contents = document.querySelectorAll(
        ".sub-name .content-parent"
      );
      subLi_contents.forEach((e, k) => {
        if (k === subLi_contents.length - 1) {
          e.firstElementChild.textContent = register_substances.value;
        }
      });

      let recordSubValue = register_substances.value;

      if (clonedUl.innerHTML === defaultSUbtMessage) {
        clonedUl.innerHTML = "";
      }

      let li = document.createElement("li");

      li.textContent = recordSubValue;

      let dlt = document.createElement("span");
      dlt.textContent = "X";
      dlt.className = "delete-sub";

      li.appendChild(dlt);

      subLi_contents.forEach(function (s) {
        delete_Sub(dlt, s.parentElement);
      });

      clonedUl.appendChild(li);

      addSelectedClass(create_qz);

      // addLec()
    }

    // Reference to the document
    // Get the current data
    // The document exists, update it
    // The document does not exist, create it with the initial array
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      //Normal updated
      await updateDoc(docRef, {
        substances: arrayUnion({ subName: register_substances.value }),
      });
    } else {
      //if no existed data
      await setDoc(docRef, {
        substances: [{ subName: register_substances.value }],
      });
    }
  }

  register_substances.value = "";
});

// Register Substances
getDoc(doc(db, "substances", "subjects"))
  .then(async (e) => {
    // slide_bar_ul.innerHTML = '';
    storedData = await e.data().substances;
    substancesRegister = storedData ?? [];

    if (substancesRegister.length && substancesRegister.length > 0) {
      substancesRegister.forEach(async function (sub, i) {
        let updated_last_result = {};
        let userData = [];

        showList();
        let subLi_contents = document.querySelectorAll(
          ".sub-name .content-parent"
        );

        subLi_contents.forEach((subLi_content, index) => {
          if (index === i) {
            subLi_content.firstElementChild.textContent = sub["subName"];
          }

          Object.keys(sub).forEach(async (k) => {
            if (
              sub["subName"] === subLi_content.firstElementChild.textContent
            ) {
              if (k !== "subName") {
                subLi_content.parentElement.lastElementChild.innerHTML += `
                                <li class='lec-name'><span class='${k
                                  .split(" ")
                                  .join("")}'>${k}</span>
                                </li>`;
              }
            }
          });

          let completed_lec = e.data()[sub["subName"]]
            ? e.data()[sub["subName"]]
            : {};

          Object.keys(completed_lec).forEach(async (lec_name) => {
            const users = completed_lec[lec_name];

            let contents = document.querySelector(
              `.lec-name .${lec_name.split(" ").join("")}`
            );

            const lec_length = sub[lec_name].length;

            users.forEach(async (user) => {
              const username = user["usName"];
              const results = user["true-answers"];

              userData.push({
                ...user,
                ["true-answers"]: results.split("/")[0] + "/" + lec_length,
              });
              // //update the total ques length of lecture//
              updated_last_result = {
                ...updated_last_result,
                [lec_name]: userData,
              };

              await updateDoc(docRef, {
                [sub["subName"]]: updated_last_result,
              });
              //update the total ques length of//

              //put passed lecture//
              if (localStorage.getItem("username") == username) {
                let passed_sign = document.createElement("span");
                passed_sign.classList.add("passed_sign");
                passed_sign.innerHTML = "&#10004;";
                contents.parentElement.appendChild(passed_sign);

                //?todo: but i must not repeat any username in database
              }
            });
            //put passed lecture//
          });
        });

        //deploy select-sub ul and li
        let li = document.createElement("li");
        li.textContent = sub["subName"];

        let dlt = document.createElement("span");
        dlt.textContent = "X";
        dlt.className = "delete-sub";

        li.appendChild(dlt);

        subLi_contents.forEach(function (subLi) {
          delete_Sub(dlt, subLi.parentElement);
        });
        clonedUl.appendChild(li);

        //select class action
        addSelectedClass(create_qz);

        for (const s in sub) {
          if (Array.isArray(sub[s])) {
            if (sub[s].length <= 1) {
              delete sub[s];
              await updateDoc(docRef, {
                substances: substancesRegister,
              });
            }
          }
        }
      });

      // Must out of substancesRegister.forEach()
      let lists = document.querySelectorAll(".sub-name");
      lists.forEach((li) => {
        li.addEventListener("click", function () {
          if (li.classList.contains("active")) {
            clearInterval(set_interval);
            currentIndex = 0;
            trueAnswer = 0;
            trueAnswer = 0;
            falseAnswer = 0;
            container.innerHTML = "";
            container.classList.remove("start-qz");
            selectRtLec();
          }
        });
      });
    } else {
      slide_bar_ul.innerHTML = "<p>No Substances Yet</p>";
    }
  })
  .then(function () {
    if (clonedUl.innerHTML === "") {
      clonedUl.innerHTML = defaultSUbtMessage;
    }
  });

//selected lists selected-sub action
function showList() {
  let subLi = document.createElement("li");
  subLi.className = "sub-name";

  let contentParent = document.createElement("div");
  contentParent.className = "content-parent";

  let subLi_content = document.createElement("span");
  subLi_content.className = "sub-content";
  contentParent.appendChild(subLi_content);

  let downIcon = document.createElement("i");
  downIcon.className = `fa-solid fa-down-long`;
  downIcon.classList.add("down-icon");
  contentParent.appendChild(downIcon);
  subLi.appendChild(contentParent);

  slide_bar_ul.appendChild(subLi);

  let nestedLists = document.createElement("ul");
  nestedLists.className = "nested-ul";

  subLi.appendChild(nestedLists);

  //clone the lists to select
  let lists = document.querySelectorAll(".sub-name");
  lists.forEach((li) => {
    li.addEventListener("click", () => {
      lists.forEach((l) => l.classList.remove("active"));
      li.classList.add("active");

      if (li.classList.contains("active")) {
        if (li.lastElementChild.classList.contains("nested-ul")) {
          let checkLec = li.lastElementChild;
          let dsp = getComputedStyle(checkLec).getPropertyValue("display");

          if (dsp === "block") {
            checkLec.parentElement.style.height = "150px";

            if (checkLec.children.length === 1) {
              checkLec.parentElement.style.height = "100px";
            } else if (checkLec.children.length === 0) {
              checkLec.parentElement.style.height = "50px";
            }
          }

          let filterInactiveLi = Array.from(lists).filter(function (l) {
            return !l.classList.contains("active");
          });

          filterInactiveLi.forEach(function (e) {
            e.style.height = "50px";
          });
        }
      }
    });
    // selectRtLec();
  });
}

// //active the delete on selected sub; ////// Done
function delete_Sub(deleteSub, subLi) {
  deleteSub.addEventListener("click", () => {
    let qz_li_length =
      create_qz.firstElementChild.nextElementSibling.children.length;
    deleteSub.parentElement.classList.remove("selected-sub");
    let delivered = deleteSub.parentElement;
    let received = subLi.firstElementChild;
    subLi.classList.remove("active");

    //check if length > 0
    // let list = document.querySelectorAll('.sub-name')

    if (qz_li_length > 0) {
      getDoc(doc(db, "substances", "subjects")).then((e) => {
        let parentData = e.data();
        Object.keys(parentData).forEach(function (d) {
          if (d === delivered.firstChild.textContent) {
            //remove from firebase
            updateDoc(docRef, {
              [d]: deleteField(),
            });
          }
        });

        storedData.forEach(function (data) {
          if (
            delivered.firstChild.textContent ===
              received.firstElementChild.textContent &&
            data["subName"] === delivered.firstChild.textContent
          ) {
            delivered.remove();
            received.parentElement.remove();

            //remove from sub_array
            substancesRegister.splice(substancesRegister.indexOf(data), 1);

            //remove from firebase
            updateDoc(docRef, {
              substances: arrayRemove(data),
            });
          }
        });
        if (qz_li_length === 1) {
          clonedUl.innerHTML = defaultSUbtMessage;
        }
      });
    }
  });
}

qz_lec.classList.add("ds");
function addSelectedClass(create_qz) {
  [...create_qz.firstElementChild.nextElementSibling.children].forEach((li) => {
    li.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-sub")) {
        qz_lec.classList.add("ds");
      } else {
        [...create_qz.firstElementChild.nextElementSibling.children].forEach(
          (l) => {
            l.classList.remove("selected-sub");
          }
        );

        li.classList.add("selected-sub");
        qz_content.firstElementChild.textContent = "";
        if (qz_content.firstElementChild.textContent === "") {
          disableFn();
        }
        addLec();
      }
    });
  });
}

function addLec() {
  qz_lec.classList.remove("ds");
  qz_lec.addEventListener("blur", async () => {
    if (qz_lec.value !== "") {
      let subs = document.querySelectorAll(".select-sub li");
      let selectedSub = Array.from(subs).filter((l) =>
        l.classList.contains("selected-sub")
      );
      //start add the ques the
      //check if the lec present ===> popup ==> the lecture is added before if you want to replace it you must dlt it and add it again
      substancesRegister.forEach((sub, i) => {
        selectedSub.forEach(async function (s) {
          if (s.firstChild.textContent === sub["subName"]) {
            if (
              !sub[`${qz_lec.value}`] ||
              sub[`${qz_lec.value}`].length === 0
            ) {
              create_or_show.lastElementChild.classList.add("ds");
              non_disableFn();
              sub[`${qz_lec.value}`] = [];
              lecName.textContent = qz_lec.value;
              //update the array firebase
              let storeCurrentContent =
                document.querySelector(".store-content");
              storeCurrentContent.classList.add("active");
              clickToStore(storeCurrentContent);

              let subName = document.querySelectorAll(
                ".sub-name .content-parent"
              );
              let filter_accessedLst = Array.from(subName).filter(function (l) {
                return (
                  l.firstElementChild.textContent === s.firstChild.textContent
                );
              });

              // nestedLists = document.createElement('ul');
              filter_accessedLst.forEach(function (element) {
                // //create nested lists to contain the lec
                let nestedLi = document.createElement("li");
                nestedLi.className = "lec-name";
                element.parentElement.lastElementChild.appendChild(nestedLi);
                nestedLi.innerHTML = "";
                nestedLi.innerHTML = `
                                <span class='${qz_lec.value}'>${qz_lec.value}</span>
                                `;
                // <span><i class="fa-solid fa-trash trash"></i></span>
              });

              await updateDoc(docRef, {
                substances: substancesRegister,
              });
            } else {
              alert(
                `This Lec Is Already Present And Filled With Questions, if You Wanna Reset It You Must Delete It And It Again`
              );
            }
          }
        });
      });
      qz_lec.value = "";
    }
  });
}

function selectRtLec() {
  let nested_lists = document.querySelectorAll(".sub-name .lec-name");
  nested_lists.forEach(function (n) {
    n.addEventListener("click", function () {
      nested_lists.forEach(function (n) {
        n.classList.remove("selected-lec");
      });

      n.classList.add("selected-lec");

      // i.className = '';
      slide_bar.classList.add("inactive");
      //show substance array and start compare
      if (n.classList.contains("selected-lec")) {
        // i.className = `fa-solid fa-bars`;
        clearInterval(set_interval);
        currentIndex = 0;
        trueAnswer = 0;
        trueAnswer = 0;
        falseAnswer = 0;
        container.innerHTML = "";
        container.classList.remove("start-qz");
        check.classList.add("active");
        subUsName(n.parentElement.parentElement);
      }
    });
  });
}

function addNewQues() {
  let newQz_content = document.createElement("div");
  newQz_content.className = "quiz-content";

  newQz_content.innerHTML = `
        <h3></h3>
            <header>
                <input type="text" class="ques" placeholder="Write Valid Ques?" />
            </header>
            <div class="section">
                <ul>
                    <li class="options">
                        <span class="right-option-select">&#10004;</span>
                        <input
                        type="text"
                        class="option-content"
                        placeholder="Insert Option"
                        />
                    </li>
                    <li class="options">
                        <span class="right-option-select">&#10004;</span>
                        <input
                        type="text"
                        class="option-content"
                        placeholder="Insert Option"
                        />
                    </li>
                </ul>
                <div class="insert-store-content">
                <input type="button" class="insert-option" value="Insert Option"/>
                <input type="button" class="store-content ds" value="Add Content"/>
                </div>
            </div>
    `;
  qz_contents_container.appendChild(newQz_content);
  let store = document.querySelectorAll(".create-ques .store-content");

  //apply the action on other questions
  let filterOther = Array.from(store).filter((_, index) => index > 0);
  filterOther.forEach((s) => {
    s.addEventListener("click", () => {
      store.forEach((s) => s.classList.remove("active"));
      s.classList.add("active");
    });

    clickToStore(s);
  });

  // Only add the event listener to the newly created insert-option button
  let newInsertOption = newQz_content.querySelector(".insert-option");
  newInsertOption.addEventListener("click", () =>
    insertOption(newInsertOption)
  ); // Ensure this function also doesn’t add duplicate listeners);
}

addNew.classList.add("ds");
store_qz.classList.add("ds");
//click on cloned operate the addNewQues()
addNew.addEventListener("click", () => {
  addNew.classList.add("active");
  if (addNew.classList.contains("active")) {
    store_qz.disabled = true;
    addNewQues();

    setTimeout(() => {
      addNew.disabled = true;
      addNew.classList.add("ds");
    }, 50);
  }
});

// //insert other options
function insertOption(insert) {
  let optionParent = document.createElement("li");
  optionParent.className = "options";

  let rightSpan = document.createElement("span");
  rightSpan.className = "right-option-select";
  rightSpan.innerHTML = "&#10004;";
  optionParent.appendChild(rightSpan);

  let answer_option = document.createElement("input");
  answer_option.type = "text";
  answer_option.className = "option-content";
  answer_option.placeholder = "Insert Option";
  optionParent.appendChild(answer_option);

  insert.parentElement.previousElementSibling.appendChild(optionParent);

  let selectedOption = [
    ...insert.parentElement.previousElementSibling.children,
  ];
  selectedOption.forEach((s) => {
    let storeButtons = s.parentElement.nextElementSibling.lastElementChild;
    clickToStore(storeButtons);
  });

  let main_option = [...insert.parentElement.previousElementSibling.children];
  main_option.forEach((op) => {
    if (op.lastElementChild.value === "") {
      insert.nextElementSibling.classList.remove("non-disabled");
      insert.nextElementSibling.classList.add("disabled");

      if (insert.nextElementSibling.classList.contains("disabled")) {
        addNew.disabled = true;
      }
    }
  });

  insert.nextElementSibling.value = "Add Content";
  insert.nextElementSibling.classList.add("ds");

  let option_select =
    insert.parentElement.previousElementSibling.querySelectorAll(
      ".option-content"
    );

  let test = Array.from(option_select).every(function (option) {
    // Assuming the last element child of each option is the input you want to check
    // let input = option.lastElementChild;
    return option.value !== "";
  });
  insert.classList.add("ds");
  let rt_select = insert.parentElement.previousElementSibling.querySelectorAll(
    ".right-option-select"
  );
  // rt_select.forEach(rt => rt.classList.remove('true-select'))

  option_select.forEach(function (option, o) {
    if (!test) {
      option.previousElementSibling.classList.add("ds");
    }

    if (o === option_select.length - 1) {
      option.addEventListener("input", function (event) {
        if (event.data !== " ") {
          rt_select.forEach((rt) => rt.classList.remove("ds"));
          insert.classList.remove("ds");
          insert.nextElementSibling.classList.remove("ds");
        }
      });
    }
  });
}

// //Action of insertion for the First Default Option
ins_option.addEventListener("click", () => {
  insertOption(ins_option);
});

// //search the other insertion buttons
function clickToStore(store) {
  let options = [...store.parentElement.previousElementSibling.children];
  options.forEach((main_option) => {
    let select_rt_answer = main_option.firstElementChild;
    //Try To Replace The Action Fn of StoreBtn With select_rt_answer
    select_rt_answer.addEventListener("click", function () {
      if (select_rt_answer.nextElementSibling.value !== "") {
        trueSelection(select_rt_answer, options);
      }
    });

    //check after application
    store.addEventListener("click", function () {
      let quesValue =
        store.parentElement.parentElement.previousElementSibling
          .firstElementChild.value;
      //check for if any value is'nt available;
      if (main_option.lastElementChild.value === "") {
        store.classList.remove("non-disabled");
        store.classList.add("disabled");
        setTimeout(() => {
          if (store.classList.contains("disabled")) {
            addNew.disabled = true;
            store_qz.disabled = true;
          }
        }, 20);
      } else if (
        select_rt_answer.classList.contains("true-select") &&
        main_option.lastElementChild.value !== "" &&
        quesValue !== ""
      ) {
        store.classList.remove("disabled");
        store.classList.add("non-disabled");

        //Must put Async to make this action after all remove the disabled class
        if (store.classList.contains("non-disabled")) {
          addNew.disabled = false;
          addNew.classList.remove("ds");
          store.classList.remove("ds");

          add_and_Store_quesAnswer(lecName);
          store.value = "Content Added";
        }
      }
    });
  });
}
// //add qz-content to array & local storage
function add_and_Store_quesAnswer(lec) {
  let storeContent = document.querySelectorAll(".store-content");
  let selectedSub = document.querySelector(".selected-sub");
  storeContent.forEach((store, storeIndex) => {
    if (store.classList.contains("active")) {
      let ques =
        store.parentElement.parentElement.previousElementSibling
          .firstElementChild;
      let options = [...store.parentElement.previousElementSibling.children];
      let qzContents = document.querySelectorAll(".quiz-content");
      substancesRegister.forEach((sub) => {
        Object.keys(sub).forEach((key) => {
          if (
            sub["subName"] === selectedSub.firstChild.textContent &&
            lec.textContent === key
          ) {
            if (qzContents.length > 1) {
              store_qz.disabled = false;
              store_qz.classList.remove("ds");
              store_qz.addEventListener("click", async function () {
                await updateDoc(docRef, {
                  substances: substancesRegister,
                });

                create_or_show.lastElementChild.classList.remove("ds");
                disableFn();

                let exceptFirstQz_content =
                  document.querySelectorAll(".quiz-content");
                Array.from(exceptFirstQz_content)
                  .filter(function (_, l) {
                    return l > 0;
                  })
                  .forEach(function (e) {
                    e.remove();
                  });

                let qz_content_inputs =
                  qz_content.querySelectorAll('[type="text"]');
                qz_content.firstElementChild.textContent = "";
                qz_content_inputs.forEach((e) => {
                  e.value = "";
                  if (e.previousElementSibling) {
                    e.previousElementSibling.classList.remove("true-select");
                  }
                });

                let addContentBtn =
                  qz_content.lastElementChild.lastElementChild.lastElementChild;
                addContentBtn.value = "Add Content";

                let options = [
                  ...qz_content.lastElementChild.firstElementChild.children,
                ];
                let opSpliceArray = Array.from(options);
                opSpliceArray.forEach(function (op, o) {
                  if (o > 1) {
                    opSpliceArray.splice(o, options.length - o);
                  }
                });

                qz_content.lastElementChild.firstElementChild.innerHTML = "";

                setTimeout(() => {
                  opSpliceArray.forEach(function (e) {
                    qz_content.lastElementChild.firstElementChild.appendChild(
                      e
                    );
                  });
                }, 10);
                addNew.classList.add("ds");
                store_qz.classList.add("ds");
              });

              //Get the array from option lists to reset the number of option as ==> (2)option
            }

            sub[`${key}`].push({});
            //put the content in the equal indexes
            sub[`${key}`].forEach((_, oIndex, sArray) => {
              if (oIndex === storeIndex) {
                sArray[oIndex][`quesContent`] = ques.value;
                sArray[oIndex][`answers`] = {};
                options.map((option, i) => {
                  let rt_answer = option.firstElementChild;
                  let input = option.lastElementChild;

                  // sArray[oIndex][`answer-${answerNumber+1}`] = input.value;
                  sArray[oIndex][`answers`][`answer-${i + 1}`] = input.value;

                  if (rt_answer.classList.contains("true-select")) {
                    sArray[oIndex][`rt-answer`] =
                      rt_answer.nextElementSibling.value;
                  }
                });
              }
            });

            let except = sub[`${key}`].filter((_, n, arr) => {
              return n < arr.length - 1;
            });

            except.forEach((e) => {
              if (ques.value === e["quesContent"]) {
                sub[`${key}`].pop();
              }
            });
          }
        });
      });
    }
  });
}

// //for team that create the qz
function trueSelection(select_rt_answer, options) {
  options.forEach((option) =>
    option.firstElementChild.classList.remove("true-select")
  );

  select_rt_answer.classList.add("true-select");
  select_rt_answer.parentElement.parentElement.nextElementSibling.lastElementChild.classList.remove(
    "ds"
  );
}

// register user-name and start the qz
function subUsName() {
  //put the txtArray[`${nested.textContent}`] = [] to start register the userNames
  let nested_lists = document.querySelectorAll(".lec-name");
  let startQz = document.querySelector(".startQz");
  let endQz = document.querySelector(".stop-qz");

  if (startQz) {
    startQz.remove();
    endQz.remove();
  }

  if (showTable) {
    showTable.classList.remove("hd");
  }

  showTable.innerHTML = "";
  //reset the the li elements in Object(array)
  let lists = document.querySelectorAll(".sub-name");
  let filterLi = Array.from(lists)
    .filter((l) => l.classList.contains("active"))
    .map((l) => l.firstElementChild.firstElementChild.textContent)
    .join("");

  getDoc(doc(db, "substances", "subjects")).then(async (e) => {
    if (e.data()[filterLi]) {
      txtArray = e.data()[filterLi];
    }

    let filter_nestedLiContent = Array.from(nested_lists)
      .filter((l) => l.classList.contains("selected-lec"))
      .map((l) => l.firstElementChild.textContent)
      .join("");
    function log_username_dyn() {
      if (txt.value.trim().split(" ").length >= 2) {
        if (!localStorage.getItem("username")) {
          localStorage.setItem("username", txt.value.toLowerCase());
        }

        startBtn.classList.remove("hd");
        endBtn.classList.remove("hd");
        //Compare the updated length of array and the stored array
        if (!txtArray[filter_nestedLiContent]) {
          txtArray[filter_nestedLiContent] = [];
        }

        Object.keys(txtArray).forEach(function (ele) {
          if (ele === filter_nestedLiContent) {
            txtArray[`${filter_nestedLiContent}`].push({
              usName: txt.value.toLowerCase(),
            });

            let except = txtArray[`${filter_nestedLiContent}`].filter(
              (_, n, arr) => {
                return n < arr.length - 1;
              }
            );

            except.forEach((e) => {
              if (txt.value.toLowerCase() === e["usName"]) {
                txtArray[`${filter_nestedLiContent}`].pop();
              }
            });
          }
        });
      }
    }

    if (localStorage.getItem("username")) {
      txt.value = localStorage.getItem("username");
      txt.classList.add("ds");
      check.lastElementChild.style.display = "none";
      log_username_dyn();
    }

    check.addEventListener("submit", () => {
      showTable.innerHTML = "";
      log_username_dyn();
    });
  });

  if (userState === "rx-user") {
    showTable.innerHTML = `<button type="button" class="btn btn-primary show-table">Show Table</button>`;

    showTable.firstElementChild.onclick = () => {
      check.classList.remove("active");
      let table = document.querySelector("table");
      if (table) {
        table.remove();
      }
      container.innerHTML = "";
      container.classList.remove("start-qz");
      startBtn.remove();
      endBtn.remove();
      showRanking();
      showTable.innerHTML = "";
    };
  }

  //create start btn
  let startBtn = document.createElement("button");
  startBtn.textContent = "Start Quiz";
  startBtn.className = "startQz hd";

  //create stop btn
  let endBtn = document.createElement("button");
  endBtn.textContent = "Stop Quiz";
  endBtn.className = "stop-qz hd";

  controlled_btn.appendChild(startBtn);
  controlled_btn.appendChild(endBtn);

  startBtn.addEventListener("click", function () {
    let filterLi = Array.from(lists)
      .filter((l) => l.classList.contains("active"))
      .map((l) => l.firstElementChild.firstElementChild.textContent)
      .join("");
    clearInterval(set_interval);
    currentIndex = 0;
    trueAnswer = 0;
    falseAnswer = 0;
    missedAnswer = 0;

    // Capture the start time

    container.classList.add("start-qz");
    if (container.classList.contains("start-qz")) {
      showTable.classList.add("hd");
      check.classList.remove("active");

      startTime = Date.now();
      // startBtn.disabled = true;
      substancesRegister.forEach(function (sub) {
        if (sub["subName"] === filterLi) {
          let selectedSub = document.querySelectorAll(".lec-name");

          selectedSub.forEach(function (selected) {
            if (selected.classList.contains("selected-lec")) {
              pageContent(
                sub[`${selected.firstElementChild.textContent}`],
                sub[`${selected.firstElementChild.textContent}`].length
              );
            }
          });
        }
      });
    }
  });

  endBtn.addEventListener("click", function () {
    clearInterval(set_interval);
    container.classList.remove("start-qz");
    container.innerHTML = "";
    startBtn.disabled = false;

    let answers = document.querySelectorAll(".answer");
    answers.forEach(function (a) {
      a.classList.add("finished-ques");
    });
  });
}

// //questions show
function pageContent(content, length) {
  for (let index = 0; index < length; index++) {
    const quizApp = document.createElement("div");
    quizApp.className = "quiz-app";
    container.appendChild(quizApp);

    container.children[0].style.display = "block";
    setTimeout(() => container.children[0].classList.add("active"), 10);

    // quizApp.style.display = 'block'
    // setTimeout(() => quizApp.classList.add("active"),2)

    let category = document.createElement("div");
    category.className = "category";

    let subjectName = document.createElement("div");
    subjectName.className = "subject-name";

    let subNameChild = document.createElement("span");
    subNameChild.className = "subject-name";
    let lists = document.querySelectorAll(".sub-name");
    lists.forEach((li) => {
      if (li.classList.contains("active")) {
        subNameChild.innerHTML = `${li.firstElementChild.firstElementChild.textContent}`;
      }
    });

    subjectName.appendChild(subNameChild);
    category.appendChild(subjectName);

    let quesNumbers = document.createElement("div");
    quesNumbers.innerHTML = `Questions Number <span class='number'>${
      index + 1
    }</span>`;
    category.appendChild(quesNumbers);

    quizApp.appendChild(category);

    let quizArea = document.createElement("div");
    quizArea.className = "quiz-area";

    let quesTitle = document.createElement("h3");
    quesTitle.className = "ques";
    quesTitle.textContent += content[index].quesContent;
    quizArea.appendChild(quesTitle);

    const answers = document.createElement("div");
    answers.className = `answers`;

    const answersObject = content[index][`answers`];
    for (let i = 1; i <= Object.keys(answersObject).length; i++) {
      const answer = document.createElement("div");
      answer.className = `answer`;

      let circle = document.createElement("span");
      circle.className = "circle";

      let answerVal = document.createElement("div");
      answerVal.className = "answer-val";
      answerVal.textContent += `${answersObject[`answer-${i}`]}`;

      answerVal.setAttribute("rt-answer", content[index][`rt-answer`]);

      answer.appendChild(circle);
      answer.appendChild(answerVal);

      answers.appendChild(answer);
      if (answerVal.textContent === "undefined") {
        answerVal.parentElement.style.display = "none";
      }
      quizArea.appendChild(answers);
      quizApp.appendChild(quizArea);
    }
    setTimeout(() => {
      if (quizApp.classList.contains("active")) {
        let anss = document.querySelectorAll(".answer");
        anss.forEach((ans) => {
          ans.addEventListener("click", () => {
            clearInterval(set_interval);
            [...answers.children].forEach((e) =>
              e.classList.remove("selected")
            );
            ans.classList.add("selected");

            if (ans.classList.contains("selected")) {
              //use increase
              currentIndex++;
              let aParent = ans.parentElement.parentElement.parentElement;
              let tmr = aParent.children[1].lastElementChild;
              if (currentIndex < length) {
                aParent.nextElementSibling.style.display = "block";
                setTimeout(() => {
                  //Must check the current answer Before add the next element active class
                  checkAnswers(ans);
                  checkOtherAnswers(ans.parentElement);

                  aParent.nextElementSibling.classList.add("active");
                  mainCountDown(
                    duration,
                    aParent.nextElementSibling.children[1],
                    length
                  );
                }, 30);
              } else {
                checkAnswers(ans);
                checkOtherAnswers(ans.parentElement);

                endTime = Date.now();
                let elapsed = endTime - startTime;

                createRanking(length);

                let true_calc = document.querySelector(
                  ".result-calc .true-calc"
                );
                let filter_true_number = true_calc.textContent
                  .split(" ")
                  .map((e) => +e)
                  .filter((e) => +e)
                  .join("");

                Array.from(lists)
                  .filter((l) => l.classList.contains("active"))
                  .forEach((l) => {
                    putElapsedTme(
                      elapsed,
                      l,
                      txtArray,
                      filter_true_number,
                      length
                    );
                  });
                // mainCountDown(duration, aParent.nextElementSibling.children[1], length)
              }
              tmr.innerHTML = `Final Result is <span>${ans.children[1].getAttribute(
                "rt-answer"
              )}</span>`;
              tmr.style.cssText = "font-size:15px;";
            }
          });
        });
      }
    }, 50);
  }
  setTimeout(() => {
    let quizArea = document.querySelector(".quiz-area");
    mainCountDown(duration, quizArea, length);
  }, 100);
}

// //counter down function
function mainCountDown(duration, quizArea, length) {
  let mt = Math.trunc(duration / 60);
  let sc = Math.trunc(duration % 60);

  let timer = document.createElement("div");
  timer.className = "timer";
  quizArea.appendChild(timer);

  let minutes = document.createElement("span");
  minutes.className = "mints";

  timer.appendChild(minutes);

  let colon = document.createTextNode(":");
  timer.appendChild(colon);

  let seconds = document.createElement("span");
  seconds.className = "scs";

  timer.appendChild(seconds);

  dwn(sc, seconds, mt, minutes);
  set_interval = setInterval(() => {
    if (sc > 0) {
      sc--;
      dwn(sc, seconds, mt, minutes);
    } else if (sc === 0 && mt !== 0) {
      sc = 59;
      mt--;
      dwn(sc, seconds, mt, minutes);
    } else if (sc === 0 && mt === 0) {
      dwn(sc, seconds, mt, minutes);
      clearInterval(set_interval);
      [...quizArea.children[1].children].forEach((chl) => {
        if (
          chl.children[1].getAttribute("rt-answer") ===
          chl.children[1].textContent
        ) {
          chl.classList.add("mss");
          chl.firstElementChild.style.cssText =
            "border: 2px solid #c621f3bf; background-color: #c621f3bf;";
          let true_false_answer = document.createElement("span");
          true_false_answer.innerHTML = "&#10004;";
          chl.appendChild(true_false_answer);
        }
        timer.innerHTML = `Final Result is <span>${chl.children[1].getAttribute(
          "rt-answer"
        )}</span>`;
        timer.style.cssText = "font-size:15px;";
      });

      [...quizArea.children[1].children]
        .filter((chl) => {
          return (
            chl.children[1].getAttribute("rt-answer") !==
            chl.children[1].textContent
          );
        })
        .map((chl) => chl.classList.add("finished-ques"));

      //Muse increase
      currentIndex++;
      if (currentIndex < length) {
        quizArea.parentElement.nextElementSibling.style.display = "block";
        setTimeout(() => {
          quizArea.parentElement.nextElementSibling.classList.add("active");
          mainCountDown(
            duration,
            quizArea.parentElement.nextElementSibling.children[1],
            length
          );
        }, 70);
      } else {
        endTime = Date.now();
        let elapsed = endTime - startTime;
        createRanking(length);

        let true_calc = document.querySelector(".result-calc .true-calc");
        let filter_true_number = true_calc.textContent
          .split(" ")
          .map((e) => +e)
          .filter((e) => +e)
          .join("");
        let lists = document.querySelectorAll(".sub-name");
        Array.from(lists)
          .filter((l) => l.classList.contains("active"))
          .map((l) => {
            putElapsedTme(elapsed, l, txtArray, filter_true_number, length);
          });
      }
    }
  }, 1000);
}

// //technic
function dwn(sc, seconds, mt, minutes) {
  if (sc >= 10) {
    seconds.textContent = sc;
  } else {
    seconds.textContent = `0${sc}`;
  }

  if (mt >= 10) {
    minutes.textContent = mt;
  } else {
    minutes.textContent = `0${mt}`;
  }
}

// //selected answer
function checkAnswers(a) {
  // let true_false_answer = document.createElement("span")
  // let clonedSign = true_false_answer.cloneNode(true)
  let true_false_answer = document.createElement("span");
  let clonedSign = true_false_answer.cloneNode(true);

  if (a.children[1].textContent === a.children[1].getAttribute("rt-answer")) {
    trueAnswer++;
    a.classList.add("true");
    true_false_answer.innerHTML = "&#10004;";
    a.appendChild(true_false_answer);
  } else if (
    a.children[1].textContent !== a.children[1].getAttribute("rt-answer")
  ) {
    falseAnswer++;
    a.classList.add("false");
    true_false_answer.innerHTML = "&#10006;";
    a.appendChild(true_false_answer);

    //You Must Write the Updated Class to Recognize The Latest Answer
    let quiz_app_active = document.querySelectorAll(`.quiz-app.active`);

    //select the last quiz-app.active
    Array.from(quiz_app_active)
      .filter(function (_, a) {
        return a === quiz_app_active.length - 1;
      })
      .map(function (qz) {
        let answersOf_last_quiz_app = qz.querySelectorAll(".answer");
        answersOf_last_quiz_app.forEach((t) => {
          if (
            !t.classList.contains("selected") &&
            t.children[1].textContent ===
              t.children[1].getAttribute("rt-answer")
          ) {
            t.classList.add("true");
            clonedSign.innerHTML = "&#10004;";
            t.appendChild(clonedSign);
          }
        });
      });
  }
}

// //except selected answers
function checkOtherAnswers(answers) {
  let chooseNot_trueFalse = [...answers.children].filter((e) => {
    return !e.classList.contains("true") && !e.classList.contains("false");
  });
  chooseNot_trueFalse.forEach((e) => {
    e.classList.add("finished-ques");
  });
}

// //Rank the result of user
function createRanking(length) {
  let result_calc = document.createElement("div");
  result_calc.className = "result-calc";

  setTimeout(() => {
    result_calc.classList.add("active");
  }, 100);

  let true_calc = document.createElement("h3");
  true_calc.className = "true-calc";

  true_calc.innerHTML = `True: ${trueAnswer}`;
  result_calc.appendChild(true_calc);

  let false_calc = document.createElement("h3");
  false_calc.className = "false-calc";

  false_calc.innerHTML = `False: ${falseAnswer}`;

  result_calc.appendChild(false_calc);

  let missed_calc = document.createElement("h3");
  missed_calc.className = "missed-calc";

  missed_calc.innerHTML = `Missed: ${length - (trueAnswer + falseAnswer)}`;

  result_calc.appendChild(missed_calc);

  container.appendChild(result_calc);
}

// //put the ranking and the time elapsed
function putElapsedTme(elapsed, li, txtArray, number_trueAnswers, objLength) {
  let filter_nestedLiContent = Array.from(li.lastElementChild.children)
    .filter((l) => l.classList.contains("selected-lec"))
    .map((l) => l.firstElementChild.textContent)
    .join("");
  Object.keys(txtArray).forEach(async function () {
    let lec_student = txtArray[filter_nestedLiContent];

    lec_student.forEach(function (obj) {
      if (txt.value.toLowerCase() === obj["usName"]) {
        if (!obj["elapsed"]) {
          //Get the latest elapsed tm
          let secondsTm = Math.round(elapsed / 1000);

          //Add the elapsed tm to usName
          obj["elapsed"] = secondsTm + " seconds";
          if (number_trueAnswers === "") {
            obj["true-answers"] = 0 + " / " + objLength;
          } else {
            obj["true-answers"] = number_trueAnswers + " / " + objLength;
          }
        }
      }
    });
    await updateDoc(
      docRef,
      li.firstElementChild.firstElementChild.textContent,
      txtArray
    );
  });
}

// //leader access on the user outPuts (usName, true-answers, elapsed tm)
function showRanking() {
  let table = document.createElement("table");
  table.className = "student-infos";
  let tHead = document.createElement("thead");
  tHead.innerHTML = `
        <tr>
            <th>Student Name</th>
            <th>Time Elapsed</th>
            <th>Evaluation</th>
        </tr>
    `;
  table.appendChild(tHead);

  let tBody = document.createElement("tbody");

  let lists = document.querySelectorAll(".sub-name");
  let filterLi = Array.from(lists).filter((l) =>
    l.classList.contains("active")
  );

  //Very UseFul thing i learn it
  let filter_nestedLiContent;
  filterLi.forEach((l) => {
    filter_nestedLiContent = Array.from(l.lastElementChild.children)
      .filter((l) => l.classList.contains("selected-lec"))
      .map((l) => l.firstElementChild.textContent)
      .join("");
  });

  let lec_student = txtArray[filter_nestedLiContent];
  lec_student.sort((a, b) => {
    if (parseInt(a["true-answers"]) !== parseInt(b["true-answers"])) {
      return parseInt(b["true-answers"]) - parseInt(a["true-answers"]);
    } else if (parseInt(a["true-answers"]) === parseInt(b["true-answers"])) {
      if (parseInt(a["elapsed"]) < parseInt(b["elapsed"])) {
        return parseInt(a["elapsed"]) - parseInt(b["elapsed"]);
      }
    }
  });

  //Show the user the submit the quiz only
  let present_elapsedInfo = lec_student.filter((e) => {
    return e["elapsed"];
  });

  // Function to reorder properties in an object
  function reorderProperties(obj, order) {
    const orderedObj = {};
    for (const key of order) {
      if (key in obj) {
        orderedObj[key] = obj[key];
      }
    }
    return orderedObj;
  }

  // Define the desired property order
  const propertyOrder = ["usName", "elapsed", "true-answers"];

  let recentArray = [];
  let recentEdit;
  for (const n in present_elapsedInfo) {
    reorderProperties(present_elapsedInfo[n], propertyOrder);
    recentEdit = reorderProperties(present_elapsedInfo[n], propertyOrder);
    recentArray.push(recentEdit);
  }

  for (let j = 0; j < recentArray.length; j++) {
    let tr = document.createElement("tr");
    tr.innerHTML = `
            <td></td>
            <td></td>
            <td> </td>
        `;

    Object.keys(recentArray[j]).forEach(function (red, r) {
      [...tr.children].forEach(function (td, t) {
        if (r === t) {
          td.textContent = recentArray[j][red];
        }
      });
    });
    tBody.appendChild(tr);
  }
  table.appendChild(tBody);

  table_container.appendChild(table);

  table.classList.remove("hd");
}
