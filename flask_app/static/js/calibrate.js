calibrationForm = document.querySelector('.floating-form');




function onSelectChange(element){
    if (parseInt(element.value) === -1){
        invisible(document.querySelector('.calibration-btn'));
        visible(document.querySelector('.create-calibration'));
        document.querySelector('.name-input').value= 'New 1'
        hueMin.value = 0
        hueMax.value = 255
        satMin.value = 0
        satMax.value = 255
        valMin.value = 0
        valMax.value = 255
    }
    else{
        visible(document.querySelector('.calibration-btn'));
        invisible(document.querySelector('.create-calibration'));
        fetch(`http://localhost:5000/get_calibration?id=${element.value}`)
            .then(response => response.json())
            .then(data => {

            document.querySelector('.name-input').value =data.name
            document.getElementById('update-id').value =data.id
            hueMin.value = data.huemin
            hueMax.value = data.huemax
            satMin.value = data.satmin
            satMax.value = data.satmax
            valMin.value = data.valmin
            valMax.value = data.valmax
        })
    }
}



function newCalibration(){
    let form = new FormData(calibrationForm);
    fetch("http://localhost:5000/create_calibration", {
            method: 'POST', // or 'PUT'
            body: form,
            })
            .then(response => response.json())
            .then(data => {
            calibrationId = data.id
        })
}


function setCalibration(){
    let form = new FormData(calibrationForm);
    fetch("http://localhost:5000/set_calibration", {
            method: 'POST', // or 'PUT'
            body: form,
            })
            .then(response => response.json())
            .then(data => {
            calibrationId = data.id
        })
}



function updateCalibration(){
    let form = new FormData(calibrationForm);
    console.log("I'm beiing called right")
    fetch("http://localhost:5000/update_calibration", {
            method: 'POST', // or 'PUT'
            body: form,
            })
            .then(response => response.json())
            .then(data => {
            calibrationId = data.id
        })
}



function startCalibration(){
    isCalibrating = true;
    startCam();
}



function stopCalibration(){
    isCalibrating = false;
    fetch(`http://localhost:5000/get_calibration?id=${calibrationId}`)
        .then(response => response.json())
        .then(data =>{
            lowerElem = [data['huemin'], data['satmin'], data['valmin'], 0];
            higherElem = [data['huemax'], data['satmax'], data['valmax'], 255];
    })
    stopCam();
}