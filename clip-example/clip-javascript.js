function clipEncodeImage(canvas) {
    // get base64 encoded JPEG from the canvas
    const jpeg = canvas.toDataURL('image/jpeg');

    // The request body should contain a JSON object formatted as {"image":"YOUR_BASE64_ENCODED_IMG_STRING"}
    const payload = { image: jpeg };
    const url = 'https://clip-featurize-esrwrrt7ma-uc.a.run.app/predict';

    // use axios to send a POST request to the CLIP encoding endpoint
    return axios.post(url, payload).then(response => {
        // return the CLIP encoded vector from the response
        return response.data.encoded_image;
    });
}

/*
    clipEncodeImage(canvas).then(encodedImage => {
        // use the encoded image here
    });
*/

/*
    const imageUrl = 'https://example.com/image.jpg';

    // create a new Image object and set its src to the image URL
    const image = new Image();
    image.src = imageUrl;

    // wait for the image to load
    image.onload = () => {
        // create a canvas element
        const canvas = document.createElement('canvas');

        // set the canvas dimensions to the same as the image
        canvas.width = image.width;
        canvas.height = image.height;

        // draw the image on the canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);

        // call the clipEncodeImage() function with the canvas
        clipEncodeImage(canvas).then(encodedImage => {
            // use the encoded image here
        });
    };
*/