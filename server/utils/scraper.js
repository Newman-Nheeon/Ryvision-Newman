require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');

// Instagram Scraping
async function scrapeInstagramFollowers(username) {
    const url = `https://www.instagram.com/${username}/`;
    try {
        console.log(`Requesting Instagram page: ${url}`);
        const response = await axios.get(url);
        console.log(`Received response for Instagram page`);

        const $ = cheerio.load(response.data);
        const script = $('script[type="text/javascript"]').eq(3).html();
        const jsonData = JSON.parse(script.match(/window\._sharedData = (.+);/)[1]);
        const userId = jsonData.entry_data.ProfilePage[0].graphql.user.id;

        console.log(`Extracted user ID: ${userId}`);

        const followersUrl = `https://i.instagram.com/api/v1/friendships/${userId}/followers/`;
        console.log(`Requesting followers URL: ${followersUrl}`);

        const followersResponse = await axios.get(followersUrl, {
            headers: {
                'User-Agent': 'Instagram 155.0.0.37.107',
                'Cookie': `sessionid=${process.env.INSTAGRAM_SESSION_ID}`
            }
        });

        console.log(`Received followers data from Instagram`);

        return followersResponse.data.users.map(user => ({
            platform: 'Instagram',
            username: user.username,
            full_name: user.full_name
        }));
    } catch (error) {
        console.error('Error scraping Instagram followers:', error.response ? error.response.data : error.message);
        throw new Error('Error scraping Instagram followers');
    }
}

// Facebook Scraping
async function scrapeFacebookFollowers(username) {
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    const url = `https://graph.facebook.com/v12.0/${username}/followers?access_token=${accessToken}`;

    try {
        const response = await axios.get(url);
        return response.data.data.map(user => ({
            platform: 'Facebook',
            username: user.username,
            full_name: user.name
        }));
    } catch (error) {
        console.error('Error scraping Facebook followers:', error);
        throw new Error('Error scraping Facebook followers');
    }
}

// TikTok Scraping
async function scrapeTikTokFollowers(username) {
    const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
    const url = `https://open-api.tiktok.com/v2/user/${username}/followers?access_token=${accessToken}`;

    try {
        const response = await axios.get(url);
        return response.data.data.map(user => ({
            platform: 'TikTok',
            username: user.username,
            full_name: user.full_name
        }));
    } catch (error) {
        console.error('Error scraping TikTok followers:', error);
        throw new Error('Error scraping TikTok followers');
    }
}

module.exports = { scrapeInstagramFollowers, scrapeFacebookFollowers, scrapeTikTokFollowers };
