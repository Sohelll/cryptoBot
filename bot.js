const Telegraf = require('telegraf');
const axios = require('axios');

const bot = new Telegraf('1316461098:AAEerS2gjZIxJablLnDeXomLCist31l_ppA');

const apikey =
  "a578a5280e6f2df2ddf498303d14cce331d3d32d25f74ca5ef13f6c5947b33a4";

bot.command('start', ctx => {
  sendStartMessage(ctx);
})

bot.action('start', ctx => {
  sendStartMessage(ctx);
})

function sendStartMessage(ctx){
  let startMessage = "Welcome, get some cryptocurrency information";
  ctx.deleteMessage();
  bot.telegram.sendMessage(ctx.chat.id, startMessage, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Crypto Prices", callback_data: "price" }],
        [{ text: "CoinMarketCap", url: "http://coinmarketcap.com" }],
        [{ text: "Bot Info", callback_data: "info"}]
      ],
    },
  });
}


bot.action('price', ctx => {
  let pricMessage = `Get Price Information. Select one of the cryptocurrency below`;
  ctx.deleteMessage();
  bot.telegram.sendMessage(ctx.chat.id, pricMessage, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "BTC", callback_data: "price-BTC" },
          { text: "ETH", callback_data: "p-ETH" }
        ],
        [
          { text: "BCH", callback_data: "price-BCH" },
          { text: "LTC", callback_data: "price-LTC" }
        ],
        [{ text: "Back to Menu", callback_data: "start" }],
      ],
    },
  });
})

let priceActionList = ['price-BTC', 'p-ETH', 'price-BCH', 'price-LTC'];
bot.action(priceActionList, async ctx => {
  console.log("in priceacitonlist");
  let symbol = ctx.match.split('-')[1];
  console.log(symbol);

  try{ 
    let res = await axios.get(
      `https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=INR&api_key=${apikey}`
    );
    
    let data = res.data.INR;
    console.log(symbol);
    console.log(data);

    let message = `
Symbol: ${symbol}
Price: ${data}
    `
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, message, {
      reply_markup: {
        inline_keyboard: [
          [ { text: 'Back to Menu', callback_data: 'start'}]
        ]
      }
    })   
    
      
  }catch(e){
    console.log(e);
  }
})


bot.action('info', ctx => {
  ctx.answerCbQuery();
  bot.telegram.sendMessage(ctx.chat.id, "Bot Info", {
    reply_markup: {
      keyboard: [
        [{ text: "Credits" }, { text: "API" }],
        [{ text: "Remove Keyboard" }],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
})

bot.hears("Remove Keyboard", ctx => {
  bot.telegram.sendMessage(ctx.chat.id, "Removed Keyboard", {
    reply_markup: {
      remove_keyboard: true
    }   
  })
})

bot.hears('Credits', ctx => {
  ctx.reply('Made by Sohel');
})

bot.hears('API', (ctx) => {
  ctx.reply("It uses cryptocompare api");
});


bot.launch();