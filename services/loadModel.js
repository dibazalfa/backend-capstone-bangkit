const tf = require('@tensorflow/tfjs-node');

async function loadModel(modelUrl) {
    return tf.loadGraphModel(modelUrl);
}

module.exports = loadModel;
