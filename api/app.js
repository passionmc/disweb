// Definitions
const express = require("express"),
    cors = require("cors"),
    app = express();

app.use(cors());



require("dotenv").config()
const PORT = process.env.PORT || '80';

// api things 


var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

const Discord = require("discord.js"),
    client = new Discord.Client();

const name = require("../package.json").name,
    description = require("../package.json").description,
    version = require("../package.json").version,
    author = require("../package.json").author,
    url = require("../package.json").repository.url;

// ROUTES
app.get("/", cors(corsOptions), (req, res) => {
    const mainpage = ({"API": `${name}`, "\description": `${description}`, "\nMade by": `${author}`, "\nAPI Version is": `${version}`, "The Github Rep": `${url}` });
    return res.send(mainpage)
});

app.get("/v1", cors(corsOptions), (req, res) => {
    const v1page = (`This is the v1 page from ${name}`);
    return res.send(v1page) 
});

// GET USER INFORMATION
app.get("/v1/user/:userID", cors(corsOptions), (req, res) => {
    client.users.fetch(req.params.userID).then((user) => {
        const results = ({ username: `${user.username}`, Bot: `${user.bot}`, discriminator: `${user.discriminator}`, avatar_url: `${user.displayAvatarURL({ format: "png", size: 4096, dynamic: true })}`, creation_date: `${user.createdAt}` });
        return res.send(results);
    });
});

// THE BOT MUST BE ON THE GUILD FOR FETCH THE GUILD INFORMATIONS!
app.get("/v1/guild/:guildID", cors(corsOptions), (req, res) => {
    client.guilds.fetch(req.params.guildID).then((guild) => {
        const results = ({ guildID: `${guild.id}`, guildname: `${guild.name}`, guildicon_url: `${guild.iconURL({ size: 4096, dynamic: true })}`, guildroles_count: `${guild.roles.cache.size}`, guildusers_count: `${guild.members.cache.size}`, guildemojis_count: `${guild.emojis.cache.size}`, guildownerID: `${guild.ownerID}`, guildcreation_date: `${guild.createdAt}`});
        return res.send(results);
    });
});

app.use(function (req, res, next) {
    res.status(404).send("Sorry, can't find that! The route is [/vX/user/:USERID] or [/vX/guild/:GUILDID]")
});

app.use(function (req, res, next) {
    res.status(201).send("Missing parm")
});


app.use(function (req, res, next) {
    res.status(403).send("Missing access")
});

app.use(function (req, res, next) {
    res.status(500).send("Internal Server Error")
});

// API START
client.on("ready", () => {
    console.log(`The API is now online! Bot: ${client.user.username}`)
});

app.listen(PORT, console.log(`discord-web-api is listing to`, PORT));

client.login(process.env.TOKEN);