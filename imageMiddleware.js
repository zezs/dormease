// Add your JavaScript logic here
const imageInput = document.getElementById("imageInput");
const selectedImage = document.getElementById("selectedImage");

imageInput.addEventListener("change", function () {
    const file = imageInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            selectedImage.src = e.target.result;
        };

        reader.readAsDataURL(file);
    } else {
        selectedImage.src = ""; // Clear the image if no file is selected
    }
});
