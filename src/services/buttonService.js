module.exports = {
    buttonSuccess(button) {
        button.style.backgroundColor = "green";
        setTimeout(() => {
            button.style.backgroundColor = "black"
        }, 1000)
    }
}