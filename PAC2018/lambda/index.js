'use strict';

/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */

// Null safe getter for json. Will return null if any value in the path is null.
const get = (p, o) => p.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, o);

const products = {
  'ECHO_DOT': {
    'COLORS': ['black', 'white'],
    'PRICE': 49.99,
    'RATING': 5,
    'SPOKEN_NAME': 'echo dot',
    'DETAILS': [
        "Echo Dot is a hands-free, voice-controlled device that uses Alexa to play music, control smart home devices, make calls, send and receive messages, provide information, read the news, set music alarms, read audiobooks from Audible, control Amazon Video on Fire TV, and more",
        "Echo Dot connects to speakers or headphones through Bluetooth or 3.5 mm stereo cable to play music from Amazon Music, Spotify, Pandora, iHeartRadio, and TuneIn. Play music simultaneously across Echo devices and speakers connected via cable with multi-room music.",
        "Call or message almost anyone hands-free with your Echo device. Also, instantly connect to other Echo devices in your home using just your voice.",
        "Echo Dot controls lights, fans, TVs, switches, thermostats, garage doors, sprinklers, locks, and more with compatible connected devices from WeMo, Philips Hue, Sony, Samsung SmartThings, Nest, and others",
        "Echo Dot hears you from across the room with 7 far-field microphones for hands-free control, even in noisy environments or while playing music",
        "Echo Dot includes a built-in speaker so it can work on its own as a smart alarm clock in the bedroom, an assistant in the kitchen, or anywhere you might want a voice-controlled computer; Amazon Echo is not required to use Echo Dot",
        "Always getting smarter and adding new features, plus thousands of skills like Uber, Domino's, DISH, and more"
    ],
  }, 
  'ECHO_SHOW': {
    'COLORS': ['black'],
    'PRICE': 229.99,
    'RATING': 4,
    'FEATURES': ['BABY_MONITOR'],
    'SPOKEN_NAME': 'echo show',
    'DETAILS': [
        "Echo Show brings you everything you love about Alexa, and now she can show you things. Watch video flash briefings, Amazon Video content, see music lyrics, security cameras, photos, weather forecasts, to-do and shopping lists, browse and listen to Audible audiobooks, and more. All hands-free—just ask.",
        "Call almost anyone hands-free, or make video calls to family and friends with an Echo Spot, Echo Show, or the Alexa App. Instantly connect to other Echo devices around your home.",
        "See lyrics on-screen with Amazon Music. Just ask to play a song, artist or genre, and stream over Wi-Fi. Also, stream music on Pandora, Spotify, TuneIn, iHeartRadio, and more.",
        "Echo Show has powerful, room-filling speakers with Dolby processing for crisp vocals and extended bass response. Play your music simultaneously across Echo devices with multi-room music (Bluetooth not supported).",
        "Ask Alexa to show you the front door or monitor the baby's room with compatible cameras from Amazon and others. Turn on lights or the TV, set thermostats, control Amazon Video on Fire TV, and more with WeMo, Philips Hue, Sony, ecobee, and other compatible smart home devices.",
        "With eight microphones, beam-forming technology, and noise cancellation, Echo Show hears you from any direction—even while music is playing",
        "Echo Show is always getting smarter and adding new features, plus thousands of skills like Uber, Allrecipes, CNN, and more"
    ],
  },
  'KIND_BAR': {
    'FLAVORS': ['dark chocolate nuts and sea salt'],
    'PRICE': 24.99,
    'RATING': 5,
    'SIZE': [12],
    'SPOKEN_NAME': 'kind bars',
    'DETAILS': [
        "Contains 12 - 1.4oz KIND Bars",
        "Our best-selling bar is a simple blend of Brazilian sea salt sprinkled over whole nuts and drizzled with dark chocolate.",
        "With 5g of sugar, it's a satisfying, nutty snack that only seems indulgent.",
        "Gluten free, Non GMO, 0g Trans Fat, Kosher",
        "Low glycemic index, low sodium, good source of fiber",
        "Sweet and salty blend of almonds, peanuts, and walnuts drizzled in chocolate with a touch of sea salt",
        "Provides all natural protein, fiber and only 5g of sugar",
        "Finely crafted from the highest quality whole nuts and nature's most delicious spices",
        "KIND is a brand of delicious, natural, healthful foods made from wholesome ingredients you can see & pronounce"
    ],
  },
  'SUPER_MARIO_ODYSSEY': {
    'AGE_RESTRICT': 10,
    'PRICE': 48.75,
    'RATING': 5,
    'SPOKEN_NAME': 'super mario odyssey',
    'DETAILS': [
        "Explore huge 3D kingdoms filled with secrets and surprises, including costumes for Mario and lots of ways to interact with the diverse environments - such as cruising around them in vehicles that incorporate the HD Rumble feature of the Joy-Con controller or exploring sections as Pixel Mario.",
        "Thanks to his new friend, Cappy, Mario has brand-new moves for you to master, like cap throw, cap jump and capture. With capture, Mario can take control of all sorts of things, including objects and enemies!",
        "Visit astonishing new locales, like skyscraper-packed New Donk City, and run into familiar friends and foes as you try to save Princess Peach from Bowser's clutches and foil his dastardly wedding plans.",
        "A set of three new amiibo figures* - Mario, Princess Peach and Bowser in their wedding outfits - will be released at launch. Some previously released amiibo will also be compatible with this title. Tap supported amiibo to receive gameplay assistance - some amiibo will also unlock costumes for Mario when scanned!"
    ],
  }
};

const productCategories = {
  'ECHO': ['ECHO_DOT', 'ECHO_SHOW'],
  'FOOD': ['KIND_BAR'],
  'NINTENDO_SWITCH': ['SUPER_MARIO_ODYSSEY']
};

const customerQA = {
    "difference between dot and echo": "The Echo has speakers suitable for listening to music on, while the Echo Dot has a speaker that is only good enough for the commands and alarms. If you want to listen to music with the Dot, you'll want to connect speakers to it.",
}

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
            content: `SessionSpeechlet - ${output}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}

function buildDelegateDirectiveSpeechletResponse() {
    return {
      outputSpeech : null,
      card : null,
      directives : [ {
        type : 'Dialog.Delegate'
      } ],
      reprompt : null,
      shouldEndSession : false
    }
  }

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    const sessionAttributes = {};
    const cardTitle = 'Welcome';
    const speechOutput = 'Welcome to the Alexa Shopping App. ' +
        'Please ask me a question you have about any Amazon product.';
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    const repromptText = 'Please ask me a question you have about any Amazon product. For example ' +
        'what colors does echo dot come in?';
    const shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    const cardTitle = 'Session Ended';
    const speechOutput = 'Thank you for trying the Alexa Skills Kit sample. Have a nice day!';
    // Setting this to true ends the session and exits the skill.
    const shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

/**
 * Get product attributes to answer customer question.
 */
function handleGetProductAttributesIntent(intent, session, callback) {
    const cardTitle = intent.name;
    let sessionAttributes = {};
    
    const productSlot = intent.slots.Product;
    const productAttributeSlot = intent.slots.ProductAttribute;
    let repromptText = "Please ask a question.";
    let speechOutput = "I'm not sure what product or attribute you are referring to.";

    if (productSlot && productAttributeSlot) {
        const productId = getResolutionIdFromSlot(productSlot);
        const attributeId = getResolutionIdFromSlot(productAttributeSlot);
        const productName = getResolutionNameFromSlot(productSlot);
        const attributeName = getResolutionNameFromSlot(productAttributeSlot);
        let attributeValues = get([productId, attributeId], products);
        
        if (attributeValues) {
            if (!(attributeValues instanceof Array)) {
                attributeValues = [attributeValues]
            }
            
            if (attributeValues.length > 1) {
                speechOutput = `${productName} has the following ${attributeName}: ${attributeValues.join(', ')}.`;
            } else {
                speechOutput = `${productName}'s ${attributeName} is ${attributeValues[0]}.`;
            }
        } else {
            speechOutput = `No ${attributeName} found available for ${productName}.`
        }
    }

    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, false));
}

function handleCompareProductsInCategoryIntent(intent, session, callback) {
    const cardTitle = intent.name;
    let sessionAttributes = {};
    
    const comparatorSlot = intent.slots.Comparator;
    const productCategorySlot = intent.slots.ProductCategory;
    let repromptText = "Please ask a question.";
    let speechOutput = "I don't support this comparison currently.";
    let productName = '';
    let comparatorName = '';
    
    if (comparatorSlot && productCategorySlot) {
        const comparatorId = getResolutionIdFromSlot(comparatorSlot);
        const categoryId = getResolutionIdFromSlot(productCategorySlot);
        const categoryName = getResolutionNameFromSlot(productCategorySlot);
        comparatorName = getResolutionNameFromSlot(comparatorSlot);
        if (comparatorId === 'CHEAPEST') {
            const productId = productCategories[categoryId].reduce((p1, p2) => {
                return products[p1]['PRICE'] < products[p2]['PRICE'] ? p1 : p2;
            });
            productName = get([productId, 'SPOKEN_NAME'], products);
        } else if (comparatorId === 'MOST_EXPENSIVE') {
            const productId = productCategories[categoryId].reduce((p1, p2) => {
                return products[p1]['PRICE'] > products[p2]['PRICE'] ? p1 : p2;
            });
            productName = get([productId, 'SPOKEN_NAME'], products);
        } else if (comparatorId === 'LOWEST_RATED') {
            const productId = productCategories[categoryId].reduce((p1, p2) => {
                return products[p1]['RATING'] < products[p2]['RATING'] ? p1 : p2;
            });
            productName = get([productId, 'SPOKEN_NAME'], products);
        } else if (comparatorId === 'HIGHEST_RATED') {
            const productId = productCategories[categoryId].reduce((p1, p2) => {
                return products[p1]['RATING'] > products[p2]['RATING'] ? p1 : p2;
            });
            productName = get([productId, 'SPOKEN_NAME'], products);
        }
        
        if (productName && comparatorName) {
            speechOutput = `The ${comparatorName} ${categoryName} is ${productName}.`
        }
    }
    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, false));
}

// Example questions:
// 1. Can Echo Dot be used as a baby monitor?
// 2. Does the Echo Dot have Spotify?
// 3. Can Echo Dot support Spotify?
// 3. Does Echo Dot have a smart home controller?
// 4. Can Echo Dot control smart bulbs?
function handleCanProductIntent(intent, session, callback) {
    const cardTitle = intent.name;
    let sessionAttributes = {};
    
    const productSlot = intent.slots.Product;
    const productFeatureSlot = intent.slots.ProductFeature;
    let repromptText = "Please ask a question.";
    let speechOutput = "I'm not sure what you are asking for.";
    
    if (productSlot && productFeatureSlot) {
        const productId = getResolutionIdFromSlot(productSlot);
        const featureId = getResolutionIdFromSlot(productFeatureSlot);
        const featureValue = getResolutionValueFromSlot(productFeatureSlot);

        var productDetailsList = null;
        if (productId && (productId in products)) {
            productDetailsList = get([productId, 'DETAILS'], products);

            var featureDetails = null;
            if (productDetailsList.length > 0) {
                featureDetails = findFeatureInDetails(featureValue, productDetailsList);
            }

            if (featureDetails) {
                speechOutput = featureDetails;
            } else {
                speechOutput = "No.";
            }

            // if (productId) {

            //     if (productHasFeature(productId, featureId)) {
            //         featureFound = true;

            //         speechOutput = "Yes.";        
            //     } else if () 
            //         speechOutput = 
            //     } else {
            //         speechOutput = "No.";
            //     }

        } else {
            speechOutput = "I don't recognize this product";
        }
    }
    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, false));
}

function handleCustomerQAIntent(intent, session, callback) {
    const cardTitle = intent.name;
    let sessionAttributes = {};
    
    const questionSlot = intent.slots.Question;
    let repromptText = "Please ask a question.";
    let speechOutput = "I'm not sure what you are asking for.";
    
    if (questionSlot) {
        const question = questionSlot.value;
        const answer = customerQA[question];
        if (answer) {
            speechOutput = answer;
        } else {
            speechOutput = "Sorry I don't know.";
        }
    }
    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, false));
}

function handleAgeRestrictionIntent(intent, session, callback) {
    const cardTitle = intent.name;
    let sessionAttributes = session.attributes || {};
    
    const actionSlot = intent.slots.Action;
    const productSlot = intent.slots.Product;
    const personSlot = intent.slots.Person;
    const ageSlot = intent.slots.Age;
    let repromptText = "Please ask a question.";
    let speechOutput = "I'm not sure what you are asking for.";
    
    if (ageSlot && ageSlot.value) {
        const productId = getResolutionIdFromSlot(productSlot);
        const actionName = getResolutionNameFromSlot(actionSlot);
        const personName = getResolutionNameFromSlot(personSlot);
        const minAge = get([productId, 'AGE_RESTRICT'], products) || 0;
        const productName = get([productId, 'SPOKEN_NAME'], products);
        if (ageSlot.value >= minAge) {
            speechOutput = `Your ${personName} is old enough to ${actionName} ${productName}.`;
        } else {
            speechOutput = `Your ${personName} is not old enough to ${actionName} ${productName}.`;
        }
    } else if (actionSlot && productSlot && personSlot) {
        callback(sessionAttributes,
            buildDelegateDirectiveSpeechletResponse());
        return;
    }
    
    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, false));    
}

function handleGetProductDetailsIntent(intent, session, callback) {
    const cardTitle = intent.name;
    let sessionAttributes = {};
    
    const productSlot = intent.slots.Product;
    let repromptText = "Please ask a question.";
    let speechOutput = "I'm not sure what product you are referring to.";

    if (productSlot) {
        const productId = getResolutionIdFromSlot(productSlot);
        const productName = getResolutionNameFromSlot(productSlot);
        const productDetails = get([productId, 'DETAILS'], products)
        speechOutput = `No ${productName} found available for ${productName}.`
        
        if (productDetails) {
          speechOutput = `${productDetails.join(' ')}.`;
        } else {
          speechOutput = `I don't have information on ${productName}.`
        }
    }

    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, false));
}

// --------------- Events -----------------------

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if (intentName === 'GetProductAttributesIntent') {
        handleGetProductAttributesIntent(intent, session, callback);
    } else if (intentName === 'CompareProductsInCategoryIntent') {
        handleCompareProductsInCategoryIntent(intent, session, callback);
    } else if (intentName === 'CanProductIntent') {
        handleCanProductIntent(intent, session, callback);
    } else if (intentName === 'CustomerQAIntent') {
        handleCustomerQAIntent(intent, session, callback);
    } else if (intentName === 'AgeRestrictionIntent') {
        handleAgeRestrictionIntent(intent, session, callback);
    } else if (intentName === "GetProductDetailsIntent") {
        handleGetProductDetailsIntent(intent, session, callback);
    } else if (intentName === 'AMAZON.FallbackIntent') {
        handleFallbackRequest(intent, session, callback);
    } else if (intentName === 'AMAZON.HelpIntent') {
        getWelcomeResponse(callback);
    } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
        handleSessionEndRequest(callback);
    } else {
        throw new Error('Invalid intent');
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
    // Add cleanup logic here
}

/**
 * Called when user utterance is not mapped to an intent.
 */
function handleFallbackRequest(intent, session, callback) {
    const cardTitle = intent.name;
    const sessionAttributes = {};
    let repromptText = "Please ask a question.";
    let speechOutput = "I'm not sure what you are asking for.";
    
    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, false));
}


// --------------- Main handler -----------------------

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = (event, context, callback) => {
    try {
        console.log(`event.session.application.applicationId=${event.session.application.applicationId}`);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== 'amzn1.echo-sdk-ams.app.[unique-value-here]') {
             callback('Invalid Application ID');
        }
        */

        if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            callback();
        }
    } catch (err) {
        callback(err);
    }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Helper functions
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getResolutionIdFromSlot(slot) {
  return get(['resolutions', 'resolutionsPerAuthority', 0, 'values', 0, 'value', 'id'], slot);
}

function getResolutionNameFromSlot(slot) {
  return get(['resolutions', 'resolutionsPerAuthority', 0, 'values', 0, 'value', 'name'], slot);
}

function getResolutionValueFromSlot(slot) {
  return get(['value'], slot);
}

function productHasFeature(productId, featureId) {
    console.log(productId);
    let features = get([productId, 'FEATURES'], products);
    console.log(features);
    return features && features.includes(featureId);
}

// Finds a search phrase in the product details and
// returns all the lines that contain that search phrase.
function findFeatureInDetails(feature, productDetailsList) {
    var outputDetailList = [];

    for (var i = 0; i < productDetailsList.length; ++i) {
        const detail = productDetailsList[i];
        if (isStringInText(feature, detail)) {
            outputDetailList.push(detail);
        }
    }

    if (outputDetailList.length == 0) {
        return null;
    } else {
        return outputDetailList.join(". ");
    }
}

// Finds a string in larger text (ignores case)
function isStringInText(string, text) {
    string = string.toLowerCase()
    if (text.toLowerCase().indexOf(string) != -1) {
        console.log("Found match for string [" + string + "] in text [" + text + "]");
        return true;
    }
}

