module.exports = getAbout;

function getAbout(remoteAddress) {
    return {
        "client": {
            "host": remoteAddress
        },
        "server": {
            "current_time": Date.now(),
            "services": [
                {
                    "name": "weather",
                    "widgets": [{
                        "name": "city_temperature",
                        "description": "display the temperature for a city",
                        "params": [{
                            "name": "city",
                            "type": "string"
                        }],
                    }],
                },
                {
                    "name": "youtube",
                    "widgets": [{
                        "name": "search_youtube_video",
                        "description": "display 5 youtube videos",
                        "params": [{
                            "name": "video",
                            "type": "string"
                        }],
                    }],
                },
                {
                    "name": "cinema",
                    "widgets": [{
                        "name": "search_movie",
                        "description": "display 3 movies that you search",
                        "params": [{
                            "name": "movie",
                            "type": "string"
                        }],
                    }],
                }
            ]
        }
    }
};