Pumpkin
===============

## Description

Talk with pumpkin on Halloween

## Installation

`npm install`

## Dependencies

Generally, running `npm install` should suffice.

This module however, requires you to install [SoX](http://sox.sourceforge.net).

### For Mac OS
`brew install sox`

### For most linux disto's
`sudo apt-get install sox libsox-fmt-all`

### For Windows
[download the binaries](http://sourceforge.net/projects/sox/files/latest/download)

## Usage

`STT=WIT STT_TOKEN=XXX STT_DELAY=3000 TTS=GOOGLE TTS_LANG=ru node index.js`

`STT=WATSON STT_USERNAME=XXX STT_PASSWORD=XXX TTS=WATSON TTS_USERNAME=XXX TTS_PASSWORD=XXX node index.js`
