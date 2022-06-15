$(function() {
    $("#DateOfBirthPickerInput").datepicker({
        showOn: 'button',
        buttonImageOnly: true,
        buttonImage: './../images/calendar-gif.gif',
        autosize:false,
        dateFormat: 'dd/mm/yy'
    });
});

var studentsData

function studentDetails() {
    $(document).ready(function () {
        $('table').DataTable({
            data: studentsData,
            columns: [
                { title: 'Sl.No', data: 'Id' },
                { title: 'Student Name', data: 'Name' },
                { title: 'Student Email', data: 'Email' },
                { title: 'Student DOB(DD-MM-YYY)', data: 'DOB' },
                { title: 'Student Age', data: 'Age' }
            ],
            stateSave: true,
            "bDestroy": true
        });
    });
}

let studentNameInput = document.querySelector('#StudentNameInput')
let studentEmailInput = document.querySelector('#StudentEmailInput')
let dateOfBirthInput = document.querySelector('#DateOfBirthPickerInput')
let studentAgeInput = document.querySelector('#StudentAgeInput')
let addStudentBtn = document.querySelector('.add-student-btn')
let clearBtn = document.querySelector('.clear-btn')
let inputForm = document.querySelector('form')

let nameRegex = /^[A-Za-z ]+$/
let emailRegex = /^[A-Za-z0-9_\.\-]+\@(([A-Za-z0-9\-])+\.)+([A-Za-z0-9]{2,4})+$/

studentNameInput.addEventListener('input', StudentNameValidation)
studentEmailInput.addEventListener('input', StudentEmailValidation)
studentAgeInput.addEventListener('input', StudentAgeValidation)
inputForm.addEventListener('submit', addStudentData)
clearBtn.addEventListener('click', () => clear())

var toastTrigger = document.getElementById('liveToastBtn')
var toastLiveExample = document.getElementById('liveToast')
if(toastTrigger) {
    toastTrigger.addEventListener('click', function () {
        var toast = new bootstrap.Toast(toastLiveExample)
        toast.show()
    })
}

function StudentNameValidation(event) {
    let name = studentNameInput.value
    let getChild = GetParentElementsChild(event.target)
    let isValidMessage = isValid(event.target, name, getChild, nameRegex)
    if (!isValidMessage)
        getChild.innerHTML = name != "" ? "Only Letters and Spaces are allowed" : "Field is Empty"
    isFieldsEmpty()
}

function StudentEmailValidation(event) {
    let email = studentEmailInput.value
    let getChild = GetParentElementsChild(event.target)
    let isValidMessage = isValid(event.target, email, getChild, emailRegex)
    if (!isValidMessage)
        getChild.innerHTML = email != "" ? "Email is Invalid" : "Field is Empty"
    isFieldsEmpty()
}

function StudentAgeValidation(event) {
    let age = studentAgeInput.value
    let getChild = GetParentElementsChild(event.target)
    let isValidMessage = isValid(event.target, age, getChild, null)
    if (!isValidMessage)
        getChild.innerHTML = age != "" ? "Age from 1-35 is valid" : "Field is Empty"
    isFieldsEmpty()
}

function GetParentElementsChild(currentEvent) {
    return currentEvent.parentElement.querySelector('div')
}

function isValid(event, input, child, regexp) {
    if ((input.match(regexp) && input != "") || (regexp == null && parseInt(input) > event.min && parseInt(input) <= event.max) || regexp=="dob") {
        child.setAttribute("class", "valid-feedback")
        child.innerHTML = "It's Great!"
        event.classList.remove("is-invalid")
        event.classList.add("is-valid")
    }
    else {
        child.setAttribute("class", "invalid-feedback")
        event.classList.remove("is-valid")
        event.classList.add("is-invalid")
        return false
    }
    return true
}

function isFieldsEmpty() {
    if (studentNameInput.value == "" || studentEmailInput.value == "" || dateOfBirthInput.value == "" || studentAgeInput.value == "") {
        addStudentBtn.disabled = true;
    }
    else {
        addStudentBtn.disabled = false;
    }
}

setInterval(() => {
    let dob = dateOfBirthInput.value
    let getChild = dateOfBirthInput.parentElement.parentElement.querySelector('div#DateOfBirthPickerFeedback')
    isFieldsEmpty()
    dobValidation(dob, getChild)
}, 1000)

function dobValidation(dob, getChild) {
    let isValidMessage = isValid(dateOfBirthInput, dob, getChild, "dob")
    if (!isValidMessage)
        getChild.innerHTML = dob != "" ? "Date is Invalid" : "Field is Empty"
    isFieldsEmpty()
}

let xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP")

function addStudentData(event) {
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            studentsData = JSON.parse(xhr.response)
            studentDetails()
            document.querySelector('#liveToastBtn').click()
            clear()
        }
        else {
            console.log(xhr.status)
        }
    }
    var params = "Id=" + (studentsData.length+1) + "&Name=" + studentNameInput.value + "&Email=" + studentEmailInput.value + "&DOB=" + dateOfBirthInput.value + "&Age=" + studentAgeInput.value;
    xhr.open("POST", "/Home/AddStudent");
    xhr.setRequestHeader('content-type', "application/x-www-form-urlencoded");
    xhr.send(params);
}

function getStudentsList() {
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            studentsData = JSON.parse(xhr.response)
            studentDetails()
        }
        else {
            console.log(xhr.status)
        }
    }
    xhr.open("GET", "/Home/GetStudentsList");
    xhr.setRequestHeader('content-type', "application/x-www-form-urlencoded");
    xhr.send();
}

function clear() {
    studentNameInput.value = studentAgeInput.value = studentEmailInput.value = dateOfBirthInput.value = ""
    let removeInvalidFeedbackClass = document.querySelectorAll('.invalid-feedback')
    let removeValidClass = document.querySelectorAll('.is-valid')
    let removeInvalidClass = document.querySelectorAll('.is-invalid')
    for (let validCount = 0; validCount < removeValidClass.length; validCount++) 
        removeValidClass[validCount].classList.remove('is-valid')
    for (let validCount = 0; validCount < removeInvalidClass.length; validCount++)
        removeInvalidClass[validCount].classList.remove('is-invalid')
    for (let validCount = 0; validCount < removeInvalidFeedbackClass.length; validCount++) {
        removeInvalidFeedbackClass[validCount].innerHTML = ""
        removeInvalidFeedbackClass[validCount].removeAttribute('class')
    }
}

window.onload = () => {
    getStudentsList()
}