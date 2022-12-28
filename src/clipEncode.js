import axios from "axios";

export async function clipEncodeImage(dataUri) {
  // get base64 encoded JPEG from the canvas
  const jpeg = dataUri;

  // The request body should contain a JSON object formatted as {"image":"YOUR_BASE64_ENCODED_IMG_STRING"}
  const payload = { image: jpeg };
  const url = "https://clip-featurize-esrwrrt7ma-uc.a.run.app/predict";

  // use axios to send a POST request to the CLIP encoding endpoint
  return axios.post(url, payload).then((response) => {
    // return the CLIP encoded vector from the response

    return response.data.feature_vector;
  });
}

export async function clipEncodeText(text) {
  // get base64 encoded JPEG from the canvas

  // The request body should contain a JSON object formatted as {"image":"YOUR_BASE64_ENCODED_IMG_STRING"}
  const payload = { text: text };
  const url = "https://clip-featurize-esrwrrt7ma-uc.a.run.app/predict";

  // use axios to send a POST request to the CLIP encoding endpoint
  return axios.post(url, payload).then((response) => {
    // return the CLIP encoded vector from the response
    return response.data.feature_vector;
  });
}

//cosineSimilarity of two clip embedding vectors
export function cosineSimilarity(a, b) {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magnitudeA += Math.pow(a[i], 2);
    magnitudeB += Math.pow(b[i], 2);
  }
  return dotProduct / Math.sqrt(magnitudeA * magnitudeB);
}
