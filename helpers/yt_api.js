const axios = require("axios");
const YoutubeMusicApi = require('youtube-music-api');

async function initialize() {
    const api = new YoutubeMusicApi();
    const info = await api.initalize() // Retrieves Innertube Config
    console.log('YT Info', info);
    return api;
}

class YTMusicAPI {
    constructor() {}
    async init() {
        this.api = await initialize();
    }
    async getSearchSuggestions(request) {
        try {
            return await this.api.getSearchSuggestions(request.query.query);
        } catch (e) {
            console.log(e);
            return {
                error: e.message
            };
        }
    }
    async search(request) {
        // console.log(request, "search req")
        try {

            let category = "song";
            const categoryData = await this.api.search(request, category);
            // console.log(categoryData);
            // const songs = categoryData.content;
            const videos = categoryData.content;

            // console.log(videos.length);
            const index = Math.floor(Math.random() * (0 + videos.length) + 0);
            // console.log(index);
            const video = videos[index];
            // console.log(video , 'vid');
            const videoId = video.videoId;

            // console.log(videoId,'vidId')

            // const options = {
            //     method: 'GET',
            //     url: 'https://t-one-youtube-converter.p.rapidapi.com/api/v1/createProcess',
            //     params: { 
            //         url: `https://www.youtube.com/watch?v=${videoId}`,
            //         format: 'mp3',
            //         responseFormat: 'json',
            //         lang: 'en'
            //     },
            //     headers: {
            //         'X-RapidAPI-Key': process.env.RAPID_API_KEY,
            //         'X-RapidAPI-Host': 't-one-youtube-converter.p.rapidapi.com',
            //     }
            // };

            const options = {
                method: 'GET',
                url: 'https://youtube-music-downloader-mp3.p.rapidapi.com/get_download_url',
                params: {
                    id: `${videoId}`,
                    ext: 'mp3'
                },
                headers: {
                    'X-RapidAPI-Key': 'b8f2727860msh253b45ec7aa1e12p1357dbjsn45153a422123',
                    'X-RapidAPI-Host': 'youtube-music-downloader-mp3.p.rapidapi.com'
                }
            };


            const result = await axios.request(options).then(function (response) {
                const data = response.data;
                // console.log(data,'res data');
                return data.result;
            }).catch(function (error) {
                console.error(error);
            });

            const song = {
                ...video,
                url: result.download_url
            };

            return song;

        } catch (e) {
            console.log(e);
            return {
                error: e.message
            };
        }
    }
    async getSong(request) {
        try {
            return await this.api.getNext(request, "OLAK5uy_kmQb2K43r1OklfBu17ZAj077sZejmaq9o", "video");
        } catch (e) {
            console.log(e);
            return {
                error: e.message,
                e
            };
        }
    }
    async getArtist(request) {
        try {
            return await this.api.getArtist(request.params.id);
        } catch (e) {
            console.log(e);
            return {
                error: e.message
            };
        }
    }
    async getAlbum(request) {
        try {
            return await this.api.getAlbum(request.params.id);
        } catch (e) {
            console.log(e);
            return {
                error: e.message
            };
        }
    }
    async getPlaylist(request) {
        try {
            return await this.api.getPlaylist(request.params.id);
        } catch (e) {
            return {
                error: e.message
            };
        }
    }
}

module.exports = YTMusicAPI;