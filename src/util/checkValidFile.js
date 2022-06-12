function isValidImage(file) {
    const type = file.mimetype.split("/").pop();
    const validTypes = ["jpg", "jpeg", "png", "pdf", "csv"];
    if (validTypes.indexOf(type) === -1) {
        return false;
    }
    return true;
};

function isCsvFile(file){
    const type = file.mimetype.split("/").pop();
    if (type!=='csv') {
        return false;
    }
    return true;
}

export {isValidImage, isCsvFile}

