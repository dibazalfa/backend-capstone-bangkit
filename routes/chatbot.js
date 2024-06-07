const express = require('express');
const router = express.Router();
const tf = require('@tensorflow/tfjs-node');
const natural = require('natural');
const fs = require('fs');
const path = require('path');

// Path ke model dan resource lainnya
const MODEL_URL = `file://${path.join(__dirname, '..', 'model', 'saved_model')}`;
const INTENTS_URL = path.join(__dirname, '..', 'model', 'intents.json');
const WORDS_URL = path.join(__dirname, '..', 'model', 'words.json');
const CLASSES_URL = path.join(__dirname, '..', 'model', 'classes.json');

let model;
let intents;
let words;
let classes;

// Load model dan resource lainnya
const loadResources = async () => {
    try {
        model = await tf.loadGraphModel(MODEL_URL);
        intents = JSON.parse(fs.readFileSync(INTENTS_URL, 'utf8'));
        words = JSON.parse(fs.readFileSync(WORDS_URL, 'utf8'));
        classes = JSON.parse(fs.readFileSync(CLASSES_URL, 'utf8'));
        console.log('Resources loaded successfully');
    } catch (error) {
        console.error('Error loading resources:', error);
    }
};

const tokenizer = new natural.WordTokenizer();
const lemmatizer = natural.PorterStemmer;

const clean_up_sentence = (sentence) => {
    const sentence_words = tokenizer.tokenize(sentence);
    return sentence_words.map(word => lemmatizer.stem(word.toLowerCase()));
};

const bow = (sentence, words, show_details = true) => {
    const sentence_words = clean_up_sentence(sentence);
    const bag = Array(words.length).fill(0);
    sentence_words.forEach(s => {
        const index = words.indexOf(s);
        if (index > -1) {
            bag[index] = 1;
            if (show_details) console.log(`found in bag: ${s}`);
        }
    });
    return tf.tensor2d([bag]);
};

const predict_class = async (sentence) => {
    const p = bow(sentence, words, false);
    const res = await model.predict(p).data();
    const ERROR_THRESHOLD = 0.25;
    const results = [];
    res.forEach((probability, i) => {
        if (probability > ERROR_THRESHOLD) {
            results.push({ intent: classes[i], probability });
        }
    });
    results.sort((a, b) => b.probability - a.probability);
    return results;
};

const getResponse = (ints) => {
    const tag = ints[0].intent;
    const list_of_intents = intents.intents;
    for (const intent of list_of_intents) {
        if (intent.tag === tag) {
            return intent.responses[Math.floor(Math.random() * intent.responses.length)];
        }
    }
    return "I'm not sure what you mean.";
};

const chatbot_response = async (msg) => {
    const ints = await predict_class(msg);
    return getResponse(ints);
};

// Route untuk /predict
router.post('/predict', async (req, res) => {
    const { message } = req.body;
    const response = await chatbot_response(message);
    res.json({ response });
});

module.exports = {
    loadResources,
    router
};
