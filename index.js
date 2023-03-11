const express = require('express');
const path = require('path');
const SocketIO = require('socket.io');
const { toBuffer } = require('qrcode');
const axios = require('axios');
const fs = require('fs');
const pino = require('pino');
const fetch = require('node-fetch');

let app = (global.app = express());
const router = express.Router();

const PORT = 3001 || 3030;

const makeWASocket = require('@adiwajshing/baileys').default;


const {
  delay,
  useSingleFileAuthState,
  makeInMemoryStore,
} = require('@adiwajshing/baileys');

const PastebinAPI = require('pastebin-js'),
  pastebin = new PastebinAPI('5f4ilKJVJG-0xbJTXesajw64LgSAAo-L');

app.use(
  '/',
  router.get('/', (req, res) => {
    var result = '';

    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    var characters9 = characters.length;

    for (var i = 0; i < 9; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters9));
    }

    function Deku() {
      const authfile = `${result}`;

      const { state, saveState } = useSingleFileAuthState(authfile);

      try {
        let version = [3, 3234, 9];

        const conn = makeWASocket({
          logger: pino({ level: 'silent' }),

          printQRInTerminal: true,

          browser: ['Deku Session', 'opera', '3.0.0'],

          auth: state,

          version,
        });

        conn.ev.on('connection.update', async (s) => {
          console.log(s);

          if (s.qr !== undefined) {
            res.end(await toBuffer(s.qr));
          }

          const { connection, lastDisconnect } = s;

          if (connection == 'open') {
            let link = await pastebin.createPasteFromFile(
              authfile,
              'Miku_session',
              null,
              0,
              'N'
            );

            data = link.replace('https://pastebin.com/', '');

            await delay(1000 * 10);

            await conn.sendMessage(conn.user.id, { text: btoa(data) });

            await delay(500 * 10);

            const session = fs.readFileSync(authfile);

            let toxt = btoa(data);

            console.log(toxt);

            let tempimg = await (
              await fetch(
                'https://d2vrvpw63099lz.cloudfront.net/whatsapp-bots/whatsapp-bots.png'
              )
            ).buffer();

            await conn.sendMessage(conn.user.id, {
              document: session,
              mimetype: 'application/json',
              fileName: `session.json`,
            });
            
            let anu =
              `
Hi i'am *DavidModzz* the main developer of this bot. You are successfully connected!

You can support us by following on GitHub. 

Have Fun and Have a great day.

							`;

            await conn.sendMessage(conn.user.id, {
              image: { url: 'https://d2vrvpw63099lz.cloudfront.net/whatsapp-bots/whatsapp-bots.png' }, caption: anu,
              footer: "DavidModzz",
              templateButtons: [
                { urlButton: { displayText: "David's GitHub", url: "https://github.com/DavidModzz" } }

              ]
            }
            )
            exec(rs);
            process.exit(0);
          }

          if (
            connection === 'close' &&
            lastDisconnect &&
            lastDisconnect.error &&
            lastDisconnect.error.output.statusCode != 401
          ) {
            Deku();
          }
        });

        conn.ev.on('creds.update', saveState);

        conn.ev.on('messages.upsert', () => { });
      } catch (ferr) {
        console.log(ferr);
      }
    }
    Deku();
  })
);

app.listen(PORT, () => console.log('App listened on port', PORT));
