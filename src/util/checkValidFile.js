function isFileValid(file) {
    const type = file.mimetype.split("/").pop();
    const validTypes = ["jpg", "jpeg", "png", "pdf", "csv"];
    if (validTypes.indexOf(type) === -1) {
        return false;
    }
    return true;
};

export default isFileValid

