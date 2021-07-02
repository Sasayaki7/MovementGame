calibrationForm = document.querySelector('.floating-form');




function onSelectChange(element){
    if (element.value == -1){
        invisible(document.querySelector('.calibration-btn'));
        visible(document.querySelector('.create-calibration'));
        document.querySelector('.name-input').setAttribute('value', 'New 1')
        hueMin.setAttribute('value', 0);
        hueMax.setAttribute('value', 255);
        satMin.setAttribute('value', 0);
        satMax.setAttribute('value', 255);
        valMin.setAttribute('value', 0);
        valMax.setAttribute('value', 255);
    }
    else{
        visible(document.querySelector('.calibration-btn'));
        invisible(document.querySelector('.create-calibration'));
        fetch(`http://localhost:5000/get_calibration?id=${element.value}`)
            .then(response => response.json())
            .then(data => {
            document.querySelector('.name-input').setAttribute('value',data.name)
            document.getElementById('update-id').setAttribute('value', data.id)

            hueMin.setAttribute('value', data.huemin);
            hueMax.setAttribute('value', data.huemax);
            satMin.setAttribute('value', data.satmin);
            satMax.setAttribute('value', data.satmax);
            valMin.setAttribute('value', data.valmin);
            valMax.setAttribute('value', data.valmax);
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
}