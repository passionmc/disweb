// Definitions
const express = require("express"),
    cors = require("cors"),
    app = express();

const { Client, Intents } = require('discord.js');

app.use(cors());

/// OAuth2 
const fetch = require("node-fetch")
const randomstring = require("randomstring");

require("dotenv").config()
const PORT = process.env.PORT || '80';
const CLIENT_SECRET = process.env.port || 'WmrM3betfCuAIfAP2uFkivIhDn8soUfk';

// api things 


var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

const Discord = require("discord.js"),
    client = new Discord.Client({ intents: [Intents.FLAGS.GUILD_MEMBERS] })
/// Intent: { intents: [Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD] }

const name = require("../package.json").name,
    description = require("../package.json").description,
    version = require("../package.json").version,
    author = require("../package.json").author,
    url = require("../package.json").repository.url;

// ROUTES
app.get("/", cors(corsOptions), (req, res) => {
    const mainpage = ({"API": `${name}`, "\description": `${description}`, "API Version is": `${version}`, "The Github Rep": `${url}` });
    return res.send(mainpage)
});


app.get("/callback", cors(corsOptions), (req, res) => {
    const fragment = new URLSearchParams();
    const [accessToken, tokenType] = [fragment.get('code'), fragment.get('token_type')];

    if (!accessToken) {
        const callback = (`Hello! Here is your api token: ${fragment.get('code')}`);
        return res.send(callback)
    }
    fetch('https://discord.com/api/users/@me', {
        headers: {
            authorization: `${tokenType} ${accessToken}`,
        },
    })
        .then(result => result.json())
        .then(response => {
            return
        })
        .catch(console.error);
    console.log(accessToken)
    const callback = (`Hello! Here is your api token: ${fragment.get('code')}`);
    return res.send(callback)
});


app.get("/v1", cors(corsOptions), (req, res) => {
    const v1page = (`Oops! The v1 route is only for the v1.X.X version! https://invalidlenni.gitbook.io/disweb/ for Documentation`);
    return res.send(v1page) 
});

// GET USER INFORMATION
app.get("/v1/user/:userID", cors(corsOptions), (req, res) => {
    client.users.fetch(req.params.userID).then((user) => {
        const results = ({ username: `${user.username}`, is_bot: user.bot, discriminator: `${user.discriminator}`, avatar_url: `${user.displayAvatarURL({ format: "png", size: 4096, dynamic: true })}`, banner_url: `${user.bannerURL({ format: "png", dynamic: true })}`, creation_date: `${user.createdAt}`, creation_timestamp: user.createdTimestamp});
        return res.send(results);
    });
});

// THE BOT MUST BE ON THE GUILD FOR FETCH THE GUILD INFORMATIONS!
app.get("/v1/guild/:guildID", cors(corsOptions), (req, res) => {
    client.guilds.fetch(req.params.guildID).then((guild) => {
        const results = ({ guildID: `${guild.id}`, guildname: `${guild.name}`, guildicon_url: `${guild.iconURL({ size: 4096, dynamic: true })}`, guildroles_count: `${guild.roles.cache.size}`, guildusers_count: `${guild.members.cache.size}`, guildemojis_count: `${guild.emojis.cache.size}`, guildownerID: `${guild.ownerID}`, guildcreation_date: `${guild.createdAt}`, guildcreation_timestamp: guild.createdTimestamp});
        return res.send(results);
    });
});

app.get("/v1/widget/:GUILDID", cors(corsOptions), (req, res) => {
    client.fetchGuildWidget(req.params.GUILDID).then((widget) => {
        const results = ({ guildID: `${widget.guild.id}`, guildname: `${widget.guild.name}`, guildicon_url: `${widget.guild.iconURL({ size: 4096, dynamic: true })}`, guildroles_count: `${widget.guild.roles.cache.size}`, guildusers_count: `${widget.guild.members.cache.size}`, guildemojis_count: `${widget.guild.emojis.cache.size}`, guildownerID: `${widget.guild.ownerID}`, guildcreation_date: `${widget.guild.createdAt}`, guildcreation_timestamp: widget.guild.createdTimestamp});
        return res.send(results);
    });
});

app.use(function (req, res, next) {
    res.status(404).send("Sorry, can't find that!")
});

app.use(function (req, res, next) {
    res.status(201).send("Missing parameters!")
});


app.use(function (req, res, next) {
    res.status(403).send("Missing access")
});

// API START
client.on("ready", () => {
    console.log(`The API is now online! Bot: ${client.user.username}`)
});

app.listen(PORT, console.log(`discord-web-api is listing to`, PORT));

client.login(process.env.TOKEN);